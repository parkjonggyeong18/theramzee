package com.gradation.backend.friends.service;

import com.gradation.backend.friends.model.entitiy.FriendStatus;
import com.gradation.backend.friends.model.entitiy.Friends;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.repository.FriendsRepository;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FriendsService {
    private final UserRepository userRepository;
    private final FriendsRepository friendsRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<FriendResponse> getFriends(Long userId) {
        return friendsRepository.findByUserIdAndStatus(userId, FriendStatus.ACCEPTED).stream()
                .map(friend -> new FriendResponse(
                        friend.getFriend().getNickname(),
                        friend.getFriend().getUserStatus() ? "온라인" : "오프라인"
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean sendFriendRequest(User sender, String friendNickname) {
        System.out.println(friendNickname);
        User receiver = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 이미 요청이나 친구 관계가 있는지 확인
        Optional<Friends> existingRelation = friendsRepository.findByUserAndFriend(sender, receiver);
        if (existingRelation.isPresent()) {
            return false;
        }

        Friends friendRequest = new Friends();
        friendRequest.setUser(sender);
        friendRequest.setFriend(receiver);
        friendRequest.setStatus(FriendStatus.REQUESTED);
        friendsRepository.save(friendRequest);

        // 친구 요청 실시간 알림
        messagingTemplate.convertAndSend(
                "/topic/friend-requests/" + receiver.getNickname(),
                sender.getNickname()
        );
        return true;
    }

}
