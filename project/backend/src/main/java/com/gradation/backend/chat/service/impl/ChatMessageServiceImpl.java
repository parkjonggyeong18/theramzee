package com.gradation.backend.chat.service;//package com.gradation.backend.chat.service.impl;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ChatMessageService {
//
//    private static final String CHAT_PREFIX = "chat:"; // Redis 키 접두사
//
//    @Autowired
//    private RedisTemplate<String, String> redisTemplate;
//
//    // Redis 키 생성 (발신자와 수신자 기준)
//    private String generateChatKey(String sender, String receiver) {
//        // 항상 일정한 순서로 키를 생성 (사전순 정렬)
//        if (sender.compareTo(receiver) < 0) {
//            return CHAT_PREFIX + sender + ":" + receiver;
//        } else {
//            return CHAT_PREFIX + receiver + ":" + sender;
//        }
//    }
//
//    // 메시지 저장
//    public void saveMessage(String sender, String receiver, String content) {
//        String key = generateChatKey(sender, receiver);
//        String message = String.format("%s: %s", sender, content); // 메시지 포맷: "발신자: 메시지 내용"
//        redisTemplate.opsForList().rightPush(key, message); // Redis List에 메시지 추가
//        redisTemplate.expire(key, 24, java.util.concurrent.TimeUnit.HOURS); // 24시간 TTL 설정
//        System.out.println("Redis에 저장된 메시지: " + message + " (Key: " + key + ")");
//    }
//
//    // 메시지 조회
//    public List<String> getMessages(String sender, String receiver) {
//        String key = generateChatKey(sender, receiver);
//        return redisTemplate.opsForList().range(key, 0, -1); // 해당 Redis 키의 모든 메시지 조회
//    }
//}



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 채팅 메시지 관리 서비스 클래스.
 *
 * Redis를 활용하여 채팅 메시지 저장, 조회, 읽지 않은 메시지 관리 등의 기능을 제공합니다.
 */
@Service
public class ChatMessageServiceImpl implements ChatMessageService{

    private static final String CHAT_PREFIX = "chat:"; // Redis 키 접두사

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    /**
     * 두 사용자를 기준으로 Redis 채팅 키를 생성합니다.
     *
     * 채팅 키는 사용자 이름을 사전순으로 정렬하여 항상 동일한 키를 생성합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return Redis 채팅 키
     */
    public String generateChatKey(String sender, String receiver) {
        if (sender.compareTo(receiver) < 0) {
            return CHAT_PREFIX + sender + ":" + receiver;
        } else {
            return CHAT_PREFIX + receiver + ":" + sender;
        }
    }

    /**
     * 읽지 않은 메시지 카운트를 관리하기 위한 Redis 키를 생성합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 읽지 않은 메시지 카운트를 위한 Redis 키
     */
    public String generateUnreadKey(String sender, String receiver) {
        return "unread:" + generateChatKey(sender, receiver);
    }

    /**
     * 메시지를 Redis에 저장합니다.
     *
     * 메시지는 송신자와 수신자 간 채팅 키를 기준으로 저장되며, 읽지 않은 메시지 카운트를 증가시킵니다.
     * 메시지는 24시간 동안 유지됩니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @param content  메시지 내용
     */
    public void saveMessage(String sender, String receiver, String content) {
        String key = generateChatKey(sender, receiver);
        String message = String.format("%s: %s", sender, content);
        redisTemplate.opsForList().rightPush(key, message);
        // 읽지 않은 메시지 카운트 증가
        String unreadKey = generateUnreadKey(sender, receiver);
        // 채팅 키의 TTL(유효 기간) 설정: 24시간
        redisTemplate.expire(key, 24, java.util.concurrent.TimeUnit.HOURS);
        redisTemplate.opsForValue().increment(unreadKey);

    }

    /**
     * 특정 사용자 간의 모든 채팅 메시지를 Redis에서 조회합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 송신자와 수신자 간의 모든 메시지 리스트
     */
    public List<String> getMessages(String sender, String receiver) {
        String key = generateChatKey(sender, receiver);
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    /**
     * 읽지 않은 메시지 개수를 조회합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     * @return 읽지 않은 메시지 개수
     */
    public Long getUnreadCount(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        String value = redisTemplate.opsForValue().get(unreadKey); // Redis에서 값 가져오기

        return value != null ? Long.parseLong(value) : 0L; // 문자열을 Long으로 변환
    }

    /**
     * 읽지 않은 메시지를 읽음 처리합니다.
     *
     * 읽지 않은 메시지 카운트를 관리하는 Redis 키를 삭제하여 초기화합니다.
     *
     * @param sender   메시지 송신자
     * @param receiver 메시지 수신자
     */
    public void markMessagesAsRead(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        redisTemplate.delete(unreadKey); // 읽지 않은 카운트 초기화
    }
}
