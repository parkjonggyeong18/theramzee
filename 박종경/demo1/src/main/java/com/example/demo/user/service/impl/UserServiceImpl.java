package com.example.demo.user.service.impl;

import com.example.demo.common.config.RedisConfig;
import com.example.demo.user.exception.UserNotFoundException;
import com.example.demo.user.model.entity.User;
import com.example.demo.user.model.request.UserRequest;
import com.example.demo.user.model.response.UserResponse;
import com.example.demo.user.repository.UserRepository;
import com.example.demo.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * UserServiceimpl는 사용자 관리와 관련된 비즈니스 로직을 처리하는 서비스 클래스입니다.
 * Spring Security의 UserDetailsService를 구현하여 사용자 인증 로직도 제공합니다.
 */
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisConfig redisConfig;
    private final RedisTemplate<String, String> redisTemplate;
    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder, RedisConfig redisConfig, RedisTemplate<String, String> redisTemplate) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.redisConfig = redisConfig;
        this.redisTemplate = redisTemplate;
    }

    /**
     * Spring Security에서 사용자를 인증하기 위해 호출되는 메서드.
     *
     * @param username 인증하려는 사용자의 사용자명
     * @return UserDetails 객체 (Spring Security에서 사용)
     * @throws UsernameNotFoundException 사용자가 존재하지 않을 경우 예외 발생
     * @author 박종경
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), Collections.emptyList());
    }

    /**
     * 새로운 사용자를 등록합니다.
     *
     * @param request 등록하려는 사용자 정보 (DTO)
     * @return 저장된 사용자 정보 (DTO)
     */
    @Override
    public UserResponse registerUser(UserRequest request) {
        // 이메일 인증 여부 확인
        ValueOperations<String, String> valOperations = redisTemplate.opsForValue();
        String emailVerified = valOperations.get(request.getEmail() + ":verified");

        if (emailVerified == null || !emailVerified.equals("true")) {
            throw new IllegalStateException("이메일 인증이 완료되지 않았습니다.");
        }

        // 사용자 이름 중복 확인
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("이미 존재하는 사용자 이름입니다.");
        }

        // 새로운 사용자 생성
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // 사용자 저장
        User savedUser = userRepository.save(user);

        // 인증 상태 제거 (회원가입 후 인증 상태 삭제)
        redisTemplate.delete(request.getEmail() + ":verified");

        return toResponseDTO(savedUser);
    }
    /**
     * 특정 사용자의 정보를 조회합니다.
     *
     * @param username 조회하려는 사용자의 사용자명
     * @return 조회된 사용자 정보 (DTO)
     * @author 박종경
     */
    @Override
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        return toResponseDTO(user);
    }

    /**
     * 기존 사용자의 정보를 업데이트합니다.
     *
     * @param request 업데이트할 사용자 정보 (DTO)
     * @return 업데이트된 사용자 정보 (DTO)
     * @author 박종경
     */
    @Override
    public UserResponse updateUser(UserRequest request) {
        User existingUser = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (request.getEmail() != null && !request.getEmail().isEmpty()) {
            existingUser.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return toResponseDTO(userRepository.save(existingUser));
    }

    /**
     * 특정 사용자를 삭제합니다.
     *
     * @param username 삭제하려는 사용자의 사용자명
     * @author 박종경
     */
    @Override
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User not found"));
        userRepository.delete(user);
    }

    /**
     * Entity -> ResponseDTO 변환 메서드.
     *
     * @param user 변환할 사용자 엔티티
     * @return 변환된 ResponseDTO 객체
     * @author 박종경
     */
    private UserResponse toResponseDTO(User user) {
        UserResponse response = new UserResponse();
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        return response;
    }
}
