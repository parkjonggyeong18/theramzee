package com.gradation.backend.chat.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatMessageService {

    private static final String CHAT_PREFIX = "chat:"; // Redis 키 접두사

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    // Redis 키 생성 (발신자와 수신자 기준)
    private String generateChatKey(String sender, String receiver) {
        // 항상 일정한 순서로 키를 생성 (사전순 정렬)
        if (sender.compareTo(receiver) < 0) {
            return CHAT_PREFIX + sender + ":" + receiver;
        } else {
            return CHAT_PREFIX + receiver + ":" + sender;
        }
    }

    // 메시지 저장
    public void saveMessage(String sender, String receiver, String content) {
        String key = generateChatKey(sender, receiver);
        String message = String.format("%s: %s", sender, content); // 메시지 포맷: "발신자: 메시지 내용"
        redisTemplate.opsForList().rightPush(key, message); // Redis List에 메시지 추가
        redisTemplate.expire(key, 24, java.util.concurrent.TimeUnit.HOURS); // 24시간 TTL 설정
        System.out.println("Redis에 저장된 메시지: " + message + " (Key: " + key + ")");
    }

    // 메시지 조회
    public List<String> getMessages(String sender, String receiver) {
        String key = generateChatKey(sender, receiver);
        return redisTemplate.opsForList().range(key, 0, -1); // 해당 Redis 키의 모든 메시지 조회
    }
}
