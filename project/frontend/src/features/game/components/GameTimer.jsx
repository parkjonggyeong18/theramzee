import { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const GameTimer = () => {
  const { gameState, setGameState, startFinalVote } = useGame();
  const INITIAL_TIME = 420; // 7분 = 420초

  useEffect(() => {
    let timerInterval;

    if (gameState.isStarted && !gameState.isPaused && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;
          
          if (newTimer === 0) {
            clearInterval(timerInterval);
            startFinalVote();
            return {
              ...prev,
              timer: 0
            };
          }
          
          return {
            ...prev,
            timer: newTimer
          };
        });
      }, 1000);
    }

    return () => clearInterval(timerInterval);
  }, [gameState.isStarted, gameState.isPaused]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getProgressBarColor = (timer) => {
    const percentage = (timer / INITIAL_TIME) * 100;
    if (percentage > 66) return '#4CAF50'; // 녹색
    if (percentage > 33) return '#FFC107'; // 노란색
    return '#FF5252'; // 빨간색
  };

  return (
    <TimerContainer $timer={gameState.timer}>
      <TimeText>남은 시간</TimeText>
      <ProgressBarContainer>
        <ProgressBar 
          $progress={(gameState.timer / INITIAL_TIME) * 100}
          $color={getProgressBarColor(gameState.timer)}
        />
      </ProgressBarContainer>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
  min-width: 200px;
`;

const TimeText = styled.div`
  font-size: 1rem;
  font-family: 'JejuHallasan';
  color: white;
  text-align: center;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: ${props => props.$color};
  transition: all 1s linear;
  border-radius: 4px;

  @keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  animation: ${props => props.$progress <= 25 ? 'flash 1s infinite' : 'none'};
`;

export default GameTimer;