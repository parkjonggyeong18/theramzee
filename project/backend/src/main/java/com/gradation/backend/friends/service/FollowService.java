package com.gradation.backend.friends.service;

import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.repository.RoomRepository;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public Room joinRoomByFriend(User currentUser, String friendNickname) {
        // 친구의 정보를 조회
        User friend = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("친구를 찾을 수 없습니다."));

        // 친구가 속한 방 정보 조회
        Room friendRoom = friend.getRoom();
        if (friendRoom == null) {
            throw new RuntimeException("친구가 속한 방이 없습니다.");
        }

        // 친구의 방으로 입장 (비밀번호 무시)
        currentUser.setRoom(friendRoom);
        // 현재 유저의 방 정보 업데이트
        userRepository.save(currentUser);

        return friendRoom;
    }
}
