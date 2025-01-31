package com.gradation.backend.chat.controller;


import com.gradation.backend.chat.service.impl.ChatMessageService;
import com.gradation.backend.common.model.response.BaseResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "1:1 채팅 알림 관리", description = "1:1 채팅 알림 관리 API")
public class ChatNotificationController {

    private final ChatMessageService chatMessageService;

    @GetMapping("/unread-count")
    public ResponseEntity<BaseResponse<Long>> getUnreadCount(@RequestParam String sender, @RequestParam String receiver) {
        Long unreadCount = chatMessageService.getUnreadCount(sender, receiver);
        return ResponseEntity.ok(BaseResponse.success("읽지 않은 메시지의 수입니다.",unreadCount));
    }

    @PutMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestParam String sender, @RequestParam String receiver) {
        chatMessageService.markMessagesAsRead(sender, receiver);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<String>> getChatHistory(@RequestParam String sender, @RequestParam String receiver) {
        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);
        return ResponseEntity.ok(chatHistory);
    }
}
