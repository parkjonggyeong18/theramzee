package com.example.demo.user.service;

import com.example.demo.user.model.request.UserRequest;
import com.example.demo.user.model.response.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * UserService는 사용자 관리와 관련된 비즈니스 로직을 정의하는 인터페이스입니다.
 * - 사용자 등록
 * - 사용자 조회
 * - 사용자 업데이트
 * - 사용자 삭제
 */
public interface UserService extends UserDetailsService {

    /**
     * Spring Security에서 사용자를 인증하기 위해 호출되는 메서드.
     *
     * @param username 인증하려는 사용자의 사용자명
     * @return UserDetails 객체 (Spring Security에서 사용)
     * @throws UsernameNotFoundException 사용자가 존재하지 않을 경우 예외 발생
     * @author 박종경
     */
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;

    /**
     * 새로운 사용자를 등록합니다.
     *
     * @param request 등록하려는 사용자 정보 (DTO)
     * @return 저장된 사용자 정보 (DTO)
     * @author 박종경
     */
    UserResponse registerUser(UserRequest request);

    /**
     * 특정 사용자의 정보를 조회합니다.
     *
     * @param username 조회하려는 사용자의 사용자명
     * @return 조회된 사용자 정보 (DTO)
     * @author 박종경
     */
    UserResponse getUserByUsername(String username);

    /**
     * 기존 사용자의 정보를 업데이트합니다.
     *
     * @param request 업데이트할 사용자 정보 (DTO)
     * @return 업데이트된 사용자 정보 (DTO)
     * @author 박종경
     */
    UserResponse updateUser(UserRequest request);

    /**
     * 특정 사용자를 삭제합니다.
     *
     * @param username 삭제하려는 사용자의 사용자명
     * @author 박종경
     */
    void deleteUser(String username);
}
