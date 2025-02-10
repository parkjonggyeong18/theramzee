package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class GameMoveRequest {
    private int roomId;
    private int userNum;
    private int newForest;
}
