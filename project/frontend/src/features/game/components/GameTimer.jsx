import { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const GameTimer = () => {
  const { gameState, setGameState } = useGame();

  useEffect(() => {
    let timerInterval;

    if (gameState.isStarted && !gameState.isPaused && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;
          
          // 게임 시간 종료시 최종 투표 시작
          if (newTimer === 0) {
            return {
              ...prev,
              timer: 0,
              isVoting: true,
              voteType: 'final',
              votes: {}
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

  return (
    <TimerContainer $timer={gameState.timer}>
      {formatTime(gameState.timer)}
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
 font-size: 2.5rem;
 font-family: 'JejuHallasan';
 color: white;
 background: rgba(0, 0, 0, 0.5);
 padding: 10px 20px;
 border-radius: 10px;
 display: flex;
 justify-content: center;
 align-items: center;
 min-width: 150px;

 // 1분(60초) 이하일 때 깜빡이는 효과
 animation: ${props => props.timer <= 60 ? 'pulse 1s infinite' : 'none'};

 @keyframes pulse {
   0% { opacity: 1; }
   50% { opacity: 0.5; }
   100% { opacity: 1; }
 }
`;

export default GameTimer;