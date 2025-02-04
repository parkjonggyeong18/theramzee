package com.gradation.backend.game.controller;

import com.gradation.backend.game.model.request.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.common.model.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 게임 관련 WebSocket 컨트롤러
 * 클라이언트와 서버 간의 실시간 통신을 처리합니다.
 */
@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    // 세션 정보를 저장할 Map 선언
    private final Map<String, Integer> sessions = new ConcurrentHashMap<>();

    /**
     * 게임 정보 요청 처리
     * 클라이언트가 특정 방의 정보를 요청할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/info")
    @SendToUser("/queue/game/{roomId}/info")
    public BaseResponse<Map<String, Object>> handleGameInfo(@Payload GameInfoRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Map<String, Object> roomInfoData = gameService.getRoomInformation(request.getRoomId());
        return BaseResponse.success("방 정보 조회 성공", roomInfoData);
    }

    /**
     * 게임 시작 요청 처리
     * 클라이언트가 게임 시작을 요청할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/start")
    @SendTo("/topic/game/{roomId}/start")
    public BaseResponse<Map<String, Object>> handleGameStart(@Payload GameStartRequest request) {
        Map<String, Object> initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());
        return BaseResponse.success("게임 시작 성공", initializedData);
    }

    /**
     * 긴급 상황 처리
     * 게임 내 긴급 상황 발생 시 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/emergency")
    @SendTo("/topic/game/{roomId}/emergency")
    public BaseResponse<Boolean> handleGameEmergency(@Payload GameEmergencyRequest request) {
        boolean result = gameService.emergency(request.getRoomId());
        return BaseResponse.success("긴급 상황 처리", result);
    }

    /**
     * 사용자 이동 처리
     * 게임 내에서 사용자가 이동할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/move")
    @SendTo("/topic/game/{roomId}/move")
    public BaseResponse<Integer> handleGameMove(@Payload GameMoveRequest request) {
        Integer result = gameService.moveForest(request.getRoomId(), request.getUserNum(), request.getNewForest());
        return BaseResponse.success("사용자 이동", result);
    }

    /**
     * 사용자 도토리 조회
     * 특정 사용자의 도토리 수를 조회합니다.
     */
    @MessageMapping("/game/{roomId}/acorns")
    @SendToUser("/queue/game/{roomId}/acorns")
    public BaseResponse<Integer> handleGetUserAcorns(@Payload getUserAcornsRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 조회 성공", acorns);
    }

    /**
     * 도토리 저장 처리
     * 사용자가 도토리를 저장할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/save-acorns")
    @SendTo("/topic/game/{roomId}/save-acorns")
    public BaseResponse<Integer> handleSaveAcorns(@Payload saveAcornsRequest request) {
        int result = gameService.saveUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 저장 성공", result);
    }

    /**
     * 사용자 피로도 조회
     * 특정 사용자의 피로도를 조회합니다.
     */
    @MessageMapping("/game/{roomId}/fatigue")
    @SendToUser("/queue/game/{roomId}/fatigue")
    public BaseResponse<Integer> handleGetUserFatigue(@Payload getUserFatigueRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 조회 성공", fatigue);
    }

    /**
     * 피로도 충전 처리
     * 사용자의 피로도를 충전할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/charge-fatigue")
    @SendTo("/topic/game/{roomId}/charge-fatigue")
    public BaseResponse<Integer> handleChargeFatigue(@Payload chargeFatigueRequest request) {
        int result = gameService.incrementUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 충전 성공", result);
    }

    /**
     * 사용자 제거 처리
     * 게임에서 사용자를 제거할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/kill")
    @SendTo("/topic/game/{roomId}/kill")
    public BaseResponse<Boolean> handleKill(@Payload killRequest request) {
        boolean result = gameService.Kill(request.getRoomId(), request.getUserNum(), request.getMyNum());
        return BaseResponse.success("사용자 제거", result);
    }

    /**
     * 미션 정보 조회
     * 특정 숲의 미션 상태를 조회합니다.
     */
    @MessageMapping("/game/{roomId}/mission")
    @SendToUser("/queue/game/{roomId}/mission")
    public BaseResponse<Map<String, Map<String, Object>>> handleGetMission(@Payload getMissionRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Map<String, Object>> missionData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
        return BaseResponse.success("미션 조회 성공", missionData);
    }

    /**
     * 미션 완료 처리
     * 사용자가 미션을 완료했을 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/complete-mission")
    @SendTo("/topic/game/{roomId}/complete-mission")
    public BaseResponse<Boolean> handleCompleteMission(@Payload completeMissionRequest request) {
        boolean result = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getUserNum());
        return BaseResponse.success("미션 완료", result);
    }
}
