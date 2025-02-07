//package com.gradation.backend.game.handler;
//
//import com.fasterxml.jackson.core.type.TypeReference;
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.gradation.backend.game.service.GameService;
//import com.gradation.backend.common.model.response.BaseResponse;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//import java.util.List;
//import java.util.Map;
//
//import lombok.RequiredArgsConstructor;
//
//@Component
//@RequiredArgsConstructor
//public class GameWebSocketHandler extends TextWebSocketHandler {
//
//    private final GameService gameService; // GameService 주입
//    private final ObjectMapper objectMapper; // JSON 처리를 위한 ObjectMapper
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        try {
//            // 클라이언트로부터 받은 메시지(JSON 형식)를 파싱
//            String payload = message.getPayload();
//            JsonNode jsonNode = objectMapper.readTree(payload);
//
//            // 요청 타입 확인 (예: "GAME_INFO")
//            String type = jsonNode.get("type").asText();
//
//            // 요청 처리 및 응답 생성
//            switch (type) {
//                // 방 정보 조회
//                case "GAME_INFO":
//                    handleGameInfo(session, jsonNode);
//                    break;
//                // 방 초기화
//                case "GAME_START":
//                    handleGameStart(session, jsonNode);
//                    break;
//                // 긴급 소집
//                case "GAME_EMERGENCY":
//                    handleGameEmergency(session, jsonNode);
//                    break;
//                // 숲 이동
//                case "GAME_MOVE":
//                    handleGameMove(session, jsonNode);
//                    break;
//                // 특정 유저 도토리 조회
//                case "GET_USER_ACORNS":
//                    handleGetUserAcorns(session, jsonNode);
//                    break;
//                // 도토리 저장
//                case "SAVE_ACORNS":
//                    handleSaveAcorns(session, jsonNode);
//                    break;
//                // 특정 유저 피로도 조회
//                case "GET_USER_FATIGUE":
//                    handleGetUserFatigue(session, jsonNode);
//                    break;
//                // 피로도 충전
//                case "CHARGE_FATIGUE":
//                    handleChargeFatigue(session, jsonNode);
//                    break;
//                // 살해
//                case "GAME_KILL":
//                    handleGameKill(session, jsonNode);
//                    break;
//                // 특정 숲 미션 상태 조회
//                case "GET_MISSION_STATUS":
//                    handleGetMissionStatus(session, jsonNode);
//                    break;
//                // 미션 클리어
//                case "COMPLETE_MISSION":
//                    handleCompleteMission(session, jsonNode);
//                    break;
//
//                default:
//                    sendErrorResponse(session, "Unknown request type: " + type);
//                    break;
//            }
//        } catch (Exception e) {
//            sendErrorResponse(session, "Error processing request: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 방 정보 조회 (테스트용)
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGameInfo(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt(); // 요청에서 roomId 추출
//
//            // GameService를 통해 방 정보 조회
//            Map<String, Object> roomInfoData = gameService.getRoomInformation(roomId);
//
//            // 성공 응답 생성 및 전송
//            BaseResponse<Map<String, Object>> response = BaseResponse.success("방 정보 조회 성공", roomInfoData);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to retrieve game info: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 시작하기 클릭 시 방 초기화
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGameStart(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            List<String> nicknames = objectMapper.convertValue(jsonNode.get("nicknames"), new TypeReference<List<String>>() {});
//
//            Map<String, Object> initializedData = gameService.initializeRoomStructure(roomId, nicknames);
//
//            BaseResponse<Map<String, Object>> response = BaseResponse.success("방 초기화 성공", initializedData);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to initialize room: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 긴급을 누를 시 모든 사용자의 forestLocation을 1로 설정
//     * 긴급 상태 불가능으로 변경
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGameEmergency(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//
//            Map<String, String> userTokens = gameService.emergency(roomId);
//
//            BaseResponse<Map<String, String>> response = BaseResponse.success("긴급 소집 성공", userTokens);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to execute emergency: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저가 특정 숲으로 이동
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGameMove(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//            int newForest = jsonNode.get("newForest").asInt();
//
//            String token = gameService.moveForest(roomId, userNum, newForest);
//
//            BaseResponse<String> response = BaseResponse.success("숲 이동 성공", token);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to move forest: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저의 acorns 값을 조회
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGetUserAcorns(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//
//            int acorns = gameService.getUserAcorns(roomId, userNum);
//
//            BaseResponse<Integer> response = BaseResponse.success("유저 도토리 조회 성공", acorns);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to get user acorns: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저의 acorns값을 공용 저장소에 저장
//     * 특정 유저의 acorns값 0으로 초기화
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleSaveAcorns(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//
//            int totalAcorns = gameService.saveUserAcorns(roomId, userNum);
//
//            BaseResponse<Integer> response = BaseResponse.success("도토리 저장 성공", totalAcorns);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to save acorns: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저의 fatigue 값을 조회
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGetUserFatigue(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//
//            int fatigue = gameService.getUserFatigue(roomId, userNum);
//
//            BaseResponse<Integer> response = BaseResponse.success("유저 피로도 조회 성공", fatigue);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to get user fatigue: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저의 fatigue 값을 1충전
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleChargeFatigue(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//
//            int newFatigue = gameService.incrementUserFatigue(roomId, userNum);
//
//            BaseResponse<Integer> response = BaseResponse.success("피로도 충전 성공", newFatigue);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to charge fatigue: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 유저의 alive 상태를 죽음 상태로 변경
//     * 나의 피로도 3 차감
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGameKill(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//            int myNum = jsonNode.get("myNum").asInt();
//
//            boolean userAlive = gameService.Kill(roomId, userNum, myNum);
//
//            BaseResponse<Boolean> response = BaseResponse.success("유저 킬 성공", userAlive);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to process kill: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 forest의 mission1, mission2, mission3 상태와 보상을 조회
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleGetMissionStatus(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int forestNum = jsonNode.get("forestNum").asInt();
//
//            Map<String, Map<String, Object>> missionStatusData = gameService.getForestMissionStatus(roomId, forestNum);
//
//            BaseResponse<Map<String, Map<String, Object>>> response = BaseResponse.success("미션 조회 성공", missionStatusData);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to get mission status: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 특정 forest의 특정 mission 상태를 완료로 변경
//     * 보상을 유저에게 지급
//     * 유저의 피로도 -1
//     *
//     * @param session WebSocket 세션 객체
//     * @param jsonNode 클라이언트로부터 받은 JSON 데이터
//     * @throws Exception 처리 중 발생할 수 있는 예외
//     */
//    private void handleCompleteMission(WebSocketSession session, JsonNode jsonNode) throws Exception {
//        try {
//            int roomId = jsonNode.get("roomId").asInt();
//            int forestNum = jsonNode.get("forestNum").asInt();
//            int missionNum = jsonNode.get("missionNum").asInt();
//            int userNum = jsonNode.get("userNum").asInt();
//
//            boolean missionCompleted = gameService.completeMission(roomId, forestNum, missionNum, userNum);
//
//            BaseResponse<Boolean> response = BaseResponse.success("미션 수행 성공", missionCompleted);
//            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(response)));
//        } catch (Exception e) {
//            sendErrorResponse(session, "Failed to complete mission: " + e.getMessage());
//        }
//    }
//
//    /**
//     * 에러 응답 전송
//     */
//    private void sendErrorResponse(WebSocketSession session, String errorMessage) throws Exception {
//        BaseResponse<Object> errorResponse = BaseResponse.error(errorMessage);
//        session.sendMessage(new TextMessage(objectMapper.writeValueAsString(errorResponse)));
//    }
//}
//
//
