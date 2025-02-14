package com.gradation.backend.game.service;

import com.gradation.backend.game.model.response.*;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
<<<<<<< HEAD
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
=======

import java.util.List;
>>>>>>> develop

public interface GameService {

<<<<<<< HEAD
    private final RedisUtil redisUtil;
    private final OpenViduService openViduService;

=======
>>>>>>> develop
    /**
     * 방 정보 조회
     *
     * @param roomId 조회할 방의 Id
     * @return 방의 전체 정보를 담은 RoomInfoResponseDto
     */
<<<<<<< HEAD
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
                user.setForestNum((Integer) userData.get("forestNum"));
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
     * 방의 숲별 유저 정보를 조회하여 반환
     */
    public Map<Integer, List<String>> getForestUserMap(int roomId, List<String> nicknames) {
        String roomKey = "ROOM:" + roomId;
        Map<Integer, List<String>> forestUsers = new HashMap<>();

        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            List<String> userList = new ArrayList<>();

            for (String nickname: nicknames){
                String userKey = roomKey + ":USER:" + nickname;
                Integer userForestNum = (Integer) redisUtil.hget(userKey, "forestNum");


                if (userForestNum != null && userForestNum == forestNum) {
                    if (nickname != null) {
                        userList.add(nickname);
                    }
                }
            }
            forestUsers.put(forestNum, userList);
        }
        return forestUsers;
    }

=======
    RoomInfoResponse getRoomInformation(int roomId);
>>>>>>> develop

    /**
     * 방 초기화 (시작하기 클릭 시)
     *
     * @param roomId 해당 방의 Id
     * @param nicknames 모든 참가자의 닉네임
     * @return 방의 전체 정보를 담은 RoomInitializationResponse 객체
     */
<<<<<<< HEAD
    public RoomInitializationResponse initializeRoomStructure(int roomId, List<String> nicknames)
            throws OpenViduJavaClientException, OpenViduHttpException {
        RoomInitializationResponse responseDto = new RoomInitializationResponse();

        Map<String, UserResponse> usersData = new HashMap<>();
        Map<String, ForestResponse> forestsData = new HashMap<>();

        // 1. Room 기본 정보 저장
        String roomKey = "ROOM:" + roomId;

        // 2. Users 데이터 추가 + 각 유저가 현재 위치한 숲 정보 표시( 지금은 로비라서 1)
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
            userData.setForestNum(1);
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

        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);
        responseDto.setForestUsers(forestUsers);

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
=======
    RoomInitializationResponse initializeRoomStructure(int roomId, List<String> nicknames)
            throws OpenViduJavaClientException, OpenViduHttpException;
>>>>>>> develop

    /**
     * 긴급 상황 처리
     *
     * @param roomId 해당 방의 Id
     * @param nicknames 모든 참가자의 닉네임
     * @return 모든 사용자의 닉네임과 새로운 토큰 값을 담은 EmergencyResponse 객체
     */
<<<<<<< HEAD
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
                redisUtil.hset(userKey, "forestNum", 1);

                // 닉네임과 토큰을 맵에 저장
                userTokens.put(nickname, token);
            }
        }

        // 앞으로 긴급 불가능
        redisUtil.hset(forestKey, "emergencyPossible", false);

        // EmergencyResponse 객체 생성 및 반환
        EmergencyResponse response = new EmergencyResponse();
        response.setUserTokens(userTokens);

        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);
        response.setForestUsers(forestUsers);

        return response;
    }

=======
    EmergencyResponse emergency(int roomId, List<String> nicknames)
            throws OpenViduJavaClientException, OpenViduHttpException;
>>>>>>> develop

    /**
     * 특정 유저가 특정 숲으로 이동
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @param newForest 새로운 forestToken 값
     * @return MoveForestResponse 객체 (유저 닉네임과 새로운 forestToken)
     */
<<<<<<< HEAD
    public MoveForestResponse moveForest(int roomId, String nickname, int newForest, List<String> nicknames) throws OpenViduJavaClientException, OpenViduHttpException {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + nickname;
        int forestNum = newForest;

        // 새로운 숲 토큰 생성
        String token = openViduService.generateToken(roomId + "-" + newForest, nickname);

        // forestToken newForest값으로 변경
        redisUtil.hset(userKey, "forestToken", token);
        redisUtil.hset(userKey, "forestNum", forestNum);

        // 최신 숲별 유저 정보 조회
        Map<Integer, List<String>> forestUsers = getForestUserMap(roomId, nicknames);

        // MoveForestResponse 객체 생성 및 반환
        return new MoveForestResponse(nickname, token, forestNum, forestUsers);
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
=======
    MoveForestResponse moveForest(int roomId, String nickname, int newForest)
            throws OpenViduJavaClientException, OpenViduHttpException;
>>>>>>> develop

    /**
     * 특정 유저의 도토리를 공용 저장소에 저장하고 초기화
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @return SaveUserAcornsResponse 객체 (유저 닉네임, 새로운 totalAcorns 값, 저장한 acorns 값)
     */
    SaveUserAcornsResponse saveUserAcorns(int roomId, String nickname);

    /**
     * 특정 유저의 피로도를 증가시킴
     *
     * @param roomId 해당 방의 Id
     * @param nickname 유저 닉네임
     * @return IncrementUserFatigueResponse 객체 (유저 닉네임과 증가된 fatigue 값)
     */
    IncrementUserFatigueResponse incrementUserFatigue(int roomId, String nickname);

    /**
     * 특정 유저를 죽음 상태로 변경하고 살해자의 피로도를 감소시킴
     *
     * @param roomId 해당 방의 Id
     * @param victimNickname 살해당한 유저 닉네임
     * @param killerNickname 살해한 유저 닉네임
     * @return KillResponse 객체 (살해자 닉네임, 새로운 피로도 값, 살해당한 유저 닉네임)
     */
    KillResponse Kill(int roomId, String victimNickname, String killerNickname);

    /**
     * 특정 미션을 완료 상태로 변경하고 보상을 지급함
     *
     * @param roomId 해당 방의 Id
     * @param forestNum 숲 번호 (2-7)
     * @param missionNum 미션 번호 (1-3)
     * @param nickname 보상을 받을 유저 닉네임
     * @return CompleteMissionResponse 객체 (미션 완료 정보와 보상 내용)
     */
    CompleteMissionResponse completeMission(int roomId, int forestNum, int missionNum, String nickname);
}


