package com.gradation.backend.friends.service.impl;

import com.gradation.backend.friends.model.entitiy.FriendStatus;
import com.gradation.backend.friends.model.entitiy.Friends;
import com.gradation.backend.friends.model.response.FriendRequestListResponse;
import com.gradation.backend.friends.model.response.FriendResponse;
import com.gradation.backend.friends.repository.FriendsRepository;
import com.gradation.backend.friends.service.FriendsService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 친구 관리 서비스 클래스.
 *
 * 사용자 간의 친구 요청, 친구 수락, 친구 삭제 등을 처리하며
 * 친구 목록과 요청 목록을 조회하는 기능을 제공합니다.
 */
@Service
@AllArgsConstructor
public class FriendsServiceImpl implements FriendsService {

    private final UserRepository userRepository;
    private final FriendsRepository friendsRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * 사용자의 친구 목록을 조회합니다.
     *
     * @param userId 친구 목록을 조회할 사용자의 ID
     * @return {@link FriendResponse} 리스트로 구성된 친구 정보 (닉네임과 온라인/오프라인 상태)
     */
    @Transactional(readOnly = true)
    public List<FriendResponse> getFriends(Long userId) {
        return friendsRepository.findByUserIdAndStatus(userId, FriendStatus.ACCEPTED).stream()
                .map(friend -> new FriendResponse(
                        friend.getFriend().getNickname(),
                        friend.getFriend().getUserStatus() ? "온라인" : "오프라인"
                )).collect(Collectors.toList());
    }

    /**
     * 친구 요청을 보냅니다.
     *
     * @param sender         친구 요청을 보내는 사용자
     * @param friendNickname 친구 요청을 받을 사용자의 닉네임
     */
    @Transactional
    public void sendFriendRequest(User sender, String friendNickname) {
        User receiver = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 이미 친구 관계 또는 요청이 존재하는지 확인
        Optional<Friends> existingRelation = friendsRepository.findByUserAndFriend(sender, receiver);
        if (existingRelation.isPresent()) {
            return;
        }

        // 친구 요청 생성 및 저장
        Friends friendRequest = new Friends();
        friendRequest.setUser(sender);
        friendRequest.setFriend(receiver);
        friendRequest.setStatus(FriendStatus.REQUESTED);
        friendsRepository.save(friendRequest);

        // 친구 요청 실시간 알림 전송
        messagingTemplate.convertAndSend(
                "/topic/friend-requests/" + receiver.getUsername(),
                sender.getNickname());

    }

    /**
     * 친구 요청을 수락합니다.
     *
     * @param receiver       친구 요청을 수락하는 사용자
     * @param senderNickname 친구 요청을 보낸 사용자의 닉네임
     */
    @Transactional
    public void acceptFriendRequest(User receiver, String senderNickname) {
        User sender = userRepository.findByNickname(senderNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        Friends friendRequest = friendsRepository.findByUserAndFriendAndStatus(sender, receiver, FriendStatus.REQUESTED)
                .orElseThrow(() -> new RuntimeException("친구 요청을 찾을 수 없습니다."));

        // 친구 요청 상태를 "ACCEPTED"로 업데이트
        friendRequest.setStatus(FriendStatus.ACCEPTED);
        friendsRepository.save(friendRequest);

        // 친구 목록을 갱신하여 가져옴
        List<FriendResponse> updatedSenderFriends = friendsRepository.findFriendsByUser(sender, FriendStatus.ACCEPTED);
        List<FriendResponse> updatedReceiverFriends = friendsRepository.findFriendsByUser(receiver, FriendStatus.ACCEPTED);

        // 친구 목록 갱신 알림을 두 사용자에게 전송
        messagingTemplate.convertAndSend("/topic/friends/" + sender.getNickname(), updatedSenderFriends);
        messagingTemplate.convertAndSend("/topic/friends/" + receiver.getNickname(), updatedReceiverFriends);

    }

    /**
     * 현재 사용자와 특정 사용자의 친구 관계를 삭제합니다.
     *
     * @param currentUser    친구 관계를 삭제하는 사용자
     * @param friendNickname 삭제하려는 친구의 닉네임
     */
    @Transactional
    public void removeFriend(User currentUser, String friendNickname) {
        User friendToRemove = userRepository.findByNickname(friendNickname)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // 두 사용자 간의 모든 친구 관계를 조회 및 삭제
        List<Friends> friendRelations = friendsRepository.findAll().stream()
                .filter(f -> (f.getUser().equals(currentUser) && f.getFriend().equals(friendToRemove)) ||
                        (f.getUser().equals(friendToRemove) && f.getFriend().equals(currentUser)))
                .collect(Collectors.toList());

        friendsRepository.deleteAll(friendRelations);
    }

    /**
     * 현재 사용자가 받은 친구 요청 목록을 조회합니다.
     *
     * @param currentUser 친구 요청 목록을 조회할 사용자
     * @return {@link FriendRequestListResponse} 리스트로 구성된 요청 정보 (보낸 사람 닉네임과 요청 상태)
     */
    @Transactional(readOnly = true)
    public List<FriendRequestListResponse> getFriendRequests(User currentUser) {
        List<Friends> receivedRequests = friendsRepository.findByFriendAndStatus(currentUser, FriendStatus.REQUESTED);

        // 친구 요청 정보를 DTO로 변환
        List<FriendRequestListResponse> response = new ArrayList<>();
        for (Friends received : receivedRequests) {
            User sender = received.getUser();
            response.add(new FriendRequestListResponse(
                    sender.getNickname(),
                    received.getStatus().toString()
            ));
        }

        return response;
    }
}
