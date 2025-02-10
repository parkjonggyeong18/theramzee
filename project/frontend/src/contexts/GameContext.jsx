import { createContext, useContext, useState, useCallback } from 'react';
import * as gameService from '../api/gameService';
import { fetchRoomById } from '../api/room';
import { useGameHandlers } from '../handlers/gameHandlers';
import { subscribeToTopic } from '../api/stomp';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // 게임의 전체 상태 관리
  const [gameState, setGameState] = useState({
    // 유저 정보
    userNum: null,
    nickName: null,

    // 게임 진행 상태
    isStarted: false, // 게임 시작 여부
    timer: 420, // 게임 시간 (7분)
    timerRunning: false,    // 타이머 실행 상태
    evilSquirrel: null, // true | false
    forestToken: null,  // 숲 토큰

    // 게임 리소스
    totalAcorns: 0, // 저장된 도토리
    heldAcorns: 0,  // 보유 중인 도토리
    fatigue: 0,     // 피로도 (0-3)

    // 투표 시스템
    isVoting: false,          // 투표 중인지 여부
    isEmergencyVote: false,   // 긴급 투표인지 여부
    hasUsedEmergency: false,  // 긴급 투표 사용 여부
    voteTimer: 180, // 투표 시간 (3분)
    
    // 게임 전체 정지(추후)
    isPaused: false, // 게임 타이머 일시정지 여부

    // 플레이어 상태
    killedPlayers: [], // 죽은 플레이어들의 ID 배열
    isSpectating: false, // 관전자 모드
    isDead: false, // 죽음 상태
    killingAnimation: false, // 킬 애니메이션 재생 중 여부

    // UI 상태
    forceVideosOff: false,    // 안개 숲 캠 강제 OFF
    foggyVoiceEffect: false,  // 안개 숲 음성 변조
    miniMapEnabled: false,  // 미니맵 활성화 상태 (게임 시작 후 true)

    //미션 상태
    2_1: [false, 1], // 2번 숲 1번 미션
    2_2: [false, 2], // 2번 숲 2번 미션
    2_3: [false, 3], // 2번 숲 3번 미션
    3_1: [false, 1], // 3번 숲 1번 미션
    3_2: [false, 2], // 3번 숲 2번 미션
    3_3: [false, 3], // 3번 숲 3번 미션
    4_1: [false, 1], // 4번 숲 1번 미션
    4_2: [false, 2], // 4번 숲 2번 미션
    4_3: [false, 3], // 4번 숲 3번 미션
    5_1: [false, 1], // 5번 숲 1번 미션
    5_2: [false, 2], // 5번 숲 2번 미션
    5_3: [false, 3], // 5번 숲 3번 미션
    6_1: [false, 1], // 6번 숲 1번 미션
    6_2: [false, 2], // 6번 숲 2번 미션
    6_3: [false, 3], // 6번 숲 3번 미션
  });

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true
  });

  // const [players] = useState([
  //   // 테스트용 더미 데이터
  //   // { id: 1, name: '테스트 플레이어', isMe: true }
  //   // 추후 6인용
  //   { id: 1, nickName: 'Player 1', isMe: true },
  //   { id: 2, nickName: 'Player 2', isMe: false },
  //   { id: 3, nickName: 'Player 3', isMe: false },
  //   { id: 4, nickName: 'Player 4', isMe: false },
  //   { id: 5, nickName: 'Player 5', isMe: false },
  //   { id: 6, nickName: 'Player 6', isMe: false }
  // ]);
  
  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState(['a', 'b', 'c', 'd', 'e']);
  // ✅ 게임 핸들러 (GameRoom이랑 공유됨)
  const handlers = useGameHandlers(roomId, gameState, setGameState);
  const [isConnected, setIsConnected] = useState(false);

    // // 🔹 WebSocket 연결 설정
    // useEffect(() => {
    //   let socketClient;
    //   connectSocket()
    //     .then(client => {
    //       socketClient = client;
    //       setIsConnected(true);
    //     })
    //     .catch(error => {
    //       console.error("❌ WebSocket connection error:", error);
    //     });
  
    //   return () => {
    //     disconnectSocket();
    //     setIsConnected(false);
    //   };
    // }, []);

/////////////////////////////////////핸들러 함수////////////////////////////////////////////////////////
// const {
//   handleGameInfo,
//   handleGameStartResponse,
//   handleEmergencyResponse,
//   handleMoveResponse,
//   handleSaveAcornsResponse,
//   handleChargeFatigueResponse,
//   handleKillResponse,
//   handleCompleteMissionResponse,
// } = useGameHandlers(roomId, gameState, setGameState);

// // 🔹 useGameSocket에 핸들러 전달
// const { isConnected, initializeSocket } = useGameSocket(roomId, {
//   handleGameInfo,
//   handleGameStartResponse,
//   handleEmergencyResponse,
//   handleMoveResponse,
//   handleSaveAcornsResponse,
//   handleChargeFatigueResponse,
//   handleKillResponse,
//   handleCompleteMissionResponse,
// });

