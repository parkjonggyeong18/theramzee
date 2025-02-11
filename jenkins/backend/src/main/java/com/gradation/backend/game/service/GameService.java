package com.gradation.backend.game.service;

import com.gradation.backend.common.utill.RedisUtil;
import com.gradation.backend.game.model.response.*;
import com.gradation.backend.openvidu.service.OpenViduService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GameService {

    private final RedisUtil redisUtil;
    private final OpenViduService openViduService;

    /**
     * 방 정보 조회 (테스트용)
     *
     * @param roomId: 조회할 방의 Id
     * @return 방의 전체 정보를 담은 Map
     */
    /**
     * 방 정보 조회
     *
     * @param roomId: 조회할 방의 Id
     * @return 방의 전체 정보를 담은 RoomInfoResponseDto
     */
    public RoomInfoResponse getRoomInformation(int roomId) {
        RoomInfoResponse roomInfo = new RoomInfoResponse();
        String roomKey = "ROOM:" + roomId;

        Map<String, UserResponse> users = new HashMap<>();
        Map<String, ForestResponse> forests = new HashMap<>();

        // 1. Users 데이터 조회
        for (int userNum = 1; userNum <= 6; userNum++) {
            String userKey = roomKey + ":USER:" + userNum;
            Map<Object, Object> userData = redisUtil.hgetAll(userKey);
            if (!userData.isEmpty()) {
                UserResponse user = new UserResponse();
                user.setNickname((String) userData.get("nickname"));
                user.setAlive((Boolean) userData.get("alive"));
                user.setAcorns((Integer) userData.get("acorns"));
                user.setFatigue((Integer) userData.get("fatigue"));
                user.setForestToken((String) userData.get("forestToken"));
                user.setEvilSquirrel((Boolean) userData.get("isEvilSquirrel"));
                users.put(userKey, user);
            }
        }

        // 2. Forests 데이터 조회
        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            String forestKey = roomKey + ":FOREST:" + forestNum;
            Map<Object, Object> forestData = redisUtil.hgetAll(forestKey);
            if (!forestData.isEmpty()) {
                ForestResponse forest = new ForestResponse();
                forest.setEmergencyPossible((Boolean) forestData.get("emergencyPossible"));
                forest.setTotalAcorns((Integer) forestData.get("totalAcorns"));

                // MissionData 객체 설정
                if (forestNum != 1) {
                    for (int i = 1; i <= 3; i++) {
                        String missionKey = "mission" + i;
                        if (forestData.containsKey(missionKey)) {
                            MissionData missionData = (MissionData) forestData.get(missionKey);
                            switch (i) {
                                case 1: forest.setMission1(missionData); break;
                                case 2: forest.setMission2(missionData); break;
                                case 3: forest.setMission3(missionData); break;
                            }
                        }
                    }
                }
                forests.put(forestKey, forest);
            }
        }

        roomInfo.setUsers(users);
        roomInfo.setForests(forests);

        return roomInfo;
    }


    /**
     * 시작하기 클릭 시 방 초기화
     * 오픈비두 세션 추가 생성 (Forest 2 ~ 7)
     *
     * @param roomId: 해당 방의 Id
     * @param nicknames: 모든 참가자의 닉네임
     * @return 방의 전체 정보를 담은 Map
     */
    public RoomInitializationResponse initializeRoomStructure(int roomId, List<String> nicknames)
            throws OpenViduJavaClientException, OpenViduHttpException {
        RoomInitializationResponse responseDto = new RoomInitializationResponse();
        Map<String, UserResponse> usersData = new HashMap<>();
        Map<String, ForestResponse> forestsData = new HashMap<>();

        // 1. Room 기본 정보 저장
        String roomKey = "ROOM:" + roomId;

        // 2. Users 데이터 추가
        Random random = new Random();
        String evilSquirrelNickname = nicknames.get(random.nextInt(nicknames.size()));

        for (String nickname : nicknames) {
            String userKey = roomKey + ":USER:" + nickname;
            UserResponse userData = new UserResponse();

            //토큰 재발급
            String token = openViduService.generateToken(roomId+ "-1", nickname);

            userData.setNickname(nickname);
            userData.setAlive(true);
            userData.setAcorns(0);
            userData.setFatigue(0);
            userData.setForestToken(token);
            userData.setEvilSquirrel(nickname.equals(evilSquirrelNickname));

            // Redis Hash로 저장
            Map<String, Object> userDataMap = convertToMap(userData);
            userDataMap.forEach((field, value) -> redisUtil.hset(userKey, field, value));
            usersData.put(userKey, userData);
        }
        responseDto.setUsers(usersData);

        // 3. Forests 데이터 추가
        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            String forestKey = roomKey + ":FOREST:" + forestNum;
            ForestResponse forestData = new ForestResponse();

            if (forestNum == 1) {
                forestData.setEmergencyPossible(true);
                forestData.setTotalAcorns(0);
            } else {
                forestData.setMission1(new MissionData(false, 1));
                forestData.setMission2(new MissionData(false, 1));
                forestData.setMission3(new MissionData(false, 1));

                //각 Forest에 해당하는 openvidu 세션 생성
                openViduService.createSession(roomId + "-" + forestNum);
            }

            // Redis Hash로 저장
            Map<String, Object> forestDataMap = convertToMap(forestData);
            forestDataMap.forEach((field, value) -> redisUtil.hset(forestKey, field, value));
            forestsData.put(forestKey, forestData);
        }
        responseDto.setForests(forestsData);

        return responseDto;
    }

    // DTO 객체를 Map으로 변환하는 유틸리티 메서드
    private Map<String, Object> convertToMap(Object dto) {
        Map<String, Object> map = new HashMap<>();
        for (Field field : dto.getClass().getDeclaredFields()) {
            field.setAccessible(true);
            try {
                map.put(field.getName(), field.get(dto));
            } catch (IllegalAccessException e) {
                System.out.println("변환 불가");
            }
        }
        return map;
    }

    /**
     * 미션 데이터 value값 사용자 정의
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MissionData {
        private boolean isCompleted;
        private int acornReward;
    }

    /**
     * 긴급을 누를 시 모든 사용자의 forestToken을 roomId-1세션으로 설정
     * 긴급 상태 불가능으로 변경
     *
     * @param roomId: 해당 방의 Id
     * @return 모든 사용자의 닉네임과 새로운 토큰 값
     */
    public EmergencyResponse emergency(int roomId, List<String> nicknames) throws OpenViduJavaClientException, OpenViduHttpException {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:1";

        String sessionId = roomId + "-1";
        Map<String, String> userTokens = new HashMap<>();

        for (String nickname : nicknames) {
            String userKey = roomKey + ":USER:" + nickname;

            if (nickname != null) {
                //forestToken을 roomId-1세션으로 설정
                String token = openViduService.generateToken(sessionId, nickname);
                redisUtil.hset(userKey, "forestToken", token);

                // 닉네임과 토큰을 맵에 저장
                userTokens.put(nickname, token);
            }
        }

        // 앞으로 긴급 불가능
        redisUtil.hset(forestKey, "emergencyPossible", false);

        // EmergencyResponse 객체 생성 및 반환
        EmergencyResponse response = new EmergencyResponse();
        response.setUserTokens(userTokens);
        return response;
    }


    /**
     * 특정 유저가 특정 숲으로 이동
     * 각 숲으로 참가하기 위한 토큰 발급
     *
     * @param roomId: 해당 방의 Id
     * @param nickname: 유저 닉네임
     * @param newForest: 새로운 forestToken 값
     * @return MoveForestResponse 객체 (유저 닉네임, 새로운 forestToken)
     */
    public MoveForestResponse moveForest(int roomId, String nickname, int newForest) throws OpenViduJavaClientException, OpenViduHttpException {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;

        // 새로운 숲 토큰 생성
        String token = openViduService.generateToken(roomId + "-" + newForest, nickname);

        // forestToken newForest값으로 변경
        redisUtil.hset(userKey, "forestToken", token);

        // MoveForestResponse 객체 생성 및 반환
        return new MoveForestResponse(nickname, token);
    }

