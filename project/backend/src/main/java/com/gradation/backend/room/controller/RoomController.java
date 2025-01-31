package com.gradation.backend.room.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.model.request.CreateRoomRequest;
import com.gradation.backend.room.model.request.JoinRoomRequest;
import com.gradation.backend.room.model.request.LeaveRoomRequest;
import com.gradation.backend.room.model.response.RoomResponse;

import com.gradation.backend.room.service.RoomService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/")
@RequiredArgsConstructor
@Tag(name = "Room API", description = "Room API")
public class RoomController {

    private final RoomService roomService;
    private final UserService userService;

    /**
     * 방 생성
     */
    @PostMapping("rooms/")
    @Operation(summary = "방 생성", description = "새로운 방을 생성합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> createRoom(@RequestBody CreateRoomRequest request) {
        User currentUser = userService.getCurrentUser();
        System.out.println(currentUser.getNickname() + "11");
        Room createdRoom = roomService.createRoom(
                request.getTitle(),
                request.getPassword(),
                currentUser.getNickname()
        );
        RoomResponse response = new RoomResponse(createdRoom);
        return ResponseEntity.ok(BaseResponse.success("success", response));
    }

    /**
     * 방 참여
     */
    @PostMapping("rooms/{roomId}/join/")
    @Operation(summary = "방 참여", description = "방에 참여합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> joinRoom(
            @PathVariable Long roomId,
            @RequestBody JoinRoomRequest request
    ) {
        try {
            Room updatedRoom = roomService.joinRoom(roomId, request.getNickname(), request.getPassword());
            RoomResponse response = new RoomResponse(updatedRoom);
            return ResponseEntity.ok(BaseResponse.success("success", response));
        } catch (IllegalArgumentException e) {
            // 비밀번호 오류 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(BaseResponse.error("비밀번호가 일치하지 않습니다."));
        }
    }

    /**
     * 방 나가기
     */
    @PostMapping("rooms/{roomId}/leave/")
    @Operation(summary = "방 나가기", description = "방을 나갑니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> leaveRoom(
            @PathVariable Long roomId,
            @RequestBody LeaveRoomRequest request
    ) {
        roomService.leaveRoom(roomId, request.getNickname());
        return ResponseEntity.ok(BaseResponse.success("success",null));
    }

    /**
     * 방 목록 조회
     */
    @GetMapping("rooms/")
    @Operation(summary = "방 목록 조회", description = "방 목록을 조회합니다.")
    public ResponseEntity<BaseResponse<List<RoomResponse>>> getRooms() {
        List<Room> rooms = roomService.getRooms();
        List<RoomResponse> responseList = rooms.stream()
                .map(r -> new RoomResponse(r))
                .collect(Collectors.toList());
        return ResponseEntity.ok(BaseResponse.success("success", responseList));
    }

    /**
     * 방 단건 조회
     */
    @GetMapping("rooms/{roomId}/")
    @Operation(summary = "방 단건 조회", description = "roomId로 방을 조회합니다.")
    public ResponseEntity<BaseResponse<RoomResponse>> searchRoom(@PathVariable Long roomId) {
        Room room = roomService.getRoom(roomId);
        RoomResponse response = new RoomResponse(room);
        return ResponseEntity.ok(BaseResponse.success("success", response));
    }
}
