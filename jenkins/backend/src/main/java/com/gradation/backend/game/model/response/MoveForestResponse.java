package com.gradation.backend.game.model.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MoveForestResponse {
    private String nickname;
    private String forestToken;
}
