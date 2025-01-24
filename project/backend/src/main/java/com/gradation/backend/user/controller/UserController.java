package com.gradation.backend.user.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "회원 인증 API", description = "사용자 인증 관리 API")
public class UserController {

}
