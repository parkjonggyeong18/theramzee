package com.gradation.backend.game.controller;

import com.gradation.backend.game.model.request.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.common.model.response.BaseResponse;
import com.gradation.backend.openvidu.service.OpenViduService;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
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

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;
    private final OpenViduService openViduService;

    @MessageMapping("/game/info")
    @SendToUser("/queue/game/info")
    public BaseResponse<Map<String, Object>> handleGameInfo(@Payload GameInfoRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Object> roomInfoData = gameService.getRoomInformation(request.getRoomId());
        return BaseResponse.success("방 정보 조회 성공", roomInfoData);
    }

    @MessageMapping("/game/start")
    @SendTo("/topic/game/{roomId}/start")
    public BaseResponse<Map<String, Object>> handleGameStart(@Payload GameStartRequest request)
            throws OpenViduJavaClientException, OpenViduHttpException {
        Map<String, Object> initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());

        Integer roomId = request.getRoomId();
        String sessionId_prefix = String.valueOf(roomId);

        //세션 생성
        for (int i=2; i<=7; i++){
            String sessionId_forestId = String.valueOf(i);
            String sessionId = sessionId_prefix + " - " + sessionId_forestId;

            openViduService.createSession(sessionId);
            System.out.println("created sessionId = " + sessionId);
        }

        return BaseResponse.success("게임 시작 성공", initializedData);
    }

    @MessageMapping("/game/emergency")
    @SendTo("/topic/game/{roomId}/emergency")
    public BaseResponse<Boolean> handleGameEmergency(@Payload GameEmergencyRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        boolean result = gameService.emergency(request.getRoomId());
        return BaseResponse.success("긴급 상황 처리", result);
    }

    @MessageMapping("/game/move")
    @SendTo("/topic/game/{roomId}/move")
    public BaseResponse<String> handleGameMove(@Payload GameMoveRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        String token = gameService.moveForest(request.getRoomId(), request.getUserNum(), request.getNewForest());
        return BaseResponse.success("사용자 이동", token);
    }

    @MessageMapping("/game/acorns")
    @SendToUser("/queue/game/acorns")
    public BaseResponse<Integer> handleGetUserAcorns(@Payload getUserAcornsRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 조회 성공", acorns);
    }

    @MessageMapping("/game/save-acorns")
    @SendTo("/topic/game/{roomId}/save-acorns")
    public BaseResponse<Integer> handleSaveAcorns(@Payload saveAcornsRequest request) {
        int result = gameService.saveUserAcorns(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("도토리 저장 성공", result);
    }

    @MessageMapping("/game/fatigue")
    @SendToUser("/queue/game/fatigue")
    public BaseResponse<Integer> handleGetUserFatigue(@Payload getUserFatigueRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 조회 성공", fatigue);
    }

    @MessageMapping("/game/charge-fatigue")
    @SendTo("/topic/game/{roomId}/charge-fatigue")
    public BaseResponse<Integer> handleChargeFatigue(@Payload chargeFatigueRequest request) {
        int result = gameService.incrementUserFatigue(request.getRoomId(), request.getUserNum());
        return BaseResponse.success("피로도 충전 성공", result);
    }

    @MessageMapping("/game/kill")
    @SendTo("/topic/game/{roomId}/kill")
    public BaseResponse<Boolean> handleKill(@Payload killRequest request) {
        boolean result = gameService.Kill(request.getRoomId(), request.getUserNum(), request.getMyNum());
        return BaseResponse.success("사용자 제거", result);
    }

    @MessageMapping("/game/mission")
    @SendToUser("/queue/game/mission")
    public BaseResponse<Map<String, Map<String, Object>>> handleGetMission(@Payload getMissionRequest request, SimpMessageHeaderAccessor headerAccessor) {
        Principal principal = headerAccessor.getUser();
        String userId = principal.getName();

        Map<String, Map<String, Object>> missionData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
        return BaseResponse.success("미션 조회 성공", missionData);
    }

    @MessageMapping("/game/complete-mission")
    @SendTo("/topic/game/{roomId}/complete-mission")
    public BaseResponse<Boolean> handleCompleteMission(@Payload completeMissionRequest request) {
        boolean result = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getUserNum());
        return BaseResponse.success("미션 완료", result);
    }
}
