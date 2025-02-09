package com.gradation.backend.game.model.response;

import lombok.Data;

import java.util.Map;

@Data
public class RoomInitializationResponse {
    private Map<String, UserResponse> users;
    private Map<String, ForestResponse> forests;
}