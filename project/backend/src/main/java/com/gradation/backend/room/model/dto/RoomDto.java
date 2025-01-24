package com.gradation.backend.room.model.dto;

import com.gradation.backend.user.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RoomDto {
    private Long roomId;   // 방 ID
    private String title; // 방 제목
    private Boolean gameStatus;
    private User host;
}