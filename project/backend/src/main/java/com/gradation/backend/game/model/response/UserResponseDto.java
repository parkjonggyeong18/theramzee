package com.gradation.backend.game.model.response;

import lombok.Data;

@Data
public class UserResponseDto {
    private String nickname;
    private boolean alive;
    private int acorns;
    private int fatigue;
    private String forestToken;
    private boolean isEvilSquirrel;
}
