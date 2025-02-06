// components/game/GameTimer.jsx
import { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VoteScreen from './vote/VoteScreen';

const GameTimer = () => {
<<<<<<< HEAD
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
 }, [gameState.isStarted, gameState.isPaused]);

 const formatTime = (seconds) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
 };

 const handleVoteEnd = (result) => {
   endVote(result);
   // 게임 종료 처리
   setGameState(prev => ({
     ...prev,
     isStarted: false,
     winner: result.winner
   }));
 };

 return (
   <>
     <TimerContainer>
       {formatTime(gameState.timer)}
     </TimerContainer>

     {gameState.isVoting && !gameState.isEmergencyVote && (
       <VoteScreen 
         onVoteEnd={handleVoteEnd}
         isEmergency={false}
       />
     )}
   </>
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
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default GameTimer;