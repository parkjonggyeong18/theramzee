import { useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';

export const useGameHandlers = (roomId, setGameState, joinSession) => {
  const { gameState } = useGame();
  
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
          console.log("게임 초기화 성공:", initializedData);

          setGameState((prev) => ({
            ...prev,
            isStarted: true,
            timerRunning: true,
            evilSquirrel: initializedData.users[userKey].evilSquirrel,
            forestToken: initializedData.users[userKey].forestToken,
            forestUsers: initializedData.forestUsers,
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
    async (message) => {
      try {
        navigate(`/game/${gameState.roomId}/main`);
        if (message.success) {
          const initializedData = message.data.userTokens;
          console.log("긴급 요청 성공:", initializedData);

          // await joinSession(initializedData[nickName], nickName);

          setGameState((prev) => ({
            ...prev,
            forestToken: initializedData[nickName],
            foresetNum: initializedData.forestNum,
            forestUsers: initializedData.forestUsers,
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
    async (message) => {
      try {

        
        if (message.success) {
          const initializedData = message.data;
          console.log("숲 이동 성공:", initializedData);

          // await joinSession(initializedData['forestToken'], nickName)

          setGameState((prev) => ({
            ...prev,
            forestUsers: initializedData.forestUsers,
          }));
          console.log("숲 이동 성공:", initializedData.forestNum);
          if (message.data['nickname'] === nickName) {
            console.log("숲 이동 성공:", initializedData.forestNum);
            setGameState((prev) => ({
              ...prev,
              forestToken: initializedData.forestToken,
              forestNum: initializedData.forestNum,
            }));
          }
          // console.log("숲 이동 성공:", forestUsers);
        } else {
          console.error("Game initialization failed:", message.errorCode);
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    []
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
              winner: 'good',
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
          console.log("rhkjdfkjlkajs;ldkfj;lksadjf", gameState.forestUsers);
          console.log("안되나??")
          console.log("aaaaaaaa", gameState.fatigue);
          console.log('bbbbbbbb', gameState);
          console.log('CCCCCCCC', gameState.heldAcorns);
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
          
          setGameState((prev) => {
            const newKilledPlayers = [...prev.killedPlayers, initializedData['victimNickname']];
            
            // 기본 업데이트 객체
            const updates = {
              ...prev,
              killedPlayers: newKilledPlayers
            };
  
            // 킬러/희생자 관련 업데이트
            if (message.data['killerNickname'] === nickName) {
              updates.fatigue = initializedData['killerFatigue'];
            } else if (message.data['victimNickname'] === nickName) {
              updates.isDead = true;
              updates.isSpectating = true;
            }
  
            // 나쁜 다람쥐 승리 조건 체크 (4명 사망)
            if (newKilledPlayers.length >= 4) {
              navigate(`/game/${roomId}/main`);
              updates.isGameOver = true;
              updates.gameOverReason = 'kill';
              updates.winner = 'bad';
              updates.timerRunning = false;
              updates.isStarted = false;
            }
  
            return updates;
          });
        }
      } catch (error) {
        console.error("Error parsing game start response:", error);
      }
    },
    [setGameState, nickName, navigate, roomId]
  );

  // 미션 완료 응답 처리
  const handleCompleteMissionResponse = useCallback(
    (message) => {
      try {
        if (message.success) {
          const initializedData = message.data;
          console.log("미션 완료 성공:", initializedData);
          
          // initializedData에서 미션 정보 추출
          const forestNum = initializedData.forestNum;
          const missionNum = initializedData.missionNum;
          const missionKey = `${forestNum}_${missionNum}`;

          // 모든 플레이어가 미션 완료 상태 업데이트
          setGameState(prev => ({
            ...prev,
            [missionKey]: [true, prev[missionKey][1]],
          }));

          // 미션을 완료한 플레이어인 경우에만 추가 상태 업데이트
          if (initializedData.nickname === nickName) {
            setGameState(prev => ({
              ...prev,
              fatigue: Math.max(prev.fatigue - 1, 0),
              heldAcorns: initializedData.userAcorns
            }));
          }

          console.log(`Mission ${missionKey} completed by ${initializedData.nickname}`);
        } else {
          console.error("미션 완료 실패:", message.errorCode);
        }
      } catch (error) {
        console.error("미션 완료 응답 처리 중 에러:", error);
      }
    },
    [nickName, setGameState]
  );

  const handleOutResponse = useCallback(
    (message) => {
      try {
        if (message.status) {
          const initializedData = message.data;
          console.log("퇴장 성공:", initializedData);
          navigate("/rooms");
        } else {
          console.error("퇴장 실패:", message.errorCode);
        }
      } catch (error) {
        console.error("퇴장 응답 처리 중 에러:", error);
      }
    },
    [setGameState]
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
    handleOutResponse,
  };
};
