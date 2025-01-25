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
            System.out.println("gd");
            return false;
        }

        Friends friendRequest = new Friends();
        friendRequest.setUser(sender);
        friendRequest.setFriend(receiver);
        friendRequest.setStatus(FriendStatus.REQUESTED);
        friendsRepository.save(friendRequest);

        System.out.println("메시지 전송 경로: /topic/friend-requests/" + receiver.getUsername());
        System.out.println("전송된 메시지: " + sender.getNickname());
        // 친구 요청 실시간 알림
        messagingTemplate.convertAndSend(
                "/topic/friend-requests/" + receiver.getUsername(),
                sender.getNickname()
        );

        return true;
    }
    @Transactional
    public boolean acceptFriendRequest(User receiver, String senderNickname) {
        User sender = userRepository.findByNickname(senderNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Friends friendRequest = friendsRepository.findByUserAndFriendAndStatus(sender, receiver, FriendStatus.REQUESTED)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다."));

        friendRequest.setStatus(FriendStatus.ACCEPTED);
        friendsRepository.save(friendRequest);

        Friends reverseFriendRequest = new Friends();
        reverseFriendRequest.setUser(receiver);
        reverseFriendRequest.setFriend(sender);
        reverseFriendRequest.setStatus(FriendStatus.ACCEPTED);
        friendsRepository.save(reverseFriendRequest);

        // 양쪽 사용자에게 친구 목록 업데이트 알림
        messagingTemplate.convertAndSend(
                "/topic/friends/" + sender.getUsername(),
                "update-friend-list"
        );
        messagingTemplate.convertAndSend(
                "/topic/friends/" + receiver.getUsername(),
                "update-friend-list"
        );

        return true;
    }

    @Transactional
    public boolean removeFriend(User currentUser, String friendNickname) {
        User friendToRemove = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        List<Friends> friendRelations = friendsRepository.findAll().stream()
                .filter(f ->
                        (f.getUser().equals(currentUser) && f.getFriend().equals(friendToRemove)) ||
                                (f.getUser().equals(friendToRemove) && f.getFriend().equals(currentUser)))
                .collect(Collectors.toList());

        friendsRepository.deleteAll(friendRelations);
        return true;
    }
}
