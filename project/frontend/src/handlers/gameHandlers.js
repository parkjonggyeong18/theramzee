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
    [roomId, gameState.userNum, setGameState]
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
    [gameState.nickName, setGameState]
  );

  // 숲 이동 응답 처리
  const handleMoveResponse = useCallback(
    (message) => {
      try {
        if (message.success && message.data['nickname'] === gameState.nickName) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);

          setGameState((prev) => ({
            ...prev,
            forestToken: initializedData.forestToken,
          }));
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [gameState.nickName, setGameState]
  );

  // 도토리 저장 응답 처리
  const handleSaveAcornsResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);
          setGameState((prev) => ({
            ...prev,
            totalAcorns: initializedData.newTotalAcorns,
          }));
          if (message.data['nickname'] === gameState.nickName) {
            setGameState((prev) => ({
              ...prev,
              heldAcorns: 0,
            }));
          } 
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [gameState.nickName, setGameState]
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
    [gameState.nickName, setGameState]
);

  // 킬 응답 처리
  const handleKillResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);
          setGameState((prev) => ({
            ...prev,
            killedPlayers: [...prev.killedPlayers, initializedData['victimNickname']]
          }));
          if (message.data['killerNickname'] === gameState.nickName) {
            setGameState((prev) => ({
              ...prev,
              fatigue: initializedData['killerFatigue'],
            }));
          } else if (message.data['victimNickname'] === gameState.nickName) {
            setGameState((prev) => ({
              ...prev,
              isDead: true,
              isSpectating: true,
            }));
          }
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [gameState.nickName, setGameState]
  );

  const handleCompleteMissionResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("Game initialized successfully:", initializedData);
          const missionKey = `${initializedData['forestNum']}_${initializedData['missionNum']}`;
          setGameState((prev) => ({
            ...prev,
            missionKey: [true, prev[missionKey][1]],
          }));
          if (message.data['nickname'] === gameState.nickName) {
            setGameState((prev) => ({
              ...prev,
              fatigue: prev.fatigue - 1,
              heldAcorns: initializedData['userAcorns'],
            }));
          } 
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [gameState.nickName, setGameState]
  );

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
