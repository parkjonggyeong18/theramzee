package com.gradation.backend.game.model;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class response {

    @Getter @Setter
    public class GameStartResponse {
        private List<Dto.ForestDto> forests;
        private int totalAcorns;
        private int timeLimit;
        private int evilSquirrelNum;
    }
}
