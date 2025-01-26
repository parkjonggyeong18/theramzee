package com.gradation.backend.friends.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.friends.model.request.FriendRequest;
import com.gradation.backend.friends.service.FollowService;
import com.gradation.backend.room.model.entity.Room;
import com.gradation.backend.room.model.response.RoomFollowReesponse;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Tag(name = "친구 따라가기", description = "친구 따라가기 API")
public class FollowController {
    private final FollowService followService;
    private final UserService userService;

    // 친구의 방에 비밀번호를 무시하고 들어가기
    @PostMapping("/follow")
    public ResponseEntity<BaseResponse<RoomFollowReesponse>> followFriend(@RequestBody FriendRequest followFriendRequest) {
        User currentUser = userService.getCurrentUser();  // 현재 로그인한 사용자

        // 요청 본문에서 친구의 닉네임을 가져옴
        String friendNickname = followFriendRequest.getFriendNickname();

        // 친구의 방에 입장
        RoomFollowReesponse response = followService.joinRoomByFriend(currentUser, friendNickname);

        return ResponseEntity.ok(BaseResponse.success("방 참가에 성공했습니다.", response));  // 방 정보 반환
    }
}
