package com.gradation.backend.chat.controller;

import com.gradation.backend.chat.model.entity.ChatMessage;
import com.gradation.backend.chat.service.ChatMessageService;
import com.gradation.backend.user.model.entity.User;
import com.gradation.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;

@Controller
@Tag(name = "1:1 채팅 관리", description = "채팅 관리 API")
public class ChatController {

    private final ChatMessageService chatMessageService;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;

    public ChatController(ChatMessageService chatMessageService, SimpMessagingTemplate messagingTemplate, UserService userService) {
        this.chatMessageService = chatMessageService;
        this.messagingTemplate = messagingTemplate;
        this.userService = userService;
    }

    // 기존 메시지 조회
    @Operation(
            summary = "채팅 내역 조회",
            description = "사용자가 요청한 채팅 내역을 조회하여 반환합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "채팅 내역 조회 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청")
            }
    )
    @MessageMapping("/chat.history")
    @Transactional
    public void loadChatHistory(String receiver, Principal principal) {
        String sender = principal.getName(); // 발신자 정보
        System.out.println("Chat history 요청 - Sender: " + sender + ", Receiver: " + receiver);
        // Redis에서 이전 대화 내역 조회
        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);

        // 조회된 내역을 발신자에게 전송
        messagingTemplate.convertAndSendToUser(
                sender, "/queue/chat-history", chatHistory
        );

        System.out.println("Chat history 전송 완료.");
    }

//    @MessageMapping("/chat.history")
//    @Transactional
//    public void loadChatHistory(String receiver, Principal principal) {
//        String sender = principal.getName(); // 발신자 정보
//        System.out.println("Chat history 요청 - Sender: " + sender + ", Receiver: " + receiver);
//        User user = userService.getUserByUserNickname(receiver);
//        // Redis에서 이전 대화 내역 조회
//        List<String> chatHistory = chatMessageService.getMessages(sender, user.getUsername());
//
//        // 조회된 내역을 발신자에게 전송
//        messagingTemplate.convertAndSendToUser(
//                sender, "/queue/chat-history", chatHistory
//        );
//
//        System.out.println("Chat history 전송 완료.");
//    }

    @Operation(
            summary = "메시지 전송",
            description = "새로운 채팅 메시지를 보내고, 상대방에게 실시간으로 전송합니다.",
            responses = {
                    @ApiResponse(responseCode = "200", description = "메시지 전송 성공"),
                    @ApiResponse(responseCode = "400", description = "잘못된 요청")
            }
    )
//    @MessageMapping("/chat.send")
//    @Transactional
//    public void sendMessage(ChatMessage chatMessage, Principal principal) {
//        // 현재 WebSocket 세션의 사용자 이름
//        String sender = principal.getName();
//
//        String receiver = chatMessage.getReceiver();
//
//        System.out.println("Sender: " + sender);
//        System.out.println("Receiver: " + receiver);
//        chatMessageService.saveMessage(sender, receiver, chatMessage.getContent());
//        // 메시지를 개인 큐로 전송
//        messagingTemplate.convertAndSendToUser(
//                receiver, "/queue/messages", chatMessage
//        );
//    }
//    @MessageMapping("/chat.send")
//    @Transactional
//    public void sendMessage(ChatMessage chatMessage, Principal principal) {
//        // 현재 WebSocket 세션의 사용자 이름
//        String sender = principal.getName();
//        User user = userService.getUserByUserNickname(chatMessage.getReceiver());
//        String receiver = user.getUsername();
//
//        System.out.println("Sender: " + sender);
//        System.out.println("Receiver: " + receiver);
//        chatMessageService.saveMessage(sender, receiver, chatMessage.getContent());
//        // 메시지를 개인 큐로 전송
//        messagingTemplate.convertAndSendToUser(
//                receiver, "/queue/messages", chatMessage
//        );
//    }
    @MessageMapping("/chat.send")
    @Transactional
    @Tag(name = "친구 관리", description = "친구 관리 API")
    public void sendMessage(ChatMessage chatMessage, Principal principal) {
        String sender = chatMessage.getSender();
        System.out.println("Sender: " + sender);
        User users = userService.getUserByUserName(sender);
        User user = userService.getUserByUserNickname(chatMessage.getReceiver());
        String receiver = user.getUsername();
//        String receiver = chatMessage.getReceiver();

        System.out.println("Sender: " + sender + ", Receiver: " + receiver);
        System.out.println("Sender : " + chatMessage.getSender() + ", Receiver: " + chatMessage.getReceiver());

//        chatMessageService.saveMessage(chatMessage.getSender(), chatMessage.getReceiver(), chatMessage.getContent());
//        Long unreadCount = chatMessageService.getUnreadCount(chatMessage.getSender(), chatMessage.getReceiver());

        chatMessageService.saveMessage(users.getNickname(), chatMessage.getReceiver(), chatMessage.getContent());
        Long unreadCount = chatMessageService.getUnreadCount(users.getNickname(), chatMessage.getReceiver());
        System.out.println("Unread count: " + unreadCount);

        if (unreadCount > 0) {
            messagingTemplate.convertAndSendToUser(
                    receiver,
                    "/queue/notifications",
                    "새로운 메시지가 있습니다 (" + unreadCount + "개)"
            );
        }
        System.out.println("ㅎㅇ");
        messagingTemplate.convertAndSend(
                "/topic/messages/" + receiver,
                chatMessage
        );
    }
}