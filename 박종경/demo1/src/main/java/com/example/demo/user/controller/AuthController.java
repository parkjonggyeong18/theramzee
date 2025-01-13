package com.example.demo.user.controller;

import com.example.demo.common.model.response.BaseResponse;
import com.example.demo.common.util.RedisUtil;
import com.example.demo.user.model.entity.User;
import com.example.demo.user.model.request.UserRequest;
import com.example.demo.user.model.response.UserResponse;
import com.example.demo.user.service.UserService;
import com.example.demo.user.util.JwtTokenUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.transaction.Transactional;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * AuthController는 사용자 인증과 관련된 API를 제공합니다.
 * - 로그인
 * - 토큰 갱신
 * - 로그아웃
 * - 사용자 등록
 */
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication management API")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final RedisUtil redisUtil;

    /**
     * AuthController 생성자.
     *
     * @param authenticationManager 인증 매니저
     * @param userService           사용자 관리 서비스
     * @param jwtTokenUtil          JWT 토큰 유틸리티 클래스
     * @param redisUtil             Redis 유틸리티 클래스
     * @author 박종경
     */
    public AuthController(AuthenticationManager authenticationManager, UserService userService,
                          JwtTokenUtil jwtTokenUtil, RedisUtil redisUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.redisUtil = redisUtil;

    }

    /**
     * 사용자 로그인 API.
     * 사용자 인증 후 Access 및 Refresh 토큰을 반환합니다.
     *
     * @param request 로그인 요청 데이터 (username, password)
     * @return Access 및 Refresh 토큰이 포함된 응답 객체
     * @author 박종경
     */
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate a user and return access and refresh tokens")
    public ResponseEntity<BaseResponse<Map<String, Object>>> login(@RequestBody UserRequest request) {
        // 사용자 인증 처리
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
        String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        // Redis에 Refresh 토큰 저장
        redisUtil.setex(userDetails.getUsername() + ":refresh", refreshToken,
                jwtTokenUtil.getRefreshTokenExpiration(), TimeUnit.MILLISECONDS);

        Map<String, Object> tokenMap = new HashMap<>();
        tokenMap.put("accessToken", accessToken);
        tokenMap.put("refreshToken", refreshToken);

        return ResponseEntity.ok(BaseResponse.success("Login successful", tokenMap));
    }

    /**
     * Access 토큰 갱신 API.
     * 유효한 Refresh 토큰을 사용하여 새로운 Access 토큰을 발급받습니다.
     *
     * @param request Refresh 토큰이 포함된 요청 데이터
     * @return 새로운 Access 토큰이 포함된 응답 객체
     * @author 박종경
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token", description = "Get a new access token using a valid refresh token")
    public ResponseEntity<BaseResponse<Map<String, String>>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String username = jwtTokenUtil.extractUsername(refreshToken);

        if (username != null && redisUtil.hasKey(username + ":refresh")) {
            UserDetails userDetails = userService.loadUserByUsername(username);
            if (jwtTokenUtil.validateToken(refreshToken, userDetails)) {
                String newAccessToken = jwtTokenUtil.generateAccessToken(userDetails);

                Map<String, String> tokenMap = new HashMap<>();
                tokenMap.put("accessToken", newAccessToken);
                return ResponseEntity.ok(BaseResponse.success("Token refreshed successfully", tokenMap));
            }
        }

        return ResponseEntity.badRequest().body(BaseResponse.error("Invalid refresh token"));
    }

    /**
     * 사용자 등록 API.
     *
     * @param request 등록하려는 사용자 정보
     * @return 등록된 사용자 정보가 포함된 응답 객체
     * @author 박종경
     */
    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    @Transactional
    public ResponseEntity<BaseResponse<UserResponse>> register(@RequestBody UserRequest request) {
        UserResponse registeredUser = userService.registerUser(request);
        return ResponseEntity.ok(BaseResponse.success("User registered successfully", registeredUser));
    }

    /**
     * 로그아웃 API.
     * 사용자의 Refresh 토큰을 무효화합니다.
     *
     * @param token Authorization 헤더에 포함된 Access 토큰
     * @return 로그아웃 성공 메시지
     * @author 박종경
     */
    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidate the user's refresh token")
    public ResponseEntity<BaseResponse<String>> logout(@RequestHeader("Authorization") String token) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        redisUtil.delete(username + ":refresh");
        return ResponseEntity.ok(BaseResponse.success("Logged out successfully", null));
    }
}
