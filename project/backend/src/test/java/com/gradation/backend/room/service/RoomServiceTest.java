package com.gradation.backend.room.service;

import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.repository.RoomRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class RoomServiceTest {

    @Autowired
    private FakeUserRepository fakeUserRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Test
    void testCreateRoomWithFakeUser() {
        // 1. 방 먼저 생성
        Room room = new Room();
        room.setTitle("Test Room");
        roomRepository.save(room);

        // 2. FakeUser 생성
        FakeUser fakeUser = new FakeUser();
        fakeUser.setUsername("fakeUsername");
        fakeUser.setName("Fake Name");
        fakeUser.setNickname("FakeNick");
        fakeUser.setPassword("1234");
        fakeUser.setEmail("fake@example.com");
        fakeUser.setLoginRoot("web");
        fakeUser.setUserStatus(true);

        // 3. 방과의 연관관계 설정
        fakeUser.setRoom(room);

        // 4. 저장
        FakeUser savedUser = fakeUserRepository.save(fakeUser);

        // 5. 검증
        assertNotNull(savedUser.getId());
        assertEquals("FakeNick", savedUser.getNickname());
        assertEquals(room.getRoomId(), savedUser.getRoom().getRoomId());
    }
}