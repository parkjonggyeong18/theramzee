import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    isStarted: false,
    timer: 420,
    timerRunning: false,
    role: null,
    totalAcorns: 0,
    heldAcorns: 0,
    fatigue: 0,
    isVoting: false,
    isEmergencyVote: false,
    hasUsedEmergency: false,
    voteTimer: 180,
    isPaused: false,
    killedPlayers: [],
    isSpectating: false,
    isDead: false,
    killingAnimation: false,
    forceVideosOff: false,
    foggyVoiceEffect: false,
    miniMapEnabled: false,
  });

  const [videoSettings, setVideoSettings] = useState({
    videoEnabled: true,
    audioEnabled: true,
  });

  const [players] = useState([
    { id: 1, name: 'Player 1', isMe: true },
    { id: 2, name: 'Player 2', isMe: false },
    { id: 3, name: 'Player 3', isMe: false },
    { id: 4, name: 'Player 4', isMe: false },
    { id: 5, name: 'Player 5', isMe: false },
    { id: 6, name: 'Player 6', isMe: false },
  ]);

  const startGame = () => {
    const randomRole = Math.random() < 0.5 ? 'good' : 'bad';
    setGameState((prev) => ({
      ...prev,
      isStarted: true,
      timerRunning: true,
      role: randomRole,
      miniMapEnabled: true,
    }));
  };

  const killPlayer = (playerId) => {
    setGameState((prev) => ({
      ...prev,
      killedPlayers: [...prev.killedPlayers, playerId],
      isDead: players.find((p) => p.isMe && p.id === playerId) ? true : prev.isDead,
      isSpectating: players.find((p) => p.isMe && p.id === playerId) ? true : prev.isSpectating,
    }));
  };

  const startEmergencyVote = () => {
    setGameState((prev) => ({
      ...prev,
      isVoting: true,
      isEmergencyVote: true,
      hasUsedEmergency: true,
      timerRunning: false,
    }));
  };

  const endVote = (result) => {
    setGameState((prev) => ({
      ...prev,
      isVoting: false,
      isEmergencyVote: false,
      timerRunning: !result.winner,
      ...(result.winner && { winner: result.winner }),
      ...(result.eliminatedPlayer && {
        killedPlayers: [...prev.killedPlayers, result.eliminatedPlayer],
      }),
    }));
  };

  const toggleFoggyEffects = (isInFoggyForest) => {
    setGameState((prev) => ({
      ...prev,
      forceVideosOff: isInFoggyForest,
      foggyVoiceEffect: isInFoggyForest,
    }));
  };

  const value = {
    gameState,
    setGameState,
    players,
    startGame,
    killPlayer,
    startEmergencyVote,
    endVote,
    toggleFoggyEffects,
    videoSettings,
    setVideoSettings,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext