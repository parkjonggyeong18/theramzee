package com.gradation.backend.user.repository;


import com.gradation.backend.user.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * UserRepository는 사용자 데이터를 관리하기 위한 JPA 리포지토리 인터페이스입니다.
 * Spring Data JPA를 사용하여 데이터베이스와 상호작용합니다.
 */
public interface UserRepository extends JpaRepository<User, Long>{

    /**
     * 사용자명을 기반으로 사용자를 조회합니다.
     *
     * @param username 조회하려는 사용자의 사용자명
     * @return 사용자 정보가 포함된 Optional 객체 (존재하지 않을 경우 빈 Optional 반환)
     * @author 박종경
     */
    Optional<User> findByUsername(String username);

    /**
     * 특정 사용자명이 존재하는지 확인합니다.
     *
     * @param username 확인하려는 사용자명
     * @return 사용자명이 존재하면 true, 그렇지 않으면 false
     * @author 박종경
     */
    boolean existsByUsername(String username);

    /**
     * 특정 사용자명이 존재하는지 확인합니다.
     *
     * @param email 확인하려는 이메일명
     * @return 이메일명이 존재하면 true, 그렇지 않으면 false
     * @author 박종경
     */
    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<User> findByNameAndEmail(String name, String email);

    Optional<User> findByEmailAndUsername(String email, String username);
}
