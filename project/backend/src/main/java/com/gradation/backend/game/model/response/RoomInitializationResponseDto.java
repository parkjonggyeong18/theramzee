package com.gradation.backend.game.model.response;

import lombok.Data;

import java.util.Map;

@Data
public class RoomInitializationResponseDto {
    private Map<String, UserResponseDto> users;
    private Map<String, ForestResponseDto> forests;
}