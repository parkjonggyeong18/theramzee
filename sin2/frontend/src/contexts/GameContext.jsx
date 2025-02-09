// contexts/GameContext.jsx
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as gameService from '../services/gameService';
import useGameSocket  from '../hooks/useSocket';
import { useGameHandlers } from '../handlers/gameHandlers';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  // 게임의 전체 상태 관리
  const [gameState, setGameState] = useState({
    // 유저 정보
    userNum: 3,

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
  });

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true
  });

  const [players] = useState([
    // 테스트용 더미 데이터
    // { id: 1, name: '테스트 플레이어', isMe: true }
    // 추후 6인용
    { id: 1, nickName: 'Player 1', isMe: true },
    { id: 2, nickName: 'Player 2', isMe: false },
    { id: 3, nickName: 'Player 3', isMe: false },
    { id: 4, nickName: 'Player 4', isMe: false },
    { id: 5, nickName: 'Player 5', isMe: false },
    { id: 6, nickName: 'Player 6', isMe: false }
  ]);
  
  // const [isConnected, setIsConnected] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [nicknames, setNicknames] = useState('');

/////////////////////////////////////핸들러 함수////////////////////////////////////////////////////////
const {
  handleGameInfo,
  handleGameStartResponse,
  handleEmergencyResponse,
  handleMoveResponse,
  handleSaveAcornsResponse,
  handleChargeFatigueResponse,
  handleKillResponse,
  handleCompleteMissionResponse,
} = useGameHandlers(roomId, gameState, setGameState);

// 🔹 useGameSocket에 핸들러 전달
const { isConnected, initializeSocket } = useGameSocket(roomId, {
  handleGameInfo,
  handleGameStartResponse,
  handleEmergencyResponse,
  handleMoveResponse,
  handleSaveAcornsResponse,
  handleChargeFatigueResponse,
  handleKillResponse,
  handleCompleteMissionResponse,
});

////////////////////////////////////이벤트 함수////////////////////////////////////////////////////////////

  // 게임 시작 처리
  const handleGameStart = useCallback(async () => {
    console.log('Attempting to start game:', roomId, players.map(p => p.nickName));
    
    let connected;
    if (!isConnected || !roomId) {
      connected = await initializeSocket();
      if (!connected) {
        console.error('Failed to initialize socket connection');
        return;
      }
    }

    if (true && roomId) {
      try {
        await gameService.startGame(roomId, players.map(p => p.nickName));
        console.log('Game start request sent successfully');
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    } else {
      console.error('Socket connection not initialized');
    }
  }, [isConnected, roomId, players, initializeSocket]);

  // 플레이어 사망 처리
  const killPlayer = (playerId) => {
    setGameState(prev => ({
      ...prev,
      killedPlayers: [...prev.killedPlayers, playerId],
      isDead: players.find(p => p.isMe && p.id === playerId) ? true : prev.isDead,
      isSpectating: players.find(p => p.isMe && p.id === playerId) ? true : prev.isSpectating
    }));
  };

  // 긴급 투표 시작
  const startEmergencyVote = () => {
    setGameState(prev => ({
      ...prev,
      isVoting: true,
      isEmergencyVote: true,
      hasUsedEmergency: true,
      timerRunning: false  // 게임 타이머 일시 정지
    }));
  };

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
    players,          // 플레이어 정보
    handleGameStart,        // 게임 시작
    killPlayer,       // 플레이어 사망 처리
    startEmergencyVote, // 긴급 투표 시작
    endVote,          // 투표 종료
    startFinalVote,   // 일반 투표 시작
    toggleFoggyEffects, // 안개 숲 효과
    videoSettings,     // 비디오 설정
    setVideoSettings,   // 비디오 설정 변경
    isConnected,
    setRoomId,
    roomId,
    initializeSocket
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