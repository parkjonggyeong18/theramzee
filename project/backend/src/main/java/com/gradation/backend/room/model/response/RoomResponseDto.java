package com.gradation.backend.room.model.response;

import com.gradation.backend.user.model.entity.User;

public class RoomResponse {
    private Long roomId;   // 방 ID
    private String title; // 방 제목
    private Boolean gameStatus; // 게임 상태
    private User host; // 생성자
}
