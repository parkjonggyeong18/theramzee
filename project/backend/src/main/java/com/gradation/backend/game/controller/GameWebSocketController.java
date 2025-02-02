package com.gradation.backend.game.controller;

import com.gradation.backend.game.model.request.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.common.model.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/game/info")
    public void handleGameInfo(@Payload GameInfoRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Object> roomInfoData = gameService.getRoomInformation(request.getRoomId());
        BaseResponse<Map<String, Object>> response = BaseResponse.success("방 정보 조회 성공", roomInfoData);

        messagingTemplate.convertAndSendToUser(userId, "/queue/game/info", response);
    }

    @MessageMapping("/game/start")
    public void handleGameStart(@Payload GameStartRequest request) {
        Map<String, Object> initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());
        BaseResponse<Map<String, Object>> response = BaseResponse.success("게임 시작 성공", initializedData);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/start", response);
    }

    @MessageMapping("/game/emergency")
    public void handleGameEmergency(@Payload GameEmergencyRequest request) {
        boolean result = gameService.emergency(request.getRoomId());
        BaseResponse<Boolean> response = BaseResponse.success("긴급 상황 처리", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/emergency", response);
    }

    @MessageMapping("/game/move")
    public void handleGameMove(@Payload GameMoveRequest request) {
        Integer result = gameService.moveForest(request.getRoomId(), request.getUserNum(), request.getNewForest());
        BaseResponse<Integer> response = BaseResponse.success("사용자 이동", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/move", response);
    }

    @MessageMapping("/game/acorns")
    public void handleGetUserAcorns(@Payload getUserAcornsRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
        BaseResponse<Integer> response = BaseResponse.success("도토리 조회 성공", acorns);

        messagingTemplate.convertAndSendToUser(userId, "/queue/game/acorns", response);
    }

    @MessageMapping("/game/save-acorns")
    public void handleSaveAcorns(@Payload saveAcornsRequest request) {
        int result = gameService.saveUserAcorns(request.getRoomId(), request.getUserNum());
        BaseResponse<Integer> response = BaseResponse.success("도토리 저장 성공", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/save-acorns", response);
    }

    @MessageMapping("/game/fatigue")
    public void handleGetUserFatigue(@Payload getUserFatigueRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
        BaseResponse<Integer> response = BaseResponse.success("피로도 조회 성공", fatigue);

        messagingTemplate.convertAndSendToUser(userId, "/queue/game/fatigue", response);
    }

    @MessageMapping("/game/charge-fatigue")
    public void handleChargeFatigue(@Payload chargeFatigueRequest request) {
        int result = gameService.incrementUserFatigue(request.getRoomId(), request.getUserNum());
        BaseResponse<Integer> response = BaseResponse.success("피로도 충전 성공", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/charge-fatigue", response);
    }

    @MessageMapping("/game/kill")
    public void handleKill(@Payload killRequest request) {
        boolean result = gameService.Kill(request.getRoomId(), request.getUserNum(), request.getMyNum());
        BaseResponse<Boolean> response = BaseResponse.success("사용자 제거", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/kill", response);
    }

    @MessageMapping("/game/mission")
    public void handleGetMission(@Payload getMissionRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Map<String, Object>> missionData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
        BaseResponse<Map<String, Map<String, Object>>> response = BaseResponse.success("미션 조회 성공", missionData);

        messagingTemplate.convertAndSendToUser(userId, "/queue/game/mission", response);
    }

    @MessageMapping("/game/complete-mission")
    public void handleCompleteMission(@Payload completeMissionRequest request) {
        boolean result = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getUserNum());
        BaseResponse<Boolean> response = BaseResponse.success("미션 완료", result);

        messagingTemplate.convertAndSend("/topic/game/" + request.getRoomId() + "/complete-mission", response);
    }
}
