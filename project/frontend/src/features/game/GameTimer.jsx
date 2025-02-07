import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const GameTimer = () => {
  const { gameState, setGameState } = useGame();

  useEffect(() => {
    if (gameState.isStarted && gameState.timerRunning) {
      const timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timer: Math.max(0, prev.timer - 1)
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isStarted, gameState.timerRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <TimerText>{formatTime(gameState.timer)}</TimerText>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 20px;
`;

const TimerText = styled.span`
  color: white;
  font-size: 2rem;
  font-weight: bold;
`;

export default GameTimer;
