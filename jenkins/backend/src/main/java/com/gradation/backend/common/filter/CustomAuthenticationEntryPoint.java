package com.gradation.backend.common.filter;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        // 이메일 전송 API 경로는 인증하지 않음
        if (request.getRequestURI().startsWith("/api/v1/email")) {
            response.setStatus(HttpServletResponse.SC_OK); // 인증 없이 처리하려면 OK 응답으로 설정
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("Unauthorized: Authentication failed");
    }

}
