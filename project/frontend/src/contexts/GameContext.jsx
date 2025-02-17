import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import * as gameService from '../api/gameService';
import { fetchRoomById } from '../api/room';
import { subscribeToTopic } from '../api/stomp'

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // 게임의 전체 상태 관리
  const [gameState, setGameState] = useState({
    // 유저 정보
    userNum: null,
    nickName: null,

    // 숲 별 유저 정보
    forestUsers: null,

    // 게임 진행 상태
    isStarted: false, // 게임 시작 여부
    timer: 420, // 게임 시간 (7분)
    timerRunning: false,    // 타이머 실행 상태
    evilSquirrel: null, // true | false
    forestToken: null,  // 숲 토큰
    forestNum: 1, // 현재 숲 번호 (초기는 메인 숲숲)

    // 게임 리소스
    totalAcorns: 0, // 저장된 도토리
    heldAcorns: 0,  // 보유 중인 도토리
    fatigue: 0,     // 피로도 (0-3)

    // 투표 시스템
    isVoting: false,
    isEmergencyVote: false,
    currentVotes: {},
    votingInProgress: false, 

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
    // 종료 상태
    isGameOver: false,           // 게임 종료 여부
    gameOverReason: null,        // 'acorns' | 'emergency' | 'time'
    winner: null,                // 'good' | 'bad'
    lastKilledPlayer: null,      // 마지막으로 죽은 플레이어
    //미션 상태

    "2_1": [false, 1], // 2번 숲 1번 미션
    "2_2": [false, 2], // 2번 숲 2번 미션
    "2_3": [false, 3], // 2번 숲 3번 미션
    "3_1": [false, 1], // 3번 숲 1번 미션
    "3_2": [false, 2], // 3번 숲 2번 미션
    "3_3": [false, 3], // 3번 숲 3번 미션
    "4_1": [false, 1], // 4번 숲 1번 미션
    "4_2": [false, 2], // 4번 숲 2번 미션
    "4_3": [false, 3], // 4번 숲 3번 미션
    "5_1": [false, 1], // 5번 숲 1번 미션
    "5_2": [false, 2], // 5번 숲 2번 미션
    "5_3": [false, 3], // 5번 숲 3번 미션
    "6_1": [false, 1], // 6번 숲 1번 미션
    "6_2": [false, 2], // 6번 숲 2번 미션
    "6_3": [false, 3], // 6번 숲 3번 미션
    "7_1": [false, 1], // 6번 숲 1번 미션
    "7_2": [false, 2], // 6번 숲 2번 미션
    "7_3": [false, 3], // 6번 숲 3번 미션
  });

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true
  });

  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const nickname = sessionStorage.getItem('nickName');

  // 피로도 및 도토리 저장 
  const [isStorageActive, setIsStorageActive] = useState(false);
  const [isEnergyActive, setIsEnergyActive] = useState(false);
  const timerRef = useRef(null);

  // 최신 닉네임 리스트 가져오기 (startGame을 누를 때 실행됨)
  const getPlayers = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        const response = await fetchRoomById(roomId);

        // 최신 닉네임 리스트 생성
        const updatedPlayers = [...players, ...response.data['nicknames']]
          .map((nick, index) => ({
            id: index + 1, // ✅ 1부터 시작하는 id 부여
            nickName: nick,
            isMe: nick === nickname // 현재 사용자 닉네임과 비교하여 isMe 설정
          }));

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
  }, [isConnected, roomId, players, nickname]);

  // 게임 시작 처리
  const startGame = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();

        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);

        // ✅ 각 nickname을 키로 하고 값은 0으로 설정
        const nicknameState = nicknameList.reduce((acc, nickname) => {
          acc[nickname] = 0;
          return acc;
        }, {});

        // ✅ GameState 업데이트
        setGameState(prev => ({
          ...prev,
          ...nicknameState,
        }));

        // ✅ 게임 시작 요청
        gameService.startGame(roomId, nicknameList);
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    } else {
      console.error('Socket connection not initialized');
    }
  }, [isConnected, roomId, getPlayers]);

  // 피로도 충전 처리
  const chargeFatigue = useCallback(async () => {
    if (isConnected && roomId && nickname) {
      try {
        await gameService.chargeFatigue(roomId, nickname);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, nickname]);

  // 게임 종료 처리
  const checkGameOver = useCallback(() => {
    if (gameState.totalAcorns >= 10) {
      console.log("게임 종료");
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        gameOverReason: 'acorns',
        winner: prev.evilSquirrel ? 'bad' : 'good',
        timerRunning: false,
        isStarted: false  // 추가
      }));
    }
  }, [gameState.totalAcorns]);
  useEffect(() => {
    if (isConnected && roomId) {
      subscribeToTopic(`/topic/game/${roomId}/emergency`, (response) => {
        console.log('Emergency vote message received:', response);
        
        if (response.success && response.data.action === 'START_EMERGENCY_VOTE') {
          setGameState(prev => ({
            ...prev,
            isVoting: true,
            isEmergencyVote: true,
            votingInProgress: true,
            currentVotes: {},
          }));
        }
      });
    }
  }, [isConnected, roomId]);

  useEffect(() => {
    checkGameOver();
  }, [gameState.totalAcorns, checkGameOver]);

  // 도토리 저장 처리
  const saveUserAcorns = useCallback(async () => {
    if (isConnected && roomId && nickname) {
      try {
        await gameService.saveUserAcorns(roomId, nickname);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, nickname]);

  useEffect(() => {
    
    checkGameOver();
  }, [gameState.totalAcorns, checkGameOver]);

  // 숲 이동 처리
  const moveForest = useCallback(async (forestNum) => {
    const nicknameList = players.map(player => player.nickName);
    if (isConnected && roomId && nickname && forestNum && nicknameList) {
      try {
        // ✅ 최신 nicknames 값을 받아오기
        const updatedNicknames = await getPlayers();

        // ✅ nickName 값만 추출하여 배열 형태로 변환
        const nicknameList = updatedNicknames.map(player => player.nickName);

        await gameService.moveForest(roomId, nickname, forestNum, nicknameList);
        setGameState.currentForestNum = forestNum;
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, nickname]);
  
  // 플레이어 사망 처리
  const killUser = useCallback(async (vitimNickname) => {
    if (isConnected && roomId && nickname && vitimNickname) {
      try {
        await gameService.killUser(roomId, vitimNickname, nickname);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, nickname]);

  // 긴급 투표 시작 처리
  // 긴급 투표 시작
  const startEmergencyVote = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        const nicknameList = players.map(player => player.nickName);
        // gameService.startEmergency 대신 startEmergencyVote 사용
        await gameService.startEmergencyVote(roomId, nicknameList);
        
        setGameState(prev => ({
          ...prev,
          isVoting: true,
          isEmergencyVote: true,
          votingInProgress: true,
          currentVotes: {},
        }));
      } catch (error) {
        console.error('Failed to start emergency vote:', error);
      }
    }
}, [isConnected, roomId, players]);

  // 투표 기록
  const recordVote = useCallback((voter, votedPlayer) => {
    setGameState(prev => ({
      ...prev,
      currentVotes: {
        ...prev.currentVotes,
        [voter]: votedPlayer
      }
    }));
  }, []);

  // 투표 종료
  const endVote = useCallback((result) => {
    setGameState(prev => ({
      ...prev,
      isVoting: false,
      isEmergencyVote: false,
      votingInProgress: false,
      currentVotes: {},
      hasUsedEmergency: prev.isEmergencyVote ? true : prev.hasUsedEmergency,
      // ... 다른 결과 처리 로직
    }));
  }, []);

  // 미션 완료 처리
  const completeMission = useCallback(async (forestNum, missionNum) => {
    if (isConnected && roomId) {
      try {
        console.log("미션 완료 전송");
        await gameService.completeMission(roomId, forestNum, missionNum, nickname);

        const missionKey = `${forestNum}_${missionNum}`;

        setGameState(prev => {
          const newState = {
            ...prev,
            [missionKey]: [true, prev[missionKey][1]],
            // 피로도 업데이트 제거
          };
          return newState;
        });
      } catch (error) {
        console.error('Failed to complete mission:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty:', {
        isConnected,
        roomId
      });
    }
  }, [isConnected, roomId, nickname, gameState]);

  // 투표 종료
  
  // 안개 숲 특수 효과 토글
  const toggleFoggyEffects = (isInFoggyForest) => {
    setGameState(prev => ({
      ...prev,
      forceVideosOff: isInFoggyForest,
      foggyVoiceEffect: isInFoggyForest   // openVidu 넣었을때, 실행되는 코드 구현 필요
    }));
  };

  // 게임 초기화 처리
  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isStarted: false,
      timer: 420,
      timerRunning: false,
      evilSquirrel: null,
      forestToken: null,
      totalAcorns: 0,
      heldAcorns: 0,
      fatigue: 0,
      isVoting: false,
      isEmergencyVote: false,
      hasUsedEmergency: false,
      voteTimer: 20,
      isPaused: false,
      killedPlayers: [],
      isSpectating: false,
      isDead: false,
      killingAnimation: false,
      isGameOver: false,
      gameOverReason: null,
      winner: null,
      lastKilledPlayer: null
    }));
  }, []);

  // 액션 취소 함수
  const cancelAction = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsStorageActive(false);
    setIsEnergyActive(false);
    timerRef.current = null;
  }, []);

  // 도토리 저장 시작
  const startSaveAcorns = useCallback(() => {
    if (gameState.evilSquirrel !== false && gameState.heldAcorns === 0 && isStorageActive && gameState.isDead) return;
    setIsStorageActive(true);
    timerRef.current = setTimeout(() => {
      saveUserAcorns();
      setIsStorageActive(false);
    }, 10000);
  }, [gameState.evilSquirrel, gameState.heldAcorns, isStorageActive, gameState.isDead, saveUserAcorns]);

  // 피로도 충전 시작
  const startChargeFatigue = useCallback(() => {
    if (gameState.fatigue >= 3 || isEnergyActive || gameState.isDead) return;
    setIsEnergyActive(true);
    timerRef.current = setTimeout(() => {
      chargeFatigue();
      setIsEnergyActive(false);
    }, gameState.evilSquirrel === false ? 5000 : 10000);
  }, [gameState.fatigue, isEnergyActive, gameState.isDead, gameState.evilSquirrel, chargeFatigue]);

  const value = {
    gameState,         // 게임 전체 상태
    setGameState,      // 게임 상태 변경
    startGame,        // 게임 시작
    chargeFatigue,       // 피로도 충전
    saveUserAcorns,       // 도토리 저장
    moveForest,       // 숲 이동
    killUser,       // 플레이어 사망 처리// 긴급 투표 시작
    completeMission, // 미션 완료
    endVote,          // 투표 종료  // 일반 투표 시작
    toggleFoggyEffects, // 안개 숲 효과
    videoSettings,     // 비디오 설정
    setVideoSettings,   // 비디오 설정 변경
    isConnected,
    setRoomId,
    roomId,
    setIsConnected,
    players,
    setPlayers,
    isStorageActive,
    setIsStorageActive,
    isEnergyActive,
    setIsEnergyActive,
    cancelAction,
    startSaveAcorns,
    startChargeFatigue,
    startEmergencyVote,
    recordVote,
    endVote,
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

