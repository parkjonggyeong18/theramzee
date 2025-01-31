package com.gradation.backend.user.model.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {
    private String accessToken;  // 새로 발급된 Access 토큰
    private String refreshToken; // 새로 발급된 Refresh 토큰 (refresh 시 기존 토큰 그대로 반환 가능)
}
