// components/game/vote/VoteScreen.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { Z_INDEX } from '../../../constants/zIndex';

const VoteScreen = ({ 
 onVoteEnd,
 isEmergency = false  // 긴급 투표 여부
}) => {
 const { gameState, setGameState, players } = useGame();
 const [selectedPlayer, setSelectedPlayer] = useState(null);
 const [votes, setVotes] = useState({});
 const [timer, setTimer] = useState(180);  // 3분

 // 타이머 포맷팅 함수
 const formatTime = (seconds) => {
   const mins = Math.floor(seconds / 60);
   const secs = seconds % 60;
   return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
 };

 useEffect(() => {
   if (isEmergency) {
     // 게임 타이머 일시 정지
     setGameState(prev => ({
       ...prev,
       isPaused: true
     }));
   }

   const countdown = setInterval(() => {
     setTimer(prev => {
       if (prev <= 1) {
         clearInterval(countdown);
         handleVoteEnd();
         return 0;
       }
       return prev - 1;
     });
   }, 1000);

   return () => {
     clearInterval(countdown);
     if (isEmergency) {
       // 게임 타이머 재개
       setGameState(prev => ({
         ...prev,
         isPaused: false
       }));
     }
   };
 }, []);

 const handleVote = (playerId) => {
   if (selectedPlayer || gameState.isDead) return;
   setSelectedPlayer(playerId);
   setVotes(prev => ({
     ...prev,
     [playerId]: (prev[playerId] || 0) + 1
   }));
 };

 const handleVoteEnd = () => {
   const maxVotes = Math.max(...Object.values(votes));
   const votedPlayers = Object.entries(votes).filter(([_, count]) => count === maxVotes);

   if (votedPlayers.length > 1) {
     if (isEmergency) {
       // 긴급 투표에서 동률 - 게임 계속
       onVoteEnd({ 
         continues: true 
       });
     } else {
       // 시간 종료 투표에서 동률 - 나쁜 다람쥐 승리
       onVoteEnd({ 
         winner: 'bad' 
       });
     }
     return;
   }

   const [eliminatedPlayer] = votedPlayers[0];
   const isBadSquirrel = gameState.role === 'bad' && eliminatedPlayer === players.find(p => p.isMe)?.id;

   if (isEmergency) {
     if (isBadSquirrel) {
       // 긴급 투표에서 나쁜 다람쥐 제거 - 착한 다람쥐 승리
       onVoteEnd({ 
         winner: 'good',
         eliminatedPlayer 
       });
     } else {
       // 긴급 투표에서 착한 다람쥐 제거 - 게임 계속
       onVoteEnd({ 
         continues: true,
         eliminatedPlayer 
       });
     }
   } else {
     // 시간 종료 투표
     onVoteEnd({ 
       winner: isBadSquirrel ? 'good' : 'bad',
       eliminatedPlayer 
     });
   }
 };

 return (
   <VoteContainer>
     <VoteTitle>{isEmergency ? '긴급 투표' : '최종 투표'}</VoteTitle>
     <Timer>{formatTime(timer)}</Timer>

     <PlayerGrid>
       {players.map(player => (
         <PlayerCard
           key={player.id}
           onClick={() => handleVote(player.id)}
           $selected={selectedPlayer === player.id}
           disabled={selectedPlayer || gameState.isDead}
         >
           <VideoContainer>
             {/* OpenVidu 비디오 컴포넌트 */}
           </VideoContainer>
           <PlayerName>{player.name}</PlayerName>
           {votes[player.id] > 0 && (
             <VoteCount>{votes[player.id]}</VoteCount>
           )}
         </PlayerCard>
       ))}
     </PlayerGrid>
   </VoteContainer>
 );
};

const VoteContainer = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.9);
 display: flex;
 flex-direction: column;
 align-items: center;
 padding: 40px;
 z-index: ${Z_INDEX.OVERLAY};  // z-index 추가
`;

const VoteTitle = styled.h2`
 color: white;
 font-size: 2rem;
 font-family: 'JejuHallasan';
 margin-bottom: 20px;
`;

const Timer = styled.div`
 color: white;
 font-size: 3rem;
 font-family: 'JejuHallasan';
 margin-bottom: 40px;
`;

const PlayerGrid = styled.div`
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 gap: 20px;
 max-width: 1200px;
 width: 100%;
`;

const PlayerCard = styled.button`
 position: relative;
 width: 100%;
 aspect-ratio: 4/3;
 background: #333;
 border: none;
 border-radius: 10px;
 cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
 opacity: ${props => props.disabled ? 0.5 : 1};
 overflow: hidden;

 ${props => props.$selected && `
   border: 3px solid #FFD700;
 `}

 &:hover:not(:disabled) {
   &::after {
     content: '';
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background: rgba(255, 255, 255, 0.2);
   }
 }
`;

const VideoContainer = styled.div`
 width: 100%;
 height: 100%;
`;

const PlayerName = styled.div`
 position: absolute;
 bottom: 10px;
 left: 50%;
 transform: translateX(-50%);
 color: white;
 font-family: 'JejuHallasan';
`;

const VoteCount = styled.div`
 position: absolute;
 top: 10px;
 right: 10px;
 background: #FFD700;
 color: black;
 width: 24px;
 height: 24px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: bold;
`;

export default VoteScreen;