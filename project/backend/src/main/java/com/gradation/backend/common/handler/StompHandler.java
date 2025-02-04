package com.gradation.backend.common.handler;

import com.gradation.backend.common.utill.JwtTokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
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
        log.info("StompHandler preSend called, command={}", accessor.getCommand());

        // CONNECT 시점에만 토큰 검증 로직 수행
        if (accessor.getCommand() == StompCommand.CONNECT) {
            String token = resolveToken(accessor);
            String senderUserId = null;
            log.info("Extracted token={}", token);

            if (jwtTokenUtil.validateToken(token)) {
                // 토큰에서 사용자명을 추출
                senderUserId = jwtTokenUtil.extractUsername(token);
                log.info("Extracted username={}", senderUserId);

                // username으로 Principal 생성
                Principal principal = new StompPrincipal(senderUserId);

                // 세션에 Principal을 설정 → 이후 @MessageMapping 메서드에서 principal 주입 가능
                accessor.setUser(principal);
            }

            // senderUserId 헤더에도 동일 값 추가 (필요 시)
            accessor.addNativeHeader("senderUserId", senderUserId);
        }

        return message;
    }

    /**
     * STOMP 헤더에서 "Bearer <token>" 형태로 JWT 토큰을 추출
     */
    private String resolveToken(StompHeaderAccessor accessor) {
        String bearerToken = accessor.getFirstNativeHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    /**
     * 사용자명을 담기 위한 Custom Principal 구현체
     */
    public static class StompPrincipal implements Principal {
        private final String name;

        public StompPrincipal(String name) {
            this.name = name;
        }

        @Override
        public String getName() {
            return name;
        }
    }
}
