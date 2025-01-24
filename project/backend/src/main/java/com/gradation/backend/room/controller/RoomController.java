package com.gradation.backend.room.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.room.model.response.RoomResponse;
import com.gradation.backend.room.model.response.RoomResponseDto;
import com.gradation.backend.room.model.response.TestResponse;
import com.gradation.backend.room.repository.RoomRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Request;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/")
@RequiredArgsConstructor
@Tag(name = "Room API", description = "Room API")
public class RoomController {

    private final RoomRepository roomRepository;

    //방 생성
    @PostMapping("room/")
    @Operation(summary = "방 생성", description = "새로운 대기방을 생성합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> createRoom(@RequestBody Request userRequest) {

        return ResponseEntity.ok(BaseResponse.success("success", RoomResponse));
    }

    //방 검색
    @GetMapping("room/")
    @Operation(summary = "방 검색", description = "방을 제목으로 검색합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> searchRoom(String title){

    }

    //방 목록
    @GetMapping("rooms/")
    @Operation(summary = "방 목록", description = "방 목록을 불러옵니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> getRooms(){

    }
}
