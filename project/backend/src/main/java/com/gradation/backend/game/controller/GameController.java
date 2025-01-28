package com.gradation.backend.game.controller;

import com.gradation.backend.common.model.response.BaseResponse;
//import com.gradation.backend.common.service.RedisService;
import com.gradation.backend.game.model.request;
import com.gradation.backend.game.service.GameService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Request;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/room")
@Tag(name = "게임 API", description = "게임 관련 API")
public class GameController {
    private final GameService gameService;

    @PostMapping("/game-info")
    @Operation(summary = "방 정보 조회", description = "테스트용 조회")
    public ResponseEntity<BaseResponse<Map<String, Object>>> gameInfo(@RequestBody request.GameInfoRequest request) {
        Map<String, Object> roomInfoData = gameService.getRoomInformation(request.getRoomId());
        return ResponseEntity.ok(BaseResponse.success("방 정보 조회 성공", roomInfoData));
    }

    @PostMapping("/game-start")
    @Operation(summary = "방 초기화", description = "게임 초기 세팅")
    public ResponseEntity<BaseResponse<Map<String, Object>>> gameStart(@RequestBody request.GameStartRequest request) {
        Map<String, Object> initializedData = gameService.initializeRoomStructure(request.getRoomId(), request.getNicknames());
        return ResponseEntity.ok(BaseResponse.success("방 초기화 성공", initializedData));
    }

    @PostMapping("/game-emergency")
    @Operation(summary = "긴급 소집", description = "모든 유저 숲1로 이동 & 긴급 불가능으로 변경")
    public ResponseEntity<BaseResponse<Boolean>> emergency(@RequestBody request.GameEmergencyRequest request) {
        boolean emergencyPossible = gameService.emergency(request.getRoomId());
        return ResponseEntity.ok(BaseResponse.success("긴급 소집 성공", emergencyPossible));
    }

    @PostMapping("/game-move")
    @Operation(summary = "숲 이동", description = "특정 숲으로 이동")
    public ResponseEntity<BaseResponse<Integer>> move(@RequestBody request.GameMoveRequest request) {
        int userLocation = gameService.moveForest(request.getRoomId(), request.getUserNum(), request.getNewForest());
        return ResponseEntity.ok(BaseResponse.success("숲 이동 성공", userLocation));
    }

    @PostMapping("/game-get/user-acorns")
    @Operation(summary = "유저 도토리 조회", description = "특정 유저의 도토리 개수 조회")
    public ResponseEntity<BaseResponse<Integer>> userAcorns(@RequestBody request.getUserAcornsRequest request) {
        int acorns = gameService.getUserAcorns(request.getRoomId(), request.getUserNum());
        return ResponseEntity.ok(BaseResponse.success("유저 도토리 조회 성공", acorns));
    }

    @PostMapping("/game-save")
    @Operation(summary = "도토리 저장", description = "공용 저장소에 도토리 저장 & 유저의 도토리 0으로 초기화")
    public ResponseEntity<BaseResponse<Integer>> save(@RequestBody request.saveAcornsRequest request) {
        int totalAcorns = gameService.saveUserAcorns(request.getRoomId(), request.getUserNum());
        return ResponseEntity.ok(BaseResponse.success("도토리 저장 성공", totalAcorns));
    }

    @PostMapping("/game-get/user-fatigue")
    @Operation(summary = "유저 피로도 조회", description = "특정 유저의 피로도 조회")
    public ResponseEntity<BaseResponse<Integer>> userFatigue(@RequestBody request.getUserFatigueRequest request) {
        int fatigue = gameService.getUserFatigue(request.getRoomId(), request.getUserNum());
        return ResponseEntity.ok(BaseResponse.success("유저 피로도 조회 성공", fatigue));
    }

    @PostMapping("/game-charge")
    @Operation(summary = "피로도 충전", description = "특정 유저의 피로도 1 충전")
    public ResponseEntity<BaseResponse<Integer>> charge(@RequestBody request.chargeFatigueRequest request) {
        int newFatigue = gameService.incrementUserFatigue(request.getRoomId(), request.getUserNum());
        return ResponseEntity.ok(BaseResponse.success("피로도 충전 성공", newFatigue));
    }

    @PostMapping("/game-kill")
    @Operation(summary = "킬", description = "플레이어 사망 처리 & 나의 피로도 0으로 초기화")
    public ResponseEntity<BaseResponse<Boolean>> kill(@RequestBody request.killRequest request) {
        boolean userAlive = gameService.Kill(request.getRoomId(), request.getUserNum(), request.getMyNum());
        return ResponseEntity.ok(BaseResponse.success("유저 킬 성공", userAlive));
    }

    @PostMapping("/game-get/mission-status")
    @Operation(summary = "미션 조회", description = "미션의 완료상태와 보상 조회")
    public ResponseEntity<BaseResponse<Map<String, Map<String, Object>>>> missionStatus(@RequestBody request.getMissionRequest request) {
        Map<String, Map<String, Object>> missionStatusData = gameService.getForestMissionStatus(request.getRoomId(), request.getForestNum());
        return ResponseEntity.ok(BaseResponse.success("미션 조회 성공", missionStatusData));
    }

    @PostMapping("/game-mission")
    @Operation(summary = "미션 수행", description = "미션 상태 업데이트 & 보상 획득 & 피로도 1차감")
    public ResponseEntity<BaseResponse<Boolean>> mission(@RequestBody request.completeMissionRequest request) {
        boolean missionCompleted = gameService.completeMission(request.getRoomId(), request.getForestNum(), request.getMissionNum(), request.getUserNum());
        return ResponseEntity.ok(BaseResponse.success("미션 수행 성공", missionCompleted));
    }
}