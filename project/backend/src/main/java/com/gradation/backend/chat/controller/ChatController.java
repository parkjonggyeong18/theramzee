//package com.gradation.backend.chat.controller;
//
//import io.swagger.v3.oas.annotations.Operation;
//import io.swagger.v3.oas.annotations.tags.Tag;
//import org.springframework.messaging.simp.SimpMessagingTemplate;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.stereotype.Controller;
//
//import java.security.Principal;
//import java.util.List;
//
//@Controller
//@Tag(name = "1:1 Chat API", description = "1:1 Chat API")
//public class ChatController {
//
//    private final ChatMessageService chatMessageService;
//    private final SimpMessagingTemplate messagingTemplate;
//
//    public ChatController(ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate) {
//        this.chatMessageService = chatMessageService;
//        this.messagingTemplate = messagingTemplate;
//    }
//
//    // 기존 메시지 조회
//    @MessageMapping("/chat.history")
//    @Operation(summary = "기존 메시지 조회", description = "기존 대화 내역을 가져옵니다.")
//    public void loadChatHistory(String receiver, Principal principal) {
//        String sender = principal.getName(); // 발신자 정보
//        System.out.println("Chat history 요청 - Sender: " + sender + ", Receiver: " + receiver);
//
//        // Redis에서 이전 대화 내역 조회
//        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);
//
//        // 조회된 내역을 발신자에게 전송
//        messagingTemplate.convertAndSendToUser(
//                sender, "/queue/chat-history", chatHistory
//        );
//
//        System.out.println("Chat history 전송 완료.");
//    }
//
//    @MessageMapping("/chat.send")
//    @Operation(summary = "메시지 전송", description = "발신자의 메시지를 수신자에게 전달합니다.")
//    public void sendMessage(ChatMessage chatMessage, Principal principal) {
//        // 현재 WebSocket 세션의 사용자 이름
//        String sender = principal.getName();
//        String receiver = chatMessage.getReceiver();
//
//        System.out.println("Sender: " + sender);
//        System.out.println("Receiver: " + receiver);
//
//        // 메시지를 개인 큐로 전송
//        messagingTemplate.convertAndSendToUser(
//                receiver, "/queue/messages", chatMessage
//        );
//    }
//}
