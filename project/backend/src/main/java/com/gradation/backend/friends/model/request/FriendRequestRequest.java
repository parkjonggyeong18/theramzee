package com.gradation.backend.friends.model.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendRequestRequest {
    private String senderNickname;
    private String senderStatus;
}
