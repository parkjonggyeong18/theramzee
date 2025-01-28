package com.gradation.backend.game.model;

import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.util.List;

public class Dto {

    @Getter @Setter
    public class RoomDto {
        private int roomId;
        private int totalAcorns;
        private Duration totalTime;
    }

    @Getter @Setter
    public class UserDto {
        private int userId;
        private int userNum;
        private String nickname;
        private boolean alive;
        private int acorns;
        private int fatigue;
        private int forestLocation;
        private boolean isEvilSquirrel;
    }

    @Getter @Setter
    public class ForestDto {
        private int forestNum;
        private List<MissionDto> missions;
        private boolean emergencyPossible;
    }

    @Getter @Setter
    public class MissionDto {
        private int missionNum;
        private boolean completed;
        private int acornReward;
    }
}
