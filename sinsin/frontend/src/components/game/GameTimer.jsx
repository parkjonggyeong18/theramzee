// components/game/GameTimer.jsx
import { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VoteScreen from './vote/VoteScreen';

const GameTimer = () => {
  const { gameState, setGameState, endVote } = useGame();

  useEffect(() => {
    let timerInterval;

    if (gameState.isStarted && !gameState.isPaused && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;

          // 게임 시간 종료 (7분 = 0초)
          if (newTimer === 0) {
            clearInterval(timerInterval);
            // 최종 투표 시작
            return {
              ...prev,
              timer: 0,
              isVoting: true,
              isEmergencyVote: false
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
  }, [gameState.isStarted, gameState.isPaused, gameState.timer, setGameState]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <TimerContainer>
      <Timer>{formatTime(gameState.timer)}</Timer>
      {gameState.isVoting && <VoteScreen onVoteEnd={endVote} />}
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
`;

const Timer = styled.div`
  font-size: 2rem;
  color: white;
`;

export default GameTimer;