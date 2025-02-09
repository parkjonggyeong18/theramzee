package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
public class EmergencyResponse {
    private Map<String, String> userTokens;
}
