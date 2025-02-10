package com.gradation.backend.game.model.response;

import com.gradation.backend.game.service.GameService;
import lombok.Data;

@Data
public class ForestResponse {
    private Boolean emergencyPossible;
    private Integer totalAcorns;
    private GameService.MissionData mission1;
    private GameService.MissionData mission2;
    private GameService.MissionData mission3;
}
