package com.example.demo.user.config;

import com.example.demo.user.filter.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * SecurityConfig는 Spring Security 설정을 관리하는 클래스입니다.
 * - 인증 및 인가 관련 설정
 * - JWT 기반 인증 필터 추가
 * - 세션 정책 설정
 */
@Configuration
public class SecurityConfig {

    private final UserDetailsService userDetailsService;

    /**
     * SecurityConfig 생성자.
     *
     * @param userDetailsService 사용자 인증 정보를 제공하는 UserDetailsService 구현체
     */
    public SecurityConfig(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /**
     * AuthenticationManager Bean 정의.
     *
     * @param authenticationConfiguration Spring Security의 AuthenticationConfiguration 객체
     * @return AuthenticationManager 객체
     * @throws Exception 예외가 발생할 경우
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
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                // CSRF 보호 비활성화 (JWT는 CSRF 토큰이 필요하지 않음)
                .csrf(csrf -> csrf.disable())
                // 세션 정책: STATELESS (세션 사용하지 않음)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // URL 접근 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**", "/swagger-ui/**", "/api-docs/**", "/signup/**").permitAll() // 인증 없이 접근 가능 경로
                        .anyRequest().authenticated() // 나머지 요청은 인증 필요
                )
                // JWT 인증 필터를 UsernamePasswordAuthenticationFilter 앞에 추가
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
