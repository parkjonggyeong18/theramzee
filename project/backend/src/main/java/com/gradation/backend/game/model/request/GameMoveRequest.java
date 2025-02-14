package com.gradation.backend.game.model.request;

import lombok.Data;

import java.util.List;

@Data
public class GameMoveRequest {
    private int roomId;
    private String nickname;
    private int newForest;
    private List<String> nicknames;
}
