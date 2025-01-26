package com.gradation.backend.friends.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.friends.model.request.FriendAcceptRequest;
import com.gradation.backend.friends.model.request.FriendRequest;
import com.gradation.backend.friends.model.request.FriendRequestRequest;
import com.gradation.backend.friends.model.response.FriendRequestResponse;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.service.FriendsService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
@Tag(name = "친구 관리", description = "친구 관리 API")
public class FriendsController {
    private final UserService userService;
    private final FriendsService friendService;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping
    @Transactional
    public ResponseEntity<BaseResponse<List<FriendResponse>>> getFriends(@RequestHeader("Authorization") String token) {
        System.out.println(token + ":");
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        Long userId = userService.getUserId(username);
        List<FriendResponse> friendResponse = friendService.getFriends(userId);
        System.out.println(friendResponse);
        return ResponseEntity.ok(BaseResponse.success("친구 찾기 성공적으로 처리되었습니다.", friendResponse));
    }
    @GetMapping("/request")
    public ResponseEntity<List<FriendRequestRequest>> getFriendRequests() {
        User currentUser = userService.getCurrentUser();  // 로그인한 유저 정보 가져오기
        List<FriendRequestRequest> friendRequests = friendService.getFriendRequests(currentUser);  // 친구 요청 조회
        return ResponseEntity.ok(friendRequests);  // 친구 요청 목록 반환
    }

    @PostMapping("/request")
    @Transactional
    public ResponseEntity<BaseResponse<FriendRequestResponse>> sendFriendRequest(@RequestHeader("Authorization") String token, @RequestBody FriendRequest friendRequest) {
        System.out.println(token);
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        User user = userService.getUserByUserName(username);
        friendService.sendFriendRequest(user, friendRequest.getFriendNickname());
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(user.getNickname())
                .receiverNickname(friendRequest.getFriendNickname()).build();
        return ResponseEntity.ok(BaseResponse.success("친구 요청을 성공했습니다.", response));
    }

    @PostMapping("/accept")
    @Transactional
    public ResponseEntity<BaseResponse<FriendRequestResponse>> acceptFriendRequest(@RequestHeader("Authorization") String token, @RequestBody FriendAcceptRequest acceptRequest) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        User user = userService.getUserByUserName(username);
        friendService.acceptFriendRequest(user, acceptRequest.getSenderNickname());
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(acceptRequest.getSenderNickname())
                .receiverNickname(user.getNickname()).build();
        return ResponseEntity.ok(BaseResponse.success("친구 요청을 수락했습니다.", response));
    }

    @DeleteMapping
    @Transactional
    public ResponseEntity<BaseResponse<FriendRequestResponse>> removeFriend(@RequestHeader("Authorization") String token, @RequestBody FriendRequest friendRequest) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        User user = userService.getUserByUserName(username);
        friendService.removeFriend(user, friendRequest.getFriendNickname());
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(user.getNickname())
                .receiverNickname(friendRequest.getFriendNickname()).build();
        return ResponseEntity.ok(BaseResponse.success("삭제에 성공했습니다.", response));
    }
}