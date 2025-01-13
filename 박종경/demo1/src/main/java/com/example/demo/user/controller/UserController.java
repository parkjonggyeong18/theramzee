package com.example.demo.user.controller;

import com.example.demo.common.model.response.BaseResponse;

import com.example.demo.user.model.request.UserRequest;
import com.example.demo.user.model.response.UserResponse;
import com.example.demo.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * UserController는 사용자 관리와 관련된 API를 제공합니다.
 * - 현재 사용자 정보 조회
 * - 사용자 정보 업데이트
 * - 사용자 계정 삭제
 */
@RestController
@RequestMapping("/api/users")
@Tag(name = "User", description = "User management API")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    /**
     * UserController 생성자.
     *
     * @param userService 사용자 관리 서비스
     * @author 박종경
     *
     */
    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 현재 사용자 정보 조회 API.
     * 인증된 사용자의 정보를 반환합니다.
     *
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 현재 사용자의 정보가 포함된 응답 객체
     * @author 박종경
     *
     */
    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Retrieve the current user's information")
    public ResponseEntity<BaseResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        // 인증된 사용자의 이름으로 사용자 정보 조회
        UserResponse userResponse = userService.getUserByUsername(authentication.getName());
        return ResponseEntity.ok(BaseResponse.success("User information retrieved successfully", userResponse));
    }

    /**
     * 사용자 정보 업데이트 API.
     * 현재 사용자의 정보를 업데이트합니다.
     *
     * @param request 업데이트할 사용자 정보 (DTO)
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 업데이트된 사용자 정보가 포함된 응답 객체
     * @author 박종경
     *
     */
    @PutMapping("/update")
    @Operation(summary = "Update user", description = "Update the current user's information")
    public ResponseEntity<BaseResponse<UserResponse>> updateUser(@RequestBody UserRequest request, Authentication authentication) {
        // 인증된 사용자가 자신의 계정만 업데이트할 수 있도록 제한
        if (!authentication.getName().equals(request.getUsername())) {
            return ResponseEntity.badRequest().body(BaseResponse.error("You can only update your own account"));
        }
        UserResponse updatedUser = userService.updateUser(request);
        return ResponseEntity.ok(BaseResponse.success("User updated successfully", updatedUser));
    }

    /**
     * 사용자 계정 삭제 API.
     * 현재 사용자의 계정을 삭제합니다.
     *
     * @param authentication Spring Security의 Authentication 객체 (현재 인증된 사용자 정보)
     * @return 성공 메시지가 포함된 응답 객체
     * @author 박종경
     *
     */
    @DeleteMapping("/delete")
    @Operation(summary = "Delete user", description = "Delete the current user's account")
    public ResponseEntity<BaseResponse<String>> deleteUser(Authentication authentication) {
        // 인증된 사용자의 이름으로 계정 삭제
        userService.deleteUser(authentication.getName());
        return ResponseEntity.ok(BaseResponse.success("User deleted successfully", null));
    }
}