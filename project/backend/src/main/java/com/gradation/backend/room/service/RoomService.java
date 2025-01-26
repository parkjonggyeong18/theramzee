package com.gradation.backend.room.service;

import com.gradation.backend.room.model.entity.FakeUser;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.repository.FakeUserRepository;
import com.gradation.backend.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RoomService {

    private final RoomRepository roomRepository;
    private final FakeUserRepository fakeUserRepository;

    /**
     * 방 생성
     *
     * @param title
     * @param password
     * @param nickname
     * @return
     */
    @Transactional
    public Room createRoom(String title, Integer password, String nickname) {
        // 예시: SecurityContext 에서 현재 사용자 ID를 가져와 DB 조회
//        Long userId = SecurityContextHolder.getContext().getAuthentication().getId();
//        User user = userRepository.find(userId)
//                .orElseThrow(() -> new RuntimeException("User not found"));

        FakeUser fakeHost = fakeUserRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("생성자 닉네임이 필요합니다."));

        // 2) 방 엔티티 생성 & DB 저장
        Room room = Room.createRoom(title, password, fakeHost);
        roomRepository.save(room);
        roomRepository.flush();

        // Fetch Join을 사용하여 fakeUsers를 강제로 로드
        return roomRepository.findByIdWithFakeUsers(room.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found after creation"));

    }

    /**
     * 방 참가
     *
     * @param roomId
     * @param nickname
     * @param password
     * @return room
     */
    @Transactional
    public Room joinRoom(Long roomId, String nickname, Integer password) {
        // 참여자 유저 조회
        FakeUser fakeUser = fakeUserRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("참여자를 찾을 수 없습니다."));

        // 방 조회 (fetch join)
        Room room = roomRepository.findByIdWithFakeUsers(roomId)
                .orElseThrow(() -> new RuntimeException("참여하려는 방을 찾을 수 없습니다."));

        //비번방일 경우 비밀번호 검증
        if(room.getPassword() != null && !password.equals(room.getPassword())){
            throw new IllegalArgumentException("비밀번호 오류!");
        }

        // 참여자 추가
        room.addFakeUser(fakeUser);

        return room;
    }

    /**
     * 방 나가기
     *
     * @param roomId
     * @param nickname
     */
    @Transactional
    public void leaveRoom(Long roomId, String nickname) {
        // 참여자 유저 조회
        FakeUser fakeUser = fakeUserRepository.findByNickname(nickname)
                .orElseThrow(() -> new RuntimeException("참여자를 찾을 수 없습니다."));

        // 방 조회 (fetch join)
        Room room = roomRepository.findByIdWithFakeUsers(roomId)
                .orElseThrow(() -> new RuntimeException("참여하려는 방을 찾을 수 없습니다."));

        // 참여자 검증
        if(fakeUser.equals(room.getFakeHost())){
            // 방에 참여한 모든 FakeUser의 room 필드를 null로 설정
            List<FakeUser> fakeUsers = room.getFakeUsers();
            for (FakeUser participant : fakeUsers) {
                participant.setRoom(null);
            }
            roomRepository.delete(room);
        }
        room.removeFakeUser(fakeUser);
    }

    /**
     * 방 목록 조회
     *
     * @return 방 목록
     */
    @Transactional(readOnly = true)
    public List<Room> getRooms(){
        return roomRepository.findAllWithFakeUsers();
    }

    /**
     * 방 단건 조회
     *
     * @param roomId
     * @return 방 하나
     */
    @Transactional(readOnly = true)
    public Room getRoom(Long roomId){
        return roomRepository.findByIdWithFakeUsers(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found. id=" + roomId));

    }
}
