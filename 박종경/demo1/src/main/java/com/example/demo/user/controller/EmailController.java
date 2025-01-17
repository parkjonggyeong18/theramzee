package com.example.demo.user.controller;

import com.example.demo.common.util.RedisUtil;
import com.example.demo.common.model.response.BaseResponse;
import com.example.demo.user.model.dto.EmailCheckDto;
import com.example.demo.user.model.request.EmailRequest;
import com.example.demo.user.service.EmailService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

/**
 * EmailController는 이메일 인증 관련 API를 제공합니다.
 * - 인증번호 전송
 * - 인증번호 유효성 검사
 */
@RestController
@Tag(name = "Email", description = "Email 관련 API (인증번호 전송 및 검증)")
public class EmailController {

    private final EmailService emailService;
    private final RedisUtil redisUtil;
    private final RedisTemplate<String, String> redisTemplate;

    @Autowired
    public EmailController(EmailService emailService, RedisUtil redisUtil, RedisTemplate<String, String> redisTemplate) {
        this.emailService = emailService;
        this.redisUtil = redisUtil;
        this.redisTemplate = redisTemplate;
    }

    /**
     * 이메일 인증번호 전송 API
     * 사용자가 회원가입 시 이메일 인증번호 요청을 하면, 해당 이메일로 인증번호를 전송합니다.
     *
     * @param emailRequest 사용자 이메일 정보
     * @return 인증번호가 포함된 응답 객체 (테스트용으로 인증번호 반환)
     * @author 박종경
     */
    @PostMapping("/signup/email")
    @Operation(summary = "이메일 인증번호 전송", description = "사용자가 회원가입 시 이메일 인증번호를 요청하면 인증번호를 전송합니다.")
    public ResponseEntity<BaseResponse<Map<String, String>>> mailSend(@RequestBody @Valid EmailRequest emailRequest) {
        // EmailService를 호출하여 인증번호 생성 및 이메일 전송
        String code = emailService.joinEmail(emailRequest.getEmail());

        // 응답 데이터 생성
        Map<String, String> response = new HashMap<>();
        response.put("code", code); // 개발 단계에서는 인증번호를 반환

        // BaseResponse를 사용하여 성공 응답 반환
        return ResponseEntity.ok(BaseResponse.success("인증번호가 전송되었습니다.", response));
    }

    /**
     * 이메일 인증번호 검증 API
     * 사용자가 입력한 인증번호를 검증하여 인증 상태를 저장합니다.
     *
     * @param emailCheckDto 사용자 이메일 및 입력된 인증번호
     * @return 인증 성공 또는 실패 메시지
     * @author 박종경
     */
    @PostMapping("/signup/emailAuth")
    @Operation(summary = "이메일 인증번호 검증", description = "사용자가 입력한 인증번호를 검증하여 인증 상태를 저장합니다.")
    public ResponseEntity<BaseResponse<String>> authCheck(@RequestBody @Valid EmailCheckDto emailCheckDto) {
        String redisKey = "email:auth:" + emailCheckDto.getEmail();
        String storedAuthNum = redisTemplate.opsForValue().get(redisKey);

        if (storedAuthNum == null) {
            // 인증번호가 존재하지 않음
            return ResponseEntity.badRequest().body(BaseResponse.error("인증번호가 만료되었거나 존재하지 않습니다."));
        }

        if (!storedAuthNum.equals(emailCheckDto.getAuthNum())) {
            // 인증번호 불일치
            return ResponseEntity.badRequest().body(BaseResponse.error("인증번호가 일치하지 않습니다."));
        }

        // 인증 성공 상태 저장
        String verifiedKey = emailCheckDto.getEmail() + ":verified";
        redisTemplate.opsForValue().set(verifiedKey, "true", 180, TimeUnit.SECONDS);

        // 성공 메시지 반환
        return ResponseEntity.ok(BaseResponse.success("이메일 인증에 성공했습니다.", null));
    }
}
