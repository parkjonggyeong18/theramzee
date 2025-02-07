//package com.gradation.backend.room.model.entity;
//
//
//import com.gradation.backend.user.model.request.UserRequest;
//import com.gradation.backend.user.service.UserService;
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Component;
//import org.springframework.transaction.annotation.Transactional;
//
//@Component
//@RequiredArgsConstructor
//public class initDB {
//
//    private final InitService initService;
//
//    @PostConstruct
//    public void init() {
//        initService.dbInit1();
//        initService.dbInit2();
//        initService.dbInit3();
//        initService.dbInit4();
//        initService.dbInit5();
//    }
//
//    @Component
//    @Transactional
//    @RequiredArgsConstructor
//    static class InitService {
//
//        private final UserService userService;
//        private final RedisTemplate<String, String> redisTemplate;
//
//        public void dbInit1() {
//            String email = "test1@test.com";
//            // 이메일 인증 상태 미리 설정
//            redisTemplate.opsForValue().set(email + ":verified", "true");
//
//            UserRequest request = createUserRequest(
//                    "test1",          // username (5~15자)
//                    "Test User1",     // name
//                    "TestUser1",      // nickname
//                    email,
//                    "Test123!"        // 비밀번호: 대문자, 소문자, 숫자, 특수문자 포함, 8자 이상
//            );
//            userService.registerUser(request);
//        }
//
//        public void dbInit2() {
//            String email = "test2@test.com";
//            redisTemplate.opsForValue().set(email + ":verified", "true");
//
//            UserRequest request = createUserRequest(
//                    "test2",
//                    "Test User2",
//                    "TestUser2",
//                    email,
//                    "Test123!"
//            );
//            userService.registerUser(request);
//        }
//
//        public void dbInit3() {
//            String email = "test3@test.com";
//            redisTemplate.opsForValue().set(email + ":verified", "true");
//
//            UserRequest request = createUserRequest(
//                    "test3",
//                    "Test User3",
//                    "TestUser3",
//                    email,
//                    "Test123!"
//            );
//            userService.registerUser(request);
//        }
//
//        public void dbInit4() {
//            String email = "test4@test.com";
//            redisTemplate.opsForValue().set(email + ":verified", "true");
//
//            UserRequest request = createUserRequest(
//                    "test4",
//                    "Test User4",
//                    "TestUser4",
//                    email,
//                    "Test123!"
//            );
//            userService.registerUser(request);
//        }
//
//        public void dbInit5() {
//            String email = "test5@test.com";
//            redisTemplate.opsForValue().set(email + ":verified", "true");
//
//            UserRequest request = createUserRequest(
//                    "test5",
//                    "Test User5",
//                    "TestUser5",
//                    email,
//                    "Test123!"
//            );
//            userService.registerUser(request);
//        }
//
//        private UserRequest createUserRequest(String username,
//                                              String name,
//                                              String nickname,
//                                              String email,
//                                              String password) {
//            UserRequest request = new UserRequest();
//            request.setUsername(username);
//            request.setName(name);
//            request.setNickname(nickname);
//            request.setEmail(email);
//            request.setPassword(password);
//            return request;
//        }
//    }
//}
