package com.gradation.backend.game.model.response;

import lombok.Data;

@Data
public class ForestResponseDto {
    private Boolean emergencyPossible;
    private Integer totalAcorns;
    private MissionData mission1;
    private MissionData mission2;
    private MissionData mission3;
}
