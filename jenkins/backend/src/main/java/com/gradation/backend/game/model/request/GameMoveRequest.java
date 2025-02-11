package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class GameMoveRequest {
    private int roomId;
    private String nickname;
    private int newForest;
}
