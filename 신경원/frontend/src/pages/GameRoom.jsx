// pages/GameRoom.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../contexts/GameContext';

// components import 예정
import VideoGrid from '../components/game/VideoGrid';
import MyVideo from '../components/game/MyVideo';
import GameTimer from '../components/game/GameTimer';
import StatePanel from '../components/game/StatePanel';
import MainForestButtons from '../components/game/MainForestButtons';
import MiniMap from '../components/game/MiniMap';

import { backgroundImages, characterImages } from '../assets/images';

const GameRoom = () => {
 const navigate = useNavigate();
 const { gameState, setGameState } = useGame();

 const handleGameStart = () => {
   // 1인 테스트용 임시 로직
   const randomRole = Math.random() < 0.5 ? 'good' : 'bad';
   setGameState(prev => ({
     ...prev,
     isStarted: true,
     role: randomRole
   }));

   // 추후 6인용 로직
   /*
   if (players.length === 6) {
     const roles = ['bad', ...Array(5).fill('good')];
     const shuffledRoles = roles.sort(() => Math.random() - 0.5);
     // 역할 배정 로직
   }
   */
 };

 const handleExit = () => {
   navigate('/lobby');
 };

 // 커서 스타일 변경
 useEffect(() => {
   if (gameState.isStarted && gameState.role) {
    const cursorImage = gameState.role === 'good' ? characterImages.goodSquirrel : characterImages.badSquirrel;
    document.body.style.cursor = `url(${cursorImage}), auto`;
   } else {
     document.body.style.cursor = 'auto';
   }

   return () => {
     document.body.style.cursor = 'auto';
   };
 }, [gameState.isStarted, gameState.role]);

 return (
   <GameRoomContainer>
     <GameBackground />
     {!gameState.isStarted ? (
       <>
         <VideoGrid />
         <ButtonContainer>
           <StartButton onClick={handleGameStart}>GAME START</StartButton>
           <ExitButton onClick={handleExit}>나가기</ExitButton>
         </ButtonContainer>
       </>
     ) : (
       <>
         <TopSection>
           <GameTimer />
         </TopSection>

         <VideoSection>
           <VideoGrid />
           <StatePanel />
         </VideoSection>

         <MainForestButtons />
         
         <BottomSection>
           <MyVideo />
           <MiniMap />
         </BottomSection>
       </>
     )}
   </GameRoomContainer>
 );
};

const GameRoomContainer = styled.div`
 width: 100vw;
 height: 100vh;
 position: relative;
 overflow: hidden;
`;

const GameBackground = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url(${backgroundImages.mainForest});
 background-size: cover;
 background-position: center;
 z-index: -1;
`;

const TopSection = styled.div`
 position: absolute;
 top: 20px;
 left: 50%;
 transform: translateX(-50%);
`;

const VideoSection = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 20px;
 margin-top: 60px;
`;

const BottomSection = styled.div`
  position: absolute;
  bottom: 20px;
  width: calc(100% - 40px); // 좌우 여백 고려
  padding: 0 20px;
  display: flex;
  justify-content: space-between; // MyVideo와 MiniMap을 양쪽 끝으로
  align-items: flex-end;
  z-index: 10;
`;

const ButtonContainer = styled.div`
 position: absolute;
 top: 20px;
 right: 20px;
 display: flex;
 gap: 10px;
`;

const StartButton = styled.button`
 padding: 10px 20px;
 background-color: #90EE90;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 font-size: 1.2rem;
 font-family: 'JejuHallasan';

 &:hover {
   background-color: #98FB98;
 }
`;

const ExitButton = styled.button`
 padding: 10px 20px;
 background-color: #FF4444;
 color: white;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 font-size: 1.2rem;
 font-family: 'JejuHallasan';

 &:hover {
   background-color: #FF6666;
 }
`;

export default GameRoom;