import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';

export const useGameHandlers = (roomId, gameState, setGameState) => {

  const nickName = sessionStorage.getItem('nickName');
  const navigate = useNavigate();

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
          const userKey = `ROOM:${roomId}:USER:${nickName}`;
          console.log("게임 초기화 성공:", initializedData.users[userKey]);

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
    [roomId, setGameState, nickName]
  );

  // 비상 상황 응답 처리
  const handleEmergencyResponse = useCallback(
    (message) => {
      try {
        navigate(`/game/${gameState.roomId}/main`);
        if (message.success) {
          const initializedData = message.data.userTokens;
          console.log("긴급 요청 성공:", initializedData);

          setGameState((prev) => ({
            ...prev,
            forestToken: initializedData[nickName],
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
    [nickName, setGameState]
  );

  // 숲 이동 응답 처리
  const handleMoveResponse = useCallback(
    (message) => {
      try {
        console.log(nickName);
        if (message.success && message.data['nickname'] === nickName) {
          const initializedData = message.data;
          console.log("숲 이동 성공:", initializedData);

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
    [setGameState, nickName]
  );

  // 도토리 저장 응답 처리
  const handleSaveAcornsResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("도토리 저장 성공:", initializedData);
          
          // 도토리가 3개 이상이면 게임 종료
          if (initializedData.newTotalAcorns >= 1) {
            navigate(`/game/${roomId}/main`);
            setGameState((prev) => ({
              ...prev,
              totalAcorns: initializedData.newTotalAcorns,
              heldAcorns: 0,
              isGameOver: true,
              gameOverReason: 'acorns',
              winner: prev.evilSquirrel ? 'bad' : 'good',
              timerRunning: false,
              isStarted: false
            }));setTimeout(() => {
              setGameState(prev => ({
                ...prev,
                currentScreen: 'gameOver'
              }));
            }, 500);
          } else {
            // 게임 진행 중
            setGameState((prev) => ({
              ...prev,
              totalAcorns: initializedData.newTotalAcorns,
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
    [setGameState, nickName, navigate, roomId]
  );

  // 피로도 충전 응답 처리
  const handleChargeFatigueResponse = useCallback(
    (message) => {
      try {
        if (message.success && message.data['nickname'] === nickName) {
          const initializedData = message.data;
          console.log("피로도 충전 성공:", initializedData);

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
    [setGameState, nickName]
);

  // 킬 응답 처리
  const handleKillResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("킬 성공:", initializedData);
          setGameState((prev) => ({
            ...prev,
            killedPlayers: [...prev.killedPlayers, initializedData['victimNickname']]
          }));
          if (message.data['killerNickname'] === nickName) {
            setGameState((prev) => ({
              ...prev,
              fatigue: initializedData['killerFatigue'],
            }));
          } else if (message.data['victimNickname'] === nickName) {
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
    [setGameState, nickName]
  );

  // 미션 완료 응답 처리
  const handleCompleteMissionResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("미션 완료 성공:", initializedData);
          const missionKey = `${initializedData['forestNum']}_${initializedData['missionNum']}`;
          setGameState((prev) => ({
            ...prev,
            missionKey: [true, prev[missionKey][1]],
          }));
          if (message.data['nickname'] === nickName) {
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
    [setGameState, nickName]
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
