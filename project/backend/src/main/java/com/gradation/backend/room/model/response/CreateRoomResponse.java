package com.gradation.backend.room.model.response;


import com.gradation.backend.room.model.entity.FakeUser;
import com.gradation.backend.room.model.entity.Room;
import lombok.Data;

import java.util.List;

@Data
public class CreateRoomResponse {
    private Long roomId;   // 방 ID
    private String title; // 방 제목
    private Boolean gameStatus; // 방 상태 (false: 대기중 / true: 게임중)
    private String hostNickName; // 방 생성자
    private int currentParticipantCount; // 현재 참여자 수
//    private List<String> nicknames; // 현재 참여자 목록
    private String token;

    // 엔티티 -> DTO
    public CreateRoomResponse(Room room, String token) {
        this.roomId = room.getRoomId();
        this.title = room.getTitle();
        this.gameStatus = room.getGameStatus();
        this.hostNickName = room.getFakeHost().getNickname();

        List<FakeUser> fakeUsers = room.getFakeUsers();  // Fetch Join으로 이미 로딩됨
        this.currentParticipantCount = fakeUsers.size(); // 조회된 참여자 list size

        this.token = token;
//        // fakeUsers에서 닉네임만 추출
//        this.nicknames = fakeUsers.stream()
//                        .map(FakeUser::getNickname)
//                        .collect(Collectors.toList());
    }
}