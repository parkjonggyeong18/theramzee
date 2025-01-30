package com.gradation.backend.chat.controller;


import com.gradation.backend.chat.service.impl.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatNotificationController {

    private final ChatMessageService chatMessageService;

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(@RequestParam String sender, @RequestParam String receiver) {
        Long unreadCount = chatMessageService.getUnreadCount(sender, receiver);
        return ResponseEntity.ok(unreadCount);
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
