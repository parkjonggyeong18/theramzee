package com.gradation.backend.common.handler;

import com.gradation.backend.common.utill.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.security.Principal;

@Slf4j
@Component
@RequiredArgsConstructor
public class StompHandler implements ChannelInterceptor {

    private final JwtTokenUtil jwtTokenUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        log.info("🟢 StompHandler preSend called, command={}", accessor.getCommand());

        if (accessor.getCommand() == StompCommand.CONNECT) {
            // STOMP 헤더에서 JWT 추출
            String token = resolveToken(accessor);
            if (token == null || !jwtTokenUtil.validateToken(token)) {
                log.error("🚨 WebSocket 연결 거부 - 유효하지 않은 JWT");
                return null; // JWT가 유효하지 않으면 WebSocket 연결 차단
            }

            String username = jwtTokenUtil.extractUsername(token);
            log.info("✅ WebSocket 인증 성공 - 사용자: {}", username);
            accessor.setUser(new UserPrincipal(username));
        }
        return message;
    }

    private String resolveToken(StompHeaderAccessor accessor) {
        String bearerToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public static class UserPrincipal implements Principal {
        private final String username;

        public UserPrincipal(String username) {
            this.username = username;
        }

        @Override
        public String getName() {
            return this.username;
        }
    }
}
