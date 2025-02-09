package com.gradation.backend.game.model.request;

import lombok.Data;

@Data
public class killRequest {
    private int roomId;
    private int userNum;
    private int myNum;
}