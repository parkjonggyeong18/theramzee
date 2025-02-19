// import React, { useEffect, useRef, useState } from 'react';
// import styled from 'styled-components';
// import { useOpenVidu } from '../../../contexts/OpenViduContext';
// import goodSquirrel from '../../../assets/images/characters/good-squirrel.png';
// import { useKillSystem } from '../../../hooks/useKillSystem';
// import { useGame } from '../../../contexts/GameContext';
// import KillAnimation from './KillAnimation';
// import DeadOverlay from './DeadOverlay';

// const VideoGrid = (props) => {
//   const { session } = useOpenVidu();
//   const { gameState } = useGame();
//   const { killingPlayer, handleDragStart, isKillable, isDragging } = useKillSystem();
//   const [showDeadOverlay, setShowDeadOverlay] = useState(false);
//   const videoRefs = useRef({});
//   const subscribers = props.players || [];
//   const totalSlots = props.totalSlots;
  
//   // 슬롯 배열 생성 (빈 슬롯은 null로 채움)
//   const slots = Array.from({ length: totalSlots }, (_, i) => subscribers[i] || null);

//   // 죽은 플레이어 처리
//   useEffect(() => {
//     if (gameState.isDead && !showDeadOverlay) {
//       setShowDeadOverlay(true);
//     }
//   }, [gameState.isDead]);

//   useEffect(() => {
//     slots.forEach((player) => {
//       if (player?.stream?.connection?.connectionId) {
//         const connectionId = player.stream.connection.connectionId;
//         if (!videoRefs.current[connectionId]) {
//           videoRefs.current[connectionId] = React.createRef();
//         }
//       }
//     });

//     slots.forEach((player) => {
//       if (player?.stream?.connection?.connectionId) {
//         const connectionId = player.stream.connection.connectionId;
//         const videoElement = videoRefs.current[connectionId]?.current;
//         if (videoElement && !videoElement.dataset.assigned) {
//           player.addVideoElement(videoElement);
//           videoElement.dataset.assigned = "true";
//         }
//       }
//     });
//   }, [slots]);

//   if (!session) {
//     return <GridContainer>Loading...</GridContainer>;
//   }

//   return (
//     <GridContainer>
//       {slots.map((sub, idx) => {
//         const connectionId = sub?.stream?.connection?.connectionId;
        
//         // 플레이어 닉네임 추출
//         let playerNickname = '';
//         try {
//           const rawData = sub?.stream?.connection?.data.split("%/%")[0];
//           const playerData = JSON.parse(rawData);
//           playerNickname = playerData.clientData;
//         } catch (error) {
//           console.error("Error extracting nickname:", error);
//         }

//         // 플레이어가 죽었는지 확인
//         const isPlayerDead = gameState.killedPlayers?.includes(playerNickname);

//         return (
//           <VideoContainer
//             key={idx}
//             onMouseDown={(e) => isKillable && handleDragStart(e, playerNickname)}
//             style={{ cursor: isKillable ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
//           >
//             {connectionId ? (
//               <>
//                 <StyledVideo
//                   ref={(el) => {
//                     if (el && connectionId) {
//                       if (!videoRefs.current[connectionId]) {
//                         videoRefs.current[connectionId] = { current: el };
//                       } else {
//                         videoRefs.current[connectionId].current = el;
//                       }
//                     }
//                   }}
//                   autoPlay
//                   $isDead={isPlayerDead}
//                 />
//                 {isPlayerDead && <DeadIndicator>💀</DeadIndicator>}
//                 <PlayerName>{playerNickname}</PlayerName>
//               </>
//             ) : (
//               <ImageContainer>
//                 <PlaceholderImage 
//                   src={props.placeholderImage || goodSquirrel}
//                 />
//               </ImageContainer>
//             )}
//           </VideoContainer>
//         );
//       })}

//       {killingPlayer && <KillAnimation onAnimationEnd={() => setShowDeadOverlay(true)} />}
//       {showDeadOverlay && gameState.isDead && <DeadOverlay playerName={gameState.nickName} />}
//     </GridContainer>
//   );
// };

// const GridContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
//   justify-content: center;
//   gap: 10px;
//   padding: 0px;
//   opacity: 100%;
// `;

// const VideoContainer = styled.div`
//   position: relative;
//   width: 173px;
//   height: 130px;
//   border-radius: 15px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   overflow: hidden;
// `;

// const StyledVideo = styled.video`
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
//   transform: scaleX(-1);
//   max-width: 200px;
//   max-height: 150px;
//   opacity: ${props => props.$isDead ? '0.5' : '1'};
//   filter: ${props => props.$isDead ? 'grayscale(100%)' : 'none'};
// `;

// const PlaceholderImage = styled.img`
//   width: 100%;
//   height: 100%;
//   object-fit: cover;
//   opacity: 100%;
// `;

// const ImageContainer = styled.div`
//   width: 100%;
//   height: 100%;
//   background-color: white;
//   opacity: 80%;
// `;

// const DeadIndicator = styled.div`
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   font-size: 2rem;
//   color: white;
//   text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
// `;

// const PlayerName = styled.div`
//   position: absolute;
//   bottom: 5px;
//   left: 50%;
//   transform: translateX(-50%);
//   color: white;
//   background-color: rgba(0, 0, 0, 0.5);
//   padding: 2px 8px;
//   border-radius: 10px;
//   font-size: 0.8rem;
// `;

// export default VideoGrid;