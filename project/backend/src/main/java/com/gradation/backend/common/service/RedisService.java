package com.gradation.backend.common.service;

import com.gradation.backend.common.utill.RedisUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class RedisService {


    private final RedisUtil redisUtil;

    public RedisService(RedisUtil redisUtil) {
        this.redisUtil = redisUtil;
    }

    /**
     * 방 정보 조회 (테스트용)
     *
     * @param roomId: 조회할 방의 Id
     * @return 방의 전체 정보를 담은 Map
     */
    public Map<String, Object> getRoomInformation(int roomId) {
        Map<String, Object> roomInformation = new HashMap<>();
        String roomKey = "ROOM:" + roomId;

        // 1. Room 기본 정보 조회
        Map<Object, Object> roomData = redisUtil.hgetAll(roomKey);
        roomInformation.put(roomKey, roomData);

        // 2. Users 데이터 조회
        Map<String, Object> usersData = new HashMap<>();
        for (int userNum = 1; userNum <= 6; userNum++) {
            String userKey = roomKey + ":USER:" + userNum;
            Map<Object, Object> userData = redisUtil.hgetAll(userKey);
            if (!userData.isEmpty()) {
                usersData.put(userKey, userData);
            }
        }
        roomInformation.put("users", usersData);

        // 3. Forests 데이터 조회
        Map<String, Object> forestsData = new HashMap<>();
        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            String forestKey = roomKey + ":FOREST:" + forestNum;
            Map<Object, Object> forestData = redisUtil.hgetAll(forestKey);
            if (!forestData.isEmpty()) {
                // MissionData 객체로 변환
                if (forestNum != 1) {
                    for (int i = 1; i <= 3; i++) {
                        String missionKey = "mission" + i;
                        if (forestData.containsKey(missionKey)) {
                            MissionData missionData = (MissionData) forestData.get(missionKey);
                            forestData.put(missionKey, Map.of("isCompleted", missionData.isCompleted(), "acornReward", missionData.getAcornReward()));
                        }
                    }
                }
                forestsData.put(forestKey, forestData);
            }
        }
        roomInformation.put("forests", forestsData);

        return roomInformation;
    }


    /**
     * 시작하기 클릭 시 방 초기화
     *
     * @param roomId: 해당 방의 Id
     * @param nicknames: 모든 참가자의 닉네임
     * @return 방의 전체 정보를 담은 Map
     */
    public Map<String, Object> initializeRoomStructure(int roomId, List<String> nicknames) {
        Map<String, Object> initializedData = new HashMap<>();

        // 1. Room 기본 정보 저장
        String roomKey = "ROOM:" + roomId;
//        redisUtil.hset(roomKey, "totalAcorns", 0); // totalAcorns 필드 추가
//        initializedData.put(roomKey, Map.of("totalAcorns", 0));

        // 2. Users 데이터 추가
        Map<String, Object> usersData = new HashMap<>();
        Random random = new Random();
        int evilSquirrelIndex = random.nextInt(6); // 0부터 5 사이의 무작위 숫자 생성

        for (int userNum = 1; userNum <= 6; userNum++) {
            String userKey = roomKey + ":USER:" + userNum;
            Map<String, Object> userData = new HashMap<>();
            userData.put("nickname", nicknames.get(userNum - 1));
            userData.put("alive", true);
            userData.put("acorns", 0);
            userData.put("fatigue", 0);
            userData.put("forestLocation", 1);
            userData.put("isEvilSquirrel", userNum - 1 == evilSquirrelIndex);

            // Redis Hash로 저장
            userData.forEach((field, value) -> redisUtil.hset(userKey, field, value));
            usersData.put(userKey, userData);
        }
        initializedData.put("users", usersData);

        // 3. Forests 데이터 추가
        Map<String, Object> forestsData = new HashMap<>();
        for (int forestNum = 1; forestNum <= 7; forestNum++) {
            String forestKey = roomKey + ":FOREST:" + forestNum;
            Map<String, Object> forestData = new HashMap<>();
            if (forestNum == 1) {
                forestData.put("emergencyPossible", true);
                forestData.put("totalAcorns", 0);
            } else {
                forestData.put("mission1", new MissionData(false, 1));
                forestData.put("mission2", new MissionData(false, 1));
                forestData.put("mission3", new MissionData(false, 1));
            }

            // Redis Hash로 저장
            forestData.forEach((field, value) -> redisUtil.hset(forestKey, field, value));
            forestsData.put(forestKey, forestData);
        }
        initializedData.put("forests", forestsData);

        return initializedData;
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
     * 긴급을 누를 시 모든 사용자의 forestLocation을 1로 설정
     * 긴급 상태 불가능으로 변경
     *
     * @param roomId: 해당 방의 Id
     * @return 긴급 상태
     */
    public boolean emergency(int roomId) {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:1";

        for (int userNum = 1; userNum <= 6; userNum++) {
            String userKey = roomKey + ":USER:" + userNum;

            // 사용자 데이터 가져오기
            Map<Object, Object> userData = redisUtil.hgetAll(userKey);

            if (!userData.isEmpty()) {
                // forestLocation을 1로 설정
                redisUtil.hset(userKey, "forestLocation", 1);
            }
        }

        // 앞으로 긴급 불가능
        redisUtil.hset(forestKey, "emergencyPossible", false);

        //현재 긴급 상태 반환
        Object emergencyPossibleObj = redisUtil.hget(forestKey, "emergencyPossible");
        return (Boolean) emergencyPossibleObj;
    }

    /**
     * 특정 유저가 특정 숲으로 이동
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @param newForest: 새로운 forestLocation 값
     * @return 해당 유저가 이동한 숲 번호
     */
    public Integer moveForest(int roomId, int userNum, int newForest) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;

        // 사용자 데이터 가져오기
        Map<Object, Object> userData = redisUtil.hgetAll(userKey);

        if (!userData.isEmpty()) {
            // forestLocation을 newForest값으로 변경
            redisUtil.hset(userKey, "forestLocation", newForest);
        }

        // 유저의 현재 숲 번호 반환
        Object userLocationObj = redisUtil.hget(userKey, "forestLocation");
        return (Integer) userLocationObj;
    }

    /**
     * 특정 유저의 acorns 값을 조회
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @return 유저의 acorns 값
     */
    public int getUserAcorns(int roomId, int userNum) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;

        // 유저의 acorns 값 가져오기
        Object acornsObj = redisUtil.hget(userKey, "acorns");

        // acorns 값을 정수로 변환하여 반환
        return (Integer) acornsObj;
    }

    /**
     * 특정 유저의 acorns값을 공용 저장소에 저장
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @return 공용 저장소의 totalAcorns 값
     */
    public int saveUserAcorns(int roomId, int userNum) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;
        String forestKey = roomKey + ":FOREST:1";

        // 유저의 현재 acorns 값 가져오기
        Integer currentAcorns = (Integer) redisUtil.hget(userKey, "acorns");

        // 유저의 acorns를 0으로 초기화
        redisUtil.hset(userKey, "acorns", 0);

        // 방의 totalAcorns 업데이트
        Integer totalAcorns = (Integer) redisUtil.hget(forestKey, "totalAcorns");
        int newTotalAcorns = totalAcorns + currentAcorns;
        redisUtil.hset(forestKey, "totalAcorns", newTotalAcorns);

        return newTotalAcorns;
    }

    /**
     * 특정 유저의 fatigue 값을 조회
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @return 유저의 fatigue 값
     */
    public int getUserFatigue(int roomId, int userNum) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;

        // 유저의 fatigue 값 가져오기
        Object fatigueObj = redisUtil.hget(userKey, "fatigue");

        // fatigue 값을 정수로 반환
        return (Integer) fatigueObj;
    }

    /**
     * 특정 유저의 fatigue 값을 1충전
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @return 증가된 fatigue 값
     */
    public int incrementUserFatigue(int roomId, int userNum) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;

        // 사용자의 현재 fatigue 값 가져오기
        Object fatigueObj = redisUtil.hget(userKey, "fatigue");

        // fatigue 값을 1 증가시킴
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue + 1;

        // 증가된 fatigue 값을 Redis에 저장
        redisUtil.hset(userKey, "fatigue", newFatigue);

        return newFatigue;
    }

    /**
     * 특정 유저의 alive 상태를 죽음 상태로 변경
     * 나의 피로도 3 차감
     *
     * @param roomId: 해당 방의 Id
     * @param userNum: 유저 번호 (1-6)
     * @return 살해 당한 유저의 alive 상태
     */
    public boolean Kill(int roomId, int userNum, int myNum) {
        String roomKey = "ROOM:" + roomId;
        String userKey = roomKey + ":USER:" + userNum;
        String myKey = roomKey + ":USER:" + myNum;

        // alive 상태를 false로 설정
        redisUtil.hset(userKey, "alive", false);

        // 나의 피로도 값 0으로 초기화
        Object fatigueObj = redisUtil.hget(myKey, "fatigue");
        int currentFatigue = (Integer) fatigueObj;
        int newFatigue = currentFatigue - 3;

        // 증가된 fatigue 값을 Redis에 저장
        redisUtil.hset(myKey, "fatigue", newFatigue);

        // 유저의 alive 상태 반환
        Object userAlive = redisUtil.hget(userKey, "alive");
        return (Boolean) userAlive;
    }

    /**
     * 특정 forest의 mission1, mission2, mission3 상태와 보상을 조회
     *
     * @param roomId: 해당 방의 Id
     * @param forestNum: forest 번호 (2-7)
     * @return Map<String, Map<String, Object>> 형태로 각 mission의 완료 상태와 보상을 반환
     */
    public Map<String, Map<String, Object>> getForestMissionStatus(int roomId, int forestNum) {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:" + forestNum;

        Map<String, Map<String, Object>> missionStatus = new HashMap<>();

        for (int i = 1; i <= 3; i++) {
            String missionKey = "mission" + i;
            Object missionObj = redisUtil.hget(forestKey, missionKey);

            Map<String, Object> missionInfo = new HashMap<>();
            MissionData missionData = (MissionData) missionObj;
            missionInfo.put("isCompleted", missionData.isCompleted());
            missionInfo.put("acornReward", missionData.getAcornReward());

            missionStatus.put(missionKey, missionInfo);
        }

        return missionStatus;
    }


    /**
     * 특정 forest의 특정 mission 상태를 완료로 변경
     * 보상을 유저에게 지급
     * 유저의 피로도 -1
     *
     * @param roomId: 해당 방의 Id
     * @param forestNum: forest 번호 (2-7)
     * @param missionNum: mission 번호 (1-3)
     * @param userNum: 보상을 받을 유저 번호 (1-6)
     */
    public boolean completeMission(int roomId, int forestNum, int missionNum, int userNum) {
        String roomKey = "ROOM:" + roomId;
        String forestKey = roomKey + ":FOREST:" + forestNum;
        String userKey = roomKey + ":USER:" + userNum;
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
        int newFatigue = currentFatigue - 1;
        redisUtil.hset(userKey, "fatigue", newFatigue);

        // 6. 미션의 완료 상태 반환
        return missionData.isCompleted();
    }


}
