package com.gradation.backend.chat.service.impl;//package com.gradation.backend.chat.service.impl;
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

@Service
public class ChatMessageService {

    private static final String CHAT_PREFIX = "chat:"; // Redis 키 접두사

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private String generateChatKey(String sender, String receiver) {
        if (sender.compareTo(receiver) < 0) {
            return CHAT_PREFIX + sender + ":" + receiver;
        } else {
            return CHAT_PREFIX + receiver + ":" + sender;
        }
    }

    private String generateUnreadKey(String sender, String receiver) {
        return "unread:" + generateChatKey(sender, receiver);
    }

    public void saveMessage(String sender, String receiver, String content) {
        String key = generateChatKey(sender, receiver);
        String message = String.format("%s: %s", sender, content);
        redisTemplate.opsForList().rightPush(key, message);
        // 읽지 않은 메시지 카운트 증가
        String unreadKey = generateUnreadKey(sender, receiver);
        redisTemplate.expire(key, 24, java.util.concurrent.TimeUnit.HOURS);
        redisTemplate.opsForValue().increment(unreadKey);

    }

    public List<String> getMessages(String sender, String receiver) {
        String key = generateChatKey(sender, receiver);
        return redisTemplate.opsForList().range(key, 0, -1);
    }

    public Long getUnreadCount(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        String value = redisTemplate.opsForValue().get(unreadKey); // Redis에서 값 가져오기

        return value != null ? Long.parseLong(value) : 0L; // 문자열을 Long으로 변환
    }

    public void markMessagesAsRead(String sender, String receiver) {
        String unreadKey = generateUnreadKey(sender, receiver);
        redisTemplate.delete(unreadKey); // 읽지 않은 카운트 초기화
    }
}