//    /**
//     * 특정 유저의 acorns 값을 조회
//     *
//     * @param roomId: 해당 방의 Id
//     * @param userNum: 유저 번호 (1-6)
//     * @return 유저의 acorns 값
//     */
//    public int getUserAcorns(int roomId, int userNum) {
//        String roomKey = "ROOM:" + roomId;
//        String userKey = roomKey + ":USER:" + userNum;
//
//        // 유저의 acorns 값 가져오기
//        Object acornsObj = redisUtil.hget(userKey, "acorns");
//
//        // acorns 값을 정수로 변환하여 반환
//        return (Integer) acornsObj;
//    }

    /**
     * 특정 유저의 acorns값을 공용 저장소에 저장
     * 특정 유저의 acorns값 0으로 초기화
     *
     * @param roomId: 해당 방의 Id
     * @param nickname: 유저 닉네임
     * @return SaveUserAcornsResponse 객체 (유저 닉네임, 새로운 totalAcorns 값, 유저가 저장한 acorns 값)
     */
    public SaveUserAcornsResponse saveUserAcorns(int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        String forestKey = roomKey + ":FOREST:1";

        // 유저의 현재 acorns 값 가져오기
        Integer currentAcorns = (Integer) redisUtil.hget(userKey, "acorns");

        // 유저의 acorns를 0으로 초기화
        redisUtil.hset(userKey, "acorns", 0);

        // 방의 totalAcorns 업데이트
        Integer totalAcorns = (Integer) redisUtil.hget(forestKey, "totalAcorns");
        int newTotalAcorns = totalAcorns + currentAcorns;
        redisUtil.hset(forestKey, "totalAcorns", newTotalAcorns);

        // SaveUserAcornsResponse 객체 생성 및 반환
        return new SaveUserAcornsResponse(nickname, newTotalAcorns, currentAcorns);
    }

