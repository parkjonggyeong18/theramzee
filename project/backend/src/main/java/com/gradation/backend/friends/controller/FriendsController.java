package com.gradation.backend.friends.controller;

import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.common.utill.JwtTokenUtil;
import com.gradation.backend.friends.model.request.FriendRequest;
import com.gradation.backend.friends.model.response.FriendRequestResponse;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.service.FriendsService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendsController {
    private final UserService userService;
    private final FriendsService friendService;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping
    @Transactional
    public ResponseEntity<BaseResponse<List<FriendResponse>>> getFriends(@RequestHeader("Authorization") String token) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        Long userId = userService.getUserId(username);
        List<FriendResponse> friendResponse = friendService.getFriends(userId);
        System.out.println(friendResponse);
        return ResponseEntity.ok(BaseResponse.success("친구 찾기 성공적으로 처리되었습니다.", friendResponse));
    }

    @PostMapping("/request")
    public ResponseEntity<BaseResponse<FriendRequestResponse>> sendFriendRequest(@RequestHeader("Authorization") String token, @RequestBody FriendRequest friendRequest) {
        String username = jwtTokenUtil.extractUsername(token.substring(7));
        User user = userService.getUserByUserName(username);
        FriendRequestResponse response = FriendRequestResponse.builder().senderNickname(user.getNickname())
                .receiverNickname(friendRequest.getFriendNickname()).build();
        return ResponseEntity.ok(BaseResponse.success("친구 요청을 성공했습니다.", response));
    }
}