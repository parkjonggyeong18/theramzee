package com.gradation.backend.common.config;

import com.gradation.backend.common.Interceptor.CustomHandshakeInterceptor;
import com.gradation.backend.common.handler.CustomHandshakeHandler;
import com.gradation.backend.common.utill.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public WebSocketConfig(JwtTokenUtil jwtTokenUtil) {
        this.jwtTokenUtil = jwtTokenUtil;
    }

    /**
     * STOMP 메시지 브로커 설정
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 메시지 브로커 경로 설정: /queue, /topic은 브로커가 처리, /app은 애플리케이션 엔드포인트
        config.enableSimpleBroker("/queue", "/topic");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user"); // 1:1 사용자 메시징
    }

    /**
     * WebSocket STOMP 엔드포인트 등록 및 설정
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws") // WebSocket 접속 엔드포인트
                .addInterceptors(new CustomHandshakeInterceptor(jwtTokenUtil)) // JWT 검증 인터셉터 추가
                .setHandshakeHandler(new CustomHandshakeHandler(jwtTokenUtil)) // JwtTokenUtil 주입된 Custom Principal 핸들러 지정
                .setAllowedOrigins("*") // CORS 허용 Origin 설정
                .withSockJS(); // SockJS 지원 설정 (fallback 용)
    }
}
