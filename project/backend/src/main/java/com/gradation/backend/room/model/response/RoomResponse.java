package com.gradation.backend.room.model.response;

import com.gradation.backend.room.model.entity.Room;

import com.gradation.backend.user.model.entity.User;
import lombok.Data;
import java.util.List;

@Data
public class RoomResponse {
    private Long roomId;   // 방 ID
    private String title; // 방 제목
    private Boolean gameStatus; // 방 상태 (false: 대기중 / true: 게임중)
    private String hostNickName; // 방 생성자
    private int currentParticipantCount; // 현재 참여자 수
//    private List<String> nicknames; // 현재 참여자 목록

    // 엔티티 -> DTO
    public RoomResponse(Room room) {
        this.roomId = room.getId();
        this.title = room.getTitle();
        this.gameStatus = room.getGameStatus();
        this.hostNickName = room.getHost().getNickname();

        List<User> fakeUsers = room.getUsers();  // Fetch Join으로 이미 로딩됨
        this.currentParticipantCount = fakeUsers.size(); // 조회된 참여자 list size

//        // fakeUsers에서 닉네임만 추출
//        this.nicknames = fakeUsers.stream()
//                        .map(FakeUser::getNickname)
//                        .collect(Collectors.toList());
    }
}
