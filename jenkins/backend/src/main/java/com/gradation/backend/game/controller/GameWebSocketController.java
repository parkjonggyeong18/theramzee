package com.gradation.backend.game.controller;

import com.gradation.backend.game.model.request.*;
import com.gradation.backend.game.model.response.*;
import com.gradation.backend.game.service.GameService;
import com.gradation.backend.common.model.response.BaseResponse;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * 게임 관련 WebSocket 컨트롤러
 * 클라이언트와 서버 간의 실시간 통신을 처리합니다.
 */
@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final GameService gameService;

    /**
     * 게임 정보 요청 처리
     * 클라이언트가 특정 방의 정보를 요청할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/info")
    @SendToUser("/queue/game/{roomId}/info")
    public BaseResponse<RoomInfoResponse> handleGameInfo(@Payload GameInfoRequest request, SimpMessageHeaderAccessor headerAccessor) {
        RoomInfoResponse roomInfoData = gameService.getRoomInformation(request.getRoomId());
        return BaseResponse.success("방 정보 조회 성공", roomInfoData);
    }

    /**
     * 게임 시작 요청 처리
     * 클라이언트가 게임 시작을 요청할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/start")
    @SendTo("/topic/game/{roomId}/start")
    public BaseResponse<RoomInitializationResponse> handleGameStart(@Payload GameStartRequest request)
            throws OpenViduJavaClientException, OpenViduHttpException {
        RoomInitializationResponse initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());
        return BaseResponse.success("게임 시작 성공", initializedData);
    }

    /**
     * 긴급 상황 처리
     * 게임 내 긴급 상황 발생 시 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/emergency")
    @SendTo("/topic/game/{roomId}/emergency")
    public BaseResponse<EmergencyResponse> handleGameEmergency(@Payload GameEmergencyRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        EmergencyResponse userTokens = gameService.emergency(request.getRoomId(), request.getNicknames());
        return BaseResponse.success("긴급 상황 처리", userTokens);
    }

    /**
     * 사용자 이동 처리
     * 게임 내에서 사용자가 이동할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/move")
    @SendTo("/topic/game/{roomId}/move")
    public BaseResponse<MoveForestResponse> handleGameMove(@Payload GameMoveRequest request) throws OpenViduJavaClientException, OpenViduHttpException {
        System.out.println("여기까지3");
        System.out.println("request.getNickname() = " + request.getNickname());
        System.out.println("request.getRoomId() = " + request.getRoomId());
        System.out.println("request.getNewForest() = " + request.getNewForest());
        System.out.println("request.getNicknames() = " + request.getNicknames());
        MoveForestResponse token = gameService.moveForest(request.getRoomId(), request.getNickname(), request.getNewForest(), request.getNicknames());
        return BaseResponse.success("사용자 이동", token);
    }

//    /**
//     * 사용자 도토리 조회
//     * 특정 사용자의 도토리 수를 조회합니다.
//     */
//    @MessageMapping("/game/{roomId}/acorns")
//    @SendToUser("/queue/game/{roomId}/acorns")
//    public BaseResponse<Integer> handleGetUserAcorns(@Payload getUserAcornsRequest request, SimpMessageHeaderAccessor headerAccessor) {
//        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
//        return BaseResponse.success("도토리 조회 성공", acorns);
//    }

    /**
     * 도토리 저장 처리
     * 사용자가 도토리를 저장할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/save-acorns")
    @SendTo("/topic/game/{roomId}/save-acorns")
    public BaseResponse<SaveUserAcornsResponse> handleSaveAcorns(@Payload saveAcornsRequest request) {
        SaveUserAcornsResponse result = gameService.saveUserAcorns(request.getRoomId(), request.getNickname());
        return BaseResponse.success("도토리 저장 성공", result);
    }

//    /**
//     * 사용자 피로도 조회
//     * 특정 사용자의 피로도를 조회합니다.
//     */
//    @MessageMapping("/game/{roomId}/fatigue")
//    @SendToUser("/queue/game/{roomId}/fatigue")
//    public BaseResponse<Integer> handleGetUserFatigue(@Payload getUserFatigueRequest request, SimpMessageHeaderAccessor headerAccessor) {
//        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
//        return BaseResponse.success("피로도 조회 성공", fatigue);
//    }

    /**
     * 피로도 충전 처리
     * 사용자의 피로도를 충전할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/charge-fatigue")
    @SendToUser("/queue/game/{roomId}/charge-fatigue")
    public BaseResponse<IncrementUserFatigueResponse> handleChargeFatigue(@Payload chargeFatigueRequest request) {
        IncrementUserFatigueResponse result = gameService.incrementUserFatigue(request.getRoomId(), request.getNickname());
        return BaseResponse.success("피로도 충전 성공", result);
    }

    /**
     * 사용자 제거 처리
     * 게임에서 사용자를 제거할 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/kill")
    @SendTo("/topic/game/{roomId}/kill")
    public BaseResponse<KillResponse> handleKill(@Payload killRequest request) {
        KillResponse result = gameService.Kill(request.getRoomId(), request.getVictimNickname(), request.getKillerNickname());
        return BaseResponse.success("사용자 제거", result);
    }

//    /**
//     * 미션 정보 조회
//     * 특정 숲의 미션 상태를 조회합니다.
//     */
//    @MessageMapping("/game/{roomId}/mission")
//    @SendToUser("/queue/game/{roomId}/mission")
//    public BaseResponse<Map<String, Map<String, Object>>> handleGetMission(@Payload getMissionRequest request, SimpMessageHeaderAccessor headerAccessor) {
//        Map<String, Map<String, Object>> missionData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
//        return BaseResponse.success("미션 조회 성공", missionData);
//    }

    /**
     * 미션 완료 처리
     * 사용자가 미션을 완료했을 때 호출됩니다.
     */
    @MessageMapping("/game/{roomId}/complete-mission")
    @SendTo("/topic/game/{roomId}/complete-mission")
    public BaseResponse<CompleteMissionResponse> handleCompleteMission(@Payload completeMissionRequest request) {
        CompleteMissionResponse result = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getNickname());
        return BaseResponse.success("미션 완료", result);
    }
}

//    public forestUserResponse getForestUserMap()
