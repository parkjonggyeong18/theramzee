package com.gradation.backend.common.filter;


import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.user.service.impl.CustomUserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter는 JWT 토큰을 기반으로 사용자를 인증하는 필터입니다.
 * Spring Security의 요청 필터 체인에서 한 번만 실행됩니다.
 */
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenUtil jwtTokenUtil;
    private final CustomUserDetailsServiceImpl userDetailsService;

    /**
     * JwtAuthenticationFilter 생성자.
     *
     * @param jwtTokenUtil       JWT 토큰 유틸리티 클래스
     * @param userDetailsService 사용자 세부 정보를 로드하는 서비스
     * @author 박종경
     */
    public JwtAuthenticationFilter(JwtTokenUtil jwtTokenUtil, CustomUserDetailsServiceImpl userDetailsService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    /**
     * HTTP 요청을 처리하여 JWT 토큰을 검증하고, 유효한 경우 사용자 인증 정보를 설정합니다.
     *
     * @param request  HTTP 요청 객체
     * @param response HTTP 응답 객체
     * @param chain    필터 체인 객체
     * @throws ServletException 서블릿 관련 예외 발생 시
     * @throws IOException      입출력 예외 발생 시
     * @author 박종경
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        // Authorization 헤더에서 JWT 토큰 추출
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwt = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7); // "Bearer " 이후의 토큰 값 추출
            username = jwtTokenUtil.extractUsername(jwt); // 토큰에서 사용자 이름 추출
        }

        // SecurityContext에 인증 정보가 없는 경우 처리
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // JWT 토큰이 유효한 경우 인증 정보 설정
            if (jwtTokenUtil.validateToken(jwt, userDetails)) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }
        // 다음 필터로 요청 전달
        chain.doFilter(request, response);
    }
}
