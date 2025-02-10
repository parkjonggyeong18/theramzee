import { useCallback } from "react";

export const useGameHandlers = (roomId, gameState, setGameState) => {
  // 게임 정보 응답 처리
  const handleGameInfo = useCallback((response) => {
    console.log("Game Info:", response);
  }, []);

  // 게임 초기화 응답 처리
  const handleGameStartResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          const userKey = `ROOM:${roomId}:USER:${gameState.userNum}`;
          console.log("Game initialized successfully:", initializedData.users[userKey]);
          console.log("dfdffdsa", initializedData.users[userKey].evilSquirrel);

          setGameState((prev) => ({
            ...prev,
            isStarted: true,
            timerRunning: true,
            evilSquirrel: initializedData.users[userKey].evilSquirrel,
            forestToken: initializedData.users[userKey].forestToken,
          }));
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [roomId, gameState.userNum]
  );

  // 비상 상황 응답 처리
  const handleEmergencyResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data.userTokens;
          console.log("Game initialized successfully:", initializedData);

          setGameState((prev) => ({
            ...prev,
            forestToken: initializedData[gameState.nickName],
            timerRunning: false,
            isVoting: true, 
            isEmergencyVote: true,
            hasUsedEmergency: true,
            isPaused: true,
          }));
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [roomId]
  );

  const handleMoveResponse = useCallback((response) => {
    console.log("Move Response:", response);
  }, []);

  // 도토리 저장 응답 처리
  const handleSaveAcornsResponse = useCallback(
    (message) => {
      try {
        if (message.success && message.data['nickname'] === gameState.nickName) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);

          setGameState((prev) => ({
            ...prev,
            totalAcorns: initializedData.newTotalAcorns,
            heldAcorns: initializedData.userAcorns,
          }));
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [roomId, gameState.userNum]
 );

  // 피로도 충전 응답 처리
  const handleChargeFatigueResponse = useCallback(
    (message) => {
      try {
        if (message.success && message.data['nickname'] === gameState.nickName) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);

          setGameState((prev) => ({
            ...prev,
            fatigue: initializedData.userFatigue
          }));
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [roomId, gameState.userNum]
);

  const handleKillResponse = useCallback((response) => {
    console.log("Kill Response:", response);
  }, []);

  const handleCompleteMissionResponse = useCallback((response) => {
    console.log("Complete Mission Response:", response);
  }, []);

  return {
    handleGameInfo,
    handleGameStartResponse,
    handleEmergencyResponse,
    handleMoveResponse,
    handleSaveAcornsResponse,
    handleChargeFatigueResponse,
    handleKillResponse,
    handleCompleteMissionResponse,
  };
};
