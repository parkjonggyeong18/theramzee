package com.gradation.backend.game.controller;

import com.gradation.backend.game.model.request.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.common.model.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    // 세션 정보를 저장할 Map 선언
    private final Map<String, Integer> sessions = new ConcurrentHashMap<>();

    @MessageMapping("/game/{roomId}/info")
    @SendToUser("/queue/game/{roomId}/info")
    public BaseResponse<Map<String, Object>> handleGameInfo(@Payload GameInfoRequest request, SimpMessageHeaderAccessor headerAccessor) {
        System.out.println("성공!@!@!@!@!!!@!@");
        Map<String, Object> roomInfoData = gameService.getRoomInformation(request.getRoomId());
        return BaseResponse.success("방 정보 조회 성공", roomInfoData);
    }

    @MessageMapping("/game/{roomId}/start/")
    @SendTo("/topic/game/{roomId}/start")
    public BaseResponse<Map<String, Object>> handleGameStart(@Payload GameStartRequest request) {
        Map<String, Object> initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());
        return BaseResponse.success("게임 시작 성공", initializedData);
    }

    @MessageMapping("/game/{roomId}/emergency")
    @SendTo("/topic/game/{roomId}/emergency")
    public BaseResponse<Boolean> handleGameEmergency(@Payload GameEmergencyRequest request) {
        boolean result = gameService.emergency(request.getRoomId());
        return BaseResponse.success("긴급 상황 처리", result);
    }

    @MessageMapping("/game/{roomId}/move")
    @SendTo("/topic/game/{roomId}/move")
    public BaseResponse<Integer> handleGameMove(@Payload GameMoveRequest request) {
        Integer result = gameService.moveForest(request.getRoomId(), request.getUserNum(), request.getNewForest());
        return BaseResponse.success("사용자 이동", result);
    }

    @MessageMapping("/game/{roomId}/acorns")
    @SendToUser("/queue/game/{roomId}/acorns")
    public BaseResponse<Integer> handleGetUserAcorns(@Payload getUserAcornsRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 조회 성공", acorns);
    }

    @MessageMapping("/game/{roomId}/save-acorns")
    @SendTo("/topic/game/{roomId}/save-acorns")
    public BaseResponse<Integer> handleSaveAcorns(@Payload saveAcornsRequest request) {
        int result = gameService.saveUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 저장 성공", result);
    }

    @MessageMapping("/game/{roomId}/fatigue")
    @SendToUser("/queue/game/{roomId}/fatigue")
    public BaseResponse<Integer> handleGetUserFatigue(@Payload getUserFatigueRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 조회 성공", fatigue);
    }

    @MessageMapping("/game/{roomId}/charge-fatigue")
    @SendTo("/topic/game/{roomId}/charge-fatigue")
    public BaseResponse<Integer> handleChargeFatigue(@Payload chargeFatigueRequest request) {
        int result = gameService.incrementUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 충전 성공", result);
    }

    @MessageMapping("/game/{roomId}/kill")
    @SendTo("/topic/game/{roomId}/kill")
    public BaseResponse<Boolean> handleKill(@Payload killRequest request) {
        boolean result = gameService.Kill(request.getRoomId(), request.getUserNum(), request.getMyNum());
        return BaseResponse.success("사용자 제거", result);
    }

    @MessageMapping("/game/{roomId}/mission")
    @SendToUser("/queue/game/{roomId}/mission")
    public BaseResponse<Map<String, Map<String, Object>>> handleGetMission(@Payload getMissionRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Map<String, Object>> missionData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
        return BaseResponse.success("미션 조회 성공", missionData);
    }

    @MessageMapping("/game/{roomId}/complete-mission")
    @SendTo("/topic/game/{roomId}/complete-mission")
    public BaseResponse<Boolean> handleCompleteMission(@Payload completeMissionRequest request) {
        boolean result = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getUserNum());
        return BaseResponse.success("미션 완료", result);
    }
}