//    /**
//     * 특정 유저의 fatigue 값을 조회
//     *
//     * @param roomId: 해당 방의 Id
//     * @param userNum: 유저 번호 (1-6)
//     * @return 유저의 fatigue 값
//     */
//    public int getUserFatigue(int roomId, int userNum) {
//        String roomKey = "ROOM:" + roomId;
//        String userKey = roomKey + ":USER:" + userNum;
//
//        // 유저의 fatigue 값 가져오기
//        Object fatigueObj = redisUtil.hget(userKey, "fatigue");
//
//        // fatigue 값을 정수로 반환
//        return (Integer) fatigueObj;
//    }

    /**
     * 특정 유저의 fatigue 값을 1충전
     *
     * @param roomId: 해당 방의 Id
     * @param nickname: 유저 닉네임
     * @return IncrementUserFatigueResponse 객체 (유저 닉네임, 증가된 fatigue 값)
     */
    public IncrementUserFatigueResponse incrementUserFatigue(int roomId, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;

        // 사용자의 현재 fatigue 값 가져오기
        Object fatigueObj = redisUtil.hget(userKey, "fatigue");

        // fatigue 값을 1 증가시킴
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue + 1;

        // 증가된 fatigue 값을 Redis에 저장
        redisUtil.hset(userKey, "fatigue", newFatigue);

        // IncrementUserFatigueResponse 객체 생성 및 반환
        return new IncrementUserFatigueResponse(nickname, newFatigue);
    }

    /**
     * 특정 유저의 alive 상태를 죽음 상태로 변경
     * 나의 피로도 3 차감
     *
     * @param roomId: 해당 방의 Id
     * @param victimNickname: 살해자 닉네임
     * @param killerNickname: 살인자 닉네임
     * @return KillResponse 객체 (살해자 닉네임, 살해자의 새로운 피로도, 살해당한 유저의 닉네임)
     */
    public KillResponse Kill(int roomId, String victimNickname, String killerNickname) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + victimNickname;
        String myKey = roomKey + ":USER:" + killerNickname;

        // alive 상태를 false로 설정
        redisUtil.hset(userKey, "alive", false);

        // 살해자의 피로도 값 3 차감
        Object fatigueObj = redisUtil.hget(myKey, "fatigue");
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue - 3;

        // 새로운 fatigue 값을 Redis에 저장
        redisUtil.hset(myKey, "fatigue", newFatigue);

        // KillResponse 객체 생성 및 반환
        return new KillResponse(killerNickname, newFatigue, victimNickname);
    }

