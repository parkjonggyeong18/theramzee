// src/gameHandlers.js
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

          setGameState((prev) => ({
            ...prev,
            isStarted: true,
            timerRunning: true,
            role: initializedData.users[userKey].evilSquirrel,
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

  const handleEmergencyResponse = useCallback((response) => {
    console.log("Emergency Response:", response);
  }, []);

  const handleMoveResponse = useCallback((response) => {
    console.log("Move Response:", response);
  }, []);

  const handleSaveAcornsResponse = useCallback((response) => {
    console.log("Save Acorns Response:", response);
  }, []);

  const handleChargeFatigueResponse = useCallback((response) => {
    console.log("Charge Fatigue Response:", response);
  }, []);

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
