package com.gradation.backend.game.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class request {

    @Data
    public static class GameInfoRequest {
        private int roomId;
    }

    @Data
    public static class GameStartRequest {
        private int roomId;
        private List<String> nicknames;
    }

    @Data
    public static class GameEmergencyRequest {
        private int roomId;
    }

    @Data
    public static class GameMoveRequest {
        private int roomId;
        private int userNum;
        private int newForest;
    }

    @Data
    public static class getUserAcornsRequest {
        private int roomId;
        private int userNum;
    }

    @Data
    public static class saveAcornsRequest {
        private int roomId;
        private int userNum;
    }

    @Data
    public static class getUserFatigueRequest {
        private int roomId;
        private int userNum;
    }

    @Data
    public static class chargeFatigueRequest {
        private int roomId;
        private int userNum;
    }

    @Data
    public static class killRequest {
        private int roomId;
        private int userNum;
        private int myNum;
    }

    @Data
    public static class getMissionRequest {
        private int roomId;
        private int forestNum;
    }

    @Data
    public static class completeMissionRequest {
        private int roomId;
        private int forestNum;
        private int missionNum;
        private int userNum;
    }
}