//    /**
//     * 특정 forest의 mission1, mission2, mission3 상태와 보상을 조회
//     *
//     * @param roomId: 해당 방의 Id
//     * @param forestNum: forest 번호 (2-7)
//     * @return Map<String, Map<String, Object>> 형태로 각 mission의 완료 상태와 보상을 반환
//     */
//    public Map<String, Map<String, Object>> getForestMissionStatus(int roomId, int forestNum) {
//        String roomKey = "ROOM:" + roomId;
//        String forestKey = roomKey + ":FOREST:" + forestNum;
//
//        Map<String, Map<String, Object>> missionStatus = new HashMap<>();
//
//        for (int i = 1; i <= 3; i++) {
//            String missionKey = "mission" + i;
//            Object missionObj = redisUtil.hget(forestKey, missionKey);
//
//            Map<String, Object> missionInfo = new HashMap<>();
//            MissionData missionData = (MissionData) missionObj;
//            missionInfo.put("isCompleted", missionData.isCompleted());
//            missionInfo.put("acornReward", missionData.getAcornReward());
//
//            missionStatus.put(missionKey, missionInfo);
//        }
//
//        return missionStatus;
//    }

    /**
     * 특정 forest의 특정 mission 상태를 완료로 변경
     * 보상을 유저에게 지급
     * 유저의 피로도 -1
     *
     * @param roomId: 해당 방의 Id
     * @param forestNum: forest 번호 (2-7)
     * @param missionNum: mission 번호 (1-3)
     * @param nickname: 보상을 받을 유저 닉네임(1-6)
     * @return CompleteMissionResponse 객체
     */
    public CompleteMissionResponse completeMission(int roomId, int forestNum, int missionNum, String nickname) {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:" + forestNum;
        String userKey = roomKey + ":USER:" + nickname;
        String missionKey = "mission" + missionNum;

        // 1. 미션 데이터 조회
        MissionData missionData = (MissionData) redisUtil.hget(forestKey, missionKey);

        // 2. 보상 획득 및 미션 상태 업데이트
        int reward = missionData.getAcornReward();
        missionData.setCompleted(true);

        // 3. 업데이트된 미션 데이터 저장
        redisUtil.hset(forestKey, missionKey, missionData);

        // 4. 유저의 acorns 업데이트
        Integer currentAcorns = (Integer) redisUtil.hget(userKey, "acorns");
        int newAcorns = currentAcorns + reward;
        redisUtil.hset(userKey, "acorns", newAcorns);

        // 5. 유저의 피로도 업데이트
        Integer currentFatigue = (Integer) redisUtil.hget(userKey, "fatigue");
        int newFatigue = Math.max(currentFatigue - 1, 0);  // 피로도가 음수가 되지 않도록 함
        redisUtil.hset(userKey, "fatigue", newFatigue);

        // 6. CompleteMissionResponse 객체 생성 및 반환
        return new CompleteMissionResponse(nickname, forestNum, missionNum, reward, newAcorns);
    }
}
