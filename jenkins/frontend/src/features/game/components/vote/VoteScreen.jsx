// import React, { useState, useEffect, useCallback } from 'react';
// import { useGame } from '../../../../contexts/GameContext';
// import styled from 'styled-components';
// import { Z_INDEX } from '../../../../constants/zIndex';
// import * as gameService from '../../../../api/gameService';  // 이 줄 추가

// const VoteScreen = ({ isEmergency }) => {
//   const { gameState, players, setGameState } = useGame();
//   const [selectedPlayer, setSelectedPlayer] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(30);
//   const currentNickname = sessionStorage.getItem('nickName');

//   // 살아있는 플레이어만 필터링
//   const livingPlayers = players.filter(p => !gameState.killedPlayers?.includes(p.nickName));

//   // 투표 처리 함수
//   const handleVote = useCallback(async (targetNickname) => {
//     if (gameState.isDead || gameState.votes?.[currentNickname]) {
//       console.log('🚫 투표 불가:', {
//         isDead: gameState.isDead,
//         alreadyVoted: Boolean(gameState.votes?.[currentNickname])
//       });
//       return;
//     }

//     try {
//       console.log('✅ 투표 진행:', {
//         voter: currentNickname,
//         target: targetNickname
//       });

//       // 로컬 상태 업데이트
//       setSelectedPlayer(targetNickname);
      
//       // GameContext 상태 업데이트
//       setGameState(prev => ({
//         ...prev,
//         votes: {
//           ...prev.votes,
//           [currentNickname]: targetNickname
//         }
//       }));

//       // WebSocket으로 투표 전송
//       await gameService.submitVoteWS(gameState.roomId, currentNickname, targetNickname);
      
//     } catch (error) {
//       console.error('❌ 투표 처리 실패:', error);
//     }
//   }, [currentNickname, gameState.isDead, gameState.votes, gameState.roomId, setGameState]);

//   // 타이머 효과
//   useEffect(() => {
//     console.log('⏱️ 타이머 시작');
//     const timer = setInterval(() => {
//       setTimeLeft(prev => {
//         console.log('현재 시간:', prev);
//         if (prev <= 1) {
//           console.log('⏰ 투표 시간 종료');
//           clearInterval(timer);
          
//           // 투표 종료 처리
//           const totalVotes = Object.keys(gameState.votes || {}).length;
//           console.log('최종 투표 현황:', {
//             총투표수: totalVotes,
//             투표내역: gameState.votes
//           });

//           if (totalVotes > 0) {
//             console.log('투표 결과 처리 시작');
//             // 투표 결과 처리 로직
//           }
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [gameState.votes]);

//   console.log('현재 투표 상태:', {
//     votes: gameState.votes,
//     livingPlayers,
//     selectedPlayer
//   });

//   return (
//     <VoteOverlay>
//       <VoteContainer>
//         {/* ... 기존 UI 코드 ... */}
//         <PlayerGrid>
//           {livingPlayers.map((player) => (
//             <PlayerCard
//               key={player.nickName}
//               onClick={() => handleVote(player.nickName)}
//               disabled={gameState.isDead || gameState.votes?.[currentNickname]}
//               $selected={selectedPlayer === player.nickName}
//               $selectable={!gameState.votes?.[currentNickname] && !gameState.isDead}
//             >
//               <PlayerName>{player.nickName}</PlayerName>
//               <VoteCount>
//                 {Object.values(gameState.votes || {}).filter(v => v === player.nickName).length}
//               </VoteCount>
//               {selectedPlayer === player.nickName && <SelectedMark>선택됨</SelectedMark>}
//             </PlayerCard>
//           ))}
//         </PlayerGrid>
        
//         <VoteStatus>
//           투표 현황: {Object.keys(gameState.votes || {}).length} / {livingPlayers.length}
//         </VoteStatus>
        
