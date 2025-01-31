package com.gradation.backend.chat.controller;

import com.gradation.backend.chat.service.ChatMessageService;
import com.gradation.backend.common.model.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 1:1 채팅 알림 관리를 위한 컨트롤러 클래스.
 *
 * 이 컨트롤러는 1:1 채팅 메시지의 읽지 않은 메시지 개수 조회, 메시지 읽음 처리,
 * 채팅 기록 조회 등의 API를 제공합니다.
 */
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
@Tag(name = "1:1 채팅 알림 관리", description = "1:1 채팅 메시지 알림 관리 API")
public class ChatNotificationController {

    private final ChatMessageService chatMessageService;

    /**
     * 읽지 않은 메시지 개수를 조회합니다.
     *
     * @param sender   메시지 송신자의 ID 또는 닉네임
     * @param receiver 메시지 수신자의 ID 또는 닉네임
     * @return 읽지 않은 메시지의 개수
     */
    @Operation(summary = "읽지 않은 메시지 수 조회",
            description = "특정 사용자 간의 읽지 않은 메시지의 개수를 반환합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "읽지 않은 메시지 수 조회 성공"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터가 잘못되었음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/unread-count")
    public ResponseEntity<BaseResponse<Long>> getUnreadCount(@RequestParam String sender, @RequestParam String receiver) {
        Long unreadCount = chatMessageService.getUnreadCount(sender, receiver);
        return ResponseEntity.ok(BaseResponse.success("읽지 않은 메시지의 수입니다.", unreadCount));
    }

    /**
     * 메시지를 읽음 상태로 업데이트합니다.
     *
     * @param sender   메시지 송신자의 ID 또는 닉네임
     * @param receiver 메시지 수신자의 ID 또는 닉네임
     * @return HTTP 상태 코드 204(No Content) - 성공적으로 처리됨을 나타냅니다.
     */
    @Operation(summary = "메시지를 읽음 처리",
            description = "특정 사용자와의 대화에서 읽지 않은 메시지를 읽음 상태로 만듭니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "읽음 처리 성공 (내용 없음)"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터가 잘못되었음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PutMapping("/mark-as-read")
    public ResponseEntity<Void> markAsRead(@RequestParam String sender, @RequestParam String receiver) {
        chatMessageService.markMessagesAsRead(sender, receiver);
        return ResponseEntity.noContent().build();
    }

    /**
     * 특정 사용자 간의 채팅 기록을 조회합니다.
     *
     * @param sender   메시지 송신자의 ID 또는 닉네임
     * @param receiver 메시지 수신자의 ID 또는 닉네임
     * @return 송신자와 수신자 간의 채팅 기록 (메시지 리스트)
     */
    @Operation(summary = "채팅 기록 조회",
            description = "특정 사용자 간의 채팅 기록을 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "채팅 기록 조회 성공"),
            @ApiResponse(responseCode = "400", description = "요청 파라미터가 잘못되었음"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/history")
    public ResponseEntity<List<String>> getChatHistory(@RequestParam String sender, @RequestParam String receiver) {
        List<String> chatHistory = chatMessageService.getMessages(sender, receiver);
        return ResponseEntity.ok(chatHistory);
    }
}