////////////////////////////////////이벤트 함수////////////////////////////////////////////////////////////

  // 구독 함수 (startGame을 누를 때 실행됨)
  const subscribeToGameTopics = useCallback(() => {
    if (!isConnected || !roomId) {
      console.error("⚠️ Cannot subscribe: WebSocket is not connected or roomId is missing.");
      return;
    }

    console.log("📌 Subscribing to game topics...");
    subscribeToTopic(`/user/queue/game/${roomId}/info`, handlers.handleGameInfo);
    subscribeToTopic(`/topic/game/${roomId}/start`, handlers.handleGameStartResponse);
    subscribeToTopic(`/topic/game/${roomId}/emergency`, handlers.handleEmergencyResponse);
    subscribeToTopic(`/topic/game/${roomId}/move`, handlers.handleMoveResponse);
    subscribeToTopic(`/topic/game/${roomId}/save-acorns`, handlers.handleSaveAcornsResponse);
    subscribeToTopic(`/topic/game/${roomId}/charge-fatigue`, handlers.handleChargeFatigueResponse);
    subscribeToTopic(`/topic/game/${roomId}/kill`, handlers.handleKillResponse);
    subscribeToTopic(`/topic/game/${roomId}/complete-mission`, handlers.handleCompleteMissionResponse);
  }, [isConnected, roomId]);

  // 최신 닉네임 리스트 가져오기 (startGame을 누를 때 실행됨)
  const getPlayers = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        const response = await fetchRoomById(roomId);
        console.log('Member players:', response.data['nicknames']);
        
        // 최신 닉네임 리스트 생성
        const updatedPlayers = [...players, ...response.data['nicknames']]
          .map((nick, index) => ({
            id: index + 1, // ✅ 1부터 시작하는 id 부여
            nickName: nick,
            isMe: nick === gameState.nickName // 현재 사용자 닉네임과 비교하여 isMe 설정
          }));

        // 현재 사용자 닉네임과 매칭되는 userNum 업데이트
        const currentUser = updatedPlayers.find(player => player.nickName === gameState.nickName);
        if (currentUser) {
          gameState.userNum = currentUser.id;
        }

        // 상태 업데이트
        setPlayers(updatedPlayers);

        // 최신 값 반환
        return updatedPlayers;
      } catch (error) {
        console.error('Failed to get member nicknames:', error);
        return players; // 에러 발생 시 기존 nicknames 반환
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
      return players;
    }
  }, [isConnected, roomId, players, gameState.nickName, gameState.userNum]);


  // 게임 시작 처리
  const startGame = useCallback(async () => {
    console.log('Attempting to start game:', roomId);
    
    if (isConnected && roomId) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();
        console.log('Member nicknames2:', updatedNicknames);
        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);

        // ✅ 게임 시작 전에 WebSocket 구독 실행
        await subscribeToGameTopics();
        await gameService.startGame(roomId, nicknameList);
        console.log('Game start request sent successfully');
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    } else {
      console.error('Socket connection not initialized');
    }
  }, [isConnected, roomId, subscribeToGameTopics, getPlayers]);

  // 피로도 충전 처리
  const chargeFatigue = useCallback(async () => {
    if (isConnected && roomId && gameState.userNum) {
      try {
        await gameService.chargeFatigue(roomId, gameState.userNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, gameState.userNum]);

  // 도토리 저장 처리
  const saveUserAcorns = useCallback(async () => {
    if (isConnected && roomId && gameState.userNum) {
      try {
        await gameService.saveUserAcorns(roomId, gameState.userNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, gameState.userNum]);

  // 숲 이동 처리
  const moveForest = useCallback(async (forestNum) => {
    if (isConnected && roomId && gameState.userNum && forestNum) {
      try {
        await gameService.moveForest(roomId, gameState.userNum, forestNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, gameState.userNum]);

  // 플레이어 사망 처리
  const killUser = useCallback(async (killedNum) => {
    if (isConnected && roomId && gameState.userNum && killedNum) {
      try {
        await gameService.killUser(roomId, killedNum, gameState.userNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, gameState.userNum]);

  // 긴급 투표 시작 처리
  const startEmergency = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await gameService.startEmergency(roomId);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId]);

  // 미션 완료 처리
  const completeMission = useCallback(async (forestNum, missionNum) => {
    if (isConnected && roomId) {
      try {
        await gameService.completeMission(roomId, forestNum, missionNum, gameState.userNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, gameState.userNum]);

  // 투표 종료
  const endVote = (result) => {
    setGameState(prev => ({
      ...prev,
      isVoting: false,
      isEmergencyVote: false,
      timerRunning: !result.winner,  // 승자가 없으면 타이머 재개
      // 결과에 따른 상태 업데이트
      ...(result.winner && { winner: result.winner }),
      ...(result.eliminatedPlayer && { 
        killedPlayers: [...prev.killedPlayers, result.eliminatedPlayer] 
      })
    }));
  };

  // 일반 투표 시작 함수
  const startFinalVote = () => {
    setGameState(prev => ({
      ...prev,
      isVoting: true,
      isEmergencyVote: false,
      timerRunning: false
    }));
  };

  // 안개 숲 특수 효과 토글
  const toggleFoggyEffects = (isInFoggyForest) => {
    setGameState(prev => ({
      ...prev,
      forceVideosOff: isInFoggyForest,
      foggyVoiceEffect: isInFoggyForest   // openVidu 넣었을때, 실행되는 코드 구현 필요
    }));
  };

  const value = {
    gameState,         // 게임 전체 상태
    setGameState,      // 게임 상태 변경
    startGame,        // 게임 시작
    chargeFatigue,       // 피로도 충전
    saveUserAcorns,       // 도토리 저장
    moveForest,       // 숲 이동
    killUser,       // 플레이어 사망 처리
    startEmergency, // 긴급 투표 시작
    completeMission, // 미션 완료
    endVote,          // 투표 종료
    startFinalVote,   // 일반 투표 시작
    toggleFoggyEffects, // 안개 숲 효과
    videoSettings,     // 비디오 설정
    setVideoSettings,   // 비디오 설정 변경
    isConnected,
    setRoomId,
    roomId,
    setIsConnected,
    players,
    // setNicknames,  // nicknames를 설정할 수 있는 함수 추가
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};