//         {/* 디버깅용 투표 현황 표시 */}
//         <div style={{ color: 'white', marginTop: '10px' }}>
//           {Object.entries(gameState.votes || {}).map(([voter, target]) => (
//             <div key={voter}>{voter} → {target}</div>
//           ))}
//         </div>
//       </VoteContainer>
//     </VoteOverlay>
//   );
// };


// const VoteOverlay = styled.div`
//   position: fixed;
//   inset: 0;
//   background: rgba(0, 0, 0, 0.7);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: ${Z_INDEX.OVERLAY};
// `;

// const VoteContainer = styled.div`
//   background: rgba(255, 255, 255, 0.1);
//   padding: 2rem;
//   border-radius: 1rem;
//   backdrop-filter: blur(8px);
//   width: 100%;
//   max-width: 900px;
//   margin: 0 2rem;
// `;

// const Header = styled.div`
//   text-align: center;
//   margin-bottom: 2rem;
// `;

// const Title = styled.h2`
//   color: white;
//   font-size: 2.5rem;
//   font-family: 'JejuHallasan';
//   margin-bottom: 0.5rem;
// `;

// const Timer = styled.p`
//   color: white;
//   font-size: 1.5rem;
//   font-family: 'JejuHallasan';
// `;

// const VoteStatus = styled.div`
//   color: white;
//   font-size: 1.2rem;
//   margin-top: 0.5rem;
//   font-family: 'JejuHallasan';
// `;

// const PlayerGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 1rem;
//   margin-bottom: 1.5rem;
// `;

// const PlayerCard = styled.button`
//   position: relative;
//   padding: 1.5rem;
//   border-radius: 0.5rem;
//   background: ${props => props.$selected ? 'rgba(34, 197, 94, 0.5)' : 'rgba(31, 41, 55, 0.5)'};
//   opacity: ${props => (props.$selected || props.disabled) ? 0.7 : 1};
//   transition: all 0.2s ease;
//   border: none;
//   cursor: ${props => props.$selectable ? 'pointer' : 'not-allowed'};

//   &:hover {
//     ${props => props.$selectable && `
//       background: rgba(55, 65, 81, 0.5);
//       transform: translateY(-2px);
//     `}
//   }
// `;

// const PlayerName = styled.h3`
//   color: white;
//   font-size: 1.25rem;
//   font-family: 'JejuHallasan';
// `;

// const VoteCount = styled.div`
//   position: absolute;
//   top: 0.5rem;
//   right: 0.5rem;
//   background: #FFD700;
//   color: black;
//   width: 1.5rem;
//   height: 1.5rem;
//   border-radius: 50%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: bold;
//   font-family: 'JejuHallasan';
// `;

// const SelectedMark = styled.div`
//   position: absolute;
//   bottom: 0.5rem;
//   right: 0.5rem;
//   background: rgba(34, 197, 94, 0.8);
//   color: white;
//   padding: 0.25rem 0.5rem;
//   border-radius: 0.25rem;
//   font-size: 0.875rem;
//   font-family: 'JejuHallasan';
// `;

// const VoteStatusGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(3, 1fr);
//   gap: 0.5rem;
//   margin-top: 1rem;
//   padding: 1rem;
//   background: rgba(0, 0, 0, 0.2);
//   border-radius: 0.5rem;
// `;

// const VoteStatusItem = styled.div`
//   color: white;
//   font-family: 'JejuHallasan';
//   text-align: center;
//   padding: 0.5rem;
// `;

// const DeadMessage = styled.p`
//   color: #FF6B6B;
//   text-align: center;
//   font-family: 'JejuHallasan';
//   font-size: 1.2rem;
//   margin-top: 1rem;
// `;

// const VoteMessage = styled.p`
//   color: #4CAF50;
//   text-align: center;
//   font-family: 'JejuHallasan';
//   font-size: 1.2rem;
//   margin-top: 1rem;
// `;

// export default VoteScreen;