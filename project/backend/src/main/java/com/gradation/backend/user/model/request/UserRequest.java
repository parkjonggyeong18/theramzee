package com.gradation.backend.user.model.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRequest {
    private String username;    // 사용자 ID
    private String name;  // 사용자 본명
    private String email;
    private String password;
    private String nickname;
}
