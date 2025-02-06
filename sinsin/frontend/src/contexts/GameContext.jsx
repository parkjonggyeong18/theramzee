import React, { createContext, useState, useContext } from 'react';
import { gameStart, saveAcorns, moveForest, completeMission, killPlayer, getGameInfo, getUserFatigue, getUserAcorns, getMissionStatus, emergencyCall, chargeFatigue } from '../api/game';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    isStarted: false,
    timer: 420, // 7분
    role: null, // 'good' | 'bad'
    totalAcorns: 0,
    heldAcorns: 0,
    fatigue: 0,
    isVoting: false,          // 투표 중인지 여부
    isEmergencyVote: false,   // 긴급 투표인지 여부
    hasUsedEmergency: false,  // 긴급 투표 사용 여부
    voteTimer: 180, // 3분
    isPaused: false, // 게임 타이머 일시정지 여부
    killedPlayers: [], // 죽은 플레이어들의 ID 배열
    isSpectating: false, // 관전자 모드
    isDead: false, // 죽음 상태
    killingAnimation: false, // 킬 애니메이션 재생 중 여부
    forceVideosOff: false,    // 안개 숲 캠 강제 OFF
    foggyVoiceEffect: false,  // 안개 숲 음성 변조
  });

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true
  });

  const [players] = useState([
    // 테스트용 더미 데이터
    { id: 1, name: '테스트 플레이어', isMe: true }
    // 추후 6인용
    /* 
    { id: 1, name: 'Player 1', isMe: true },
    { id: 2, name: 'Player 2', isMe: false },
    { id: 3, name: 'Player 3', isMe: false },
    { id: 4, name: 'Player 4', isMe: false },
    { id: 5, name: 'Player 5', isMe: false },
    { id: 6, name: 'Player 6', isMe: false }
    */
  ]);

  const killPlayer = (playerId) => {
    setGameState(prev => ({
      ...prev,
      killedPlayers: [...prev.killedPlayers, playerId],
      isDead: prev.players.find(p => p.isMe && p.id === playerId) ? true : prev.isDead,
      isSpectating: prev.players.find(p => p.isMe && p.id === playerId) ? true : prev.isSpectating
    }));
  };

  // 긴급 투표 시작
  const startEmergencyVote = () => {
    setGameState(prev => ({
      ...prev,
      isVoting: true,
      isEmergencyVote: true,
      hasUsedEmergency: true
    }));
  };

  // 투표 종료
  const endVote = (result) => {
    setGameState(prev => ({
      ...prev,
      isVoting: false,
      isEmergencyVote: false,
      // 결과에 따른 상태 업데이트
      ...(result.winner && { winner: result.winner }),
      ...(result.eliminatedPlayer && { 
        killedPlayers: [...prev.killedPlayers, result.eliminatedPlayer] 
      })
    }));
  };

  // 안개 숲 특수 효과 토글
  const toggleFoggyEffects = (isInFoggyForest) => {
    setGameState(prev => ({
      ...prev,
      forceVideosOff: isInFoggyForest,
      foggyVoiceEffect: isInFoggyForest
    }));
  };

  const value = {
    gameState,
    setGameState,
    players,
    killPlayer,
    startEmergencyVote,
    endVote,
    toggleFoggyEffects,
    videoSettings,
    setVideoSettings
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