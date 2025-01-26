package com.gradation.backend.room.model.entity;

import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class initDb {

    private final InitService initService;

    @PostConstruct
    public void init() {
        initService.dbInit1();
        initService.dbInit2();
        initService.dbInit3();
        initService.dbInit4();
        initService.dbInit5();

    }

    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService {

        private final EntityManager em;

        public void dbInit1() {
            FakeUser fakeUser1 = createUser(
                    "userA",
                    "test1",
                    "fake1",
                    "1234",
                    "test@test.com",
                    "google",
                    true);

            em.persist(fakeUser1);

        }

        public void dbInit2() {
            FakeUser fakeUser2 = createUser(
                    "userB",
                    "test2",
                    "fake2",
                    "1234",
                    "test2@test2.com",
                    "kakao",
                    true);

            em.persist(fakeUser2);

        }

        public void dbInit3() {
            FakeUser fakeUser3 = createUser(
                    "userC",
                    "test3",
                    "외쳐갓종경",
                    "1234",
                    "test3@test3.com",
                    "kakao",
                    true);

            em.persist(fakeUser3);

        }

        public void dbInit4() {
            FakeUser fakeUser4 = createUser(
                    "userD",
                    "test4",
                    "대선진",
                    "1234",
                    "test4@test4.com",
                    "kakao",
                    true);

            em.persist(fakeUser4);

        }

        public void dbInit5() {
            FakeUser fakeUser5 = createUser(
                    "userE",
                    "test5",
                    "김승윤",
                    "1234",
                    "test5@test5.com",
                    "kakao",
                    true);

            em.persist(fakeUser5);

        }

        private static FakeUser createUser(
                String username,
                String name,
                String nickname,
                String password,
                String email,
                String loginRoot,
                Boolean userStatus) {
            FakeUser fakeUser = new FakeUser();

            fakeUser.setUsername(username);
            fakeUser.setName(name);
            fakeUser.setNickname(nickname);
            fakeUser.setPassword(password);
            fakeUser.setEmail(email);
            fakeUser.setLoginRoot(loginRoot);
            fakeUser.setUserStatus(userStatus);

            return fakeUser;
        }

    }
}
