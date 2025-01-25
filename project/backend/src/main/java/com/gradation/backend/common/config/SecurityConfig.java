package com.gradation.backend.common.config;


import com.gradation.backend.common.filter.JwtAuthenticationFilter;
import com.gradation.backend.common.utill.JwtTokenUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * SecurityConfig는 Spring Security 설정을 관리하는 클래스입니다.
 * - 인증 및 인가 관련 설정
 * - JWT 기반 인증 필터 추가
 * - 세션 정책 설정
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    /**
     * SecurityConfig 생성자.
     *
     * @param userDetailsService 사용자 인증 정보를 제공하는 UserDetailsService 구현체
     * @author 박종경
     */
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }
    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil) {
        return new JwtAuthenticationFilter(jwtTokenUtil, userDetailsService);
    }
    /**
     * AuthenticationManager Bean 정의.
     *
     * @param authenticationConfiguration Spring Security의 AuthenticationConfiguration 객체
     * @return AuthenticationManager 객체
     * @throws Exception 예외가 발생할 경우
     * @author 박종경
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * DaoAuthenticationProvider Bean 정의.
     * 사용자 인증을 위해 UserDetailsService와 PasswordEncoder를 설정합니다.
     *
     * @param passwordEncoder 비밀번호 암호화를 위한 PasswordEncoder 구현체
     * @return DaoAuthenticationProvider 객체
     * @author 박종경
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider(PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    /**
     * SecurityFilterChain Bean 정의.
     * HTTP 보안 설정 및 JWT 인증 필터 추가를 담당합니다.
     *
     * @param http HttpSecurity 객체로 보안 설정을 구성합니다.
     * @param jwtAuthenticationFilter JWT 기반 인증을 처리하는 필터
     * @return SecurityFilterChain 객체
     * @throws Exception 예외가 발생할 경우
     * @author 박종경
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter, CorsConfigurationSource corsConfigurationSource) throws Exception {
        http    .exceptionHandling(exception -> {})
                // CSRF 보호 비활성화 (JWT는 CSRF 토큰이 필요하지 않음)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // 세션 정책: STATELESS (세션 사용하지 않음)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // URL 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/**", "/swagger-ui/**", "/v3/api-docs/**","/api-docs/**","/ws/**", "/user/**","/swagger-ui.html").permitAll() // 인증 없이 접근 가능 경로
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:8080")); // 허용할 Origin
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE")); // 허용할 HTTP 메서드
        config.setAllowedHeaders(List.of("*")); // 모든 요청 헤더 허용
        config.setAllowCredentials(true); // 인증 정보 포함 허용 (쿠키, Authorization 헤더 등)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // 모든 경로에 대해 CORS 설정 적용

        return source;
    }
}
