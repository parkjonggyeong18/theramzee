// pages/forests/TwistedForest.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { backgroundImages } from '../../assets/images';
import GameLayout from '../../components/game/common/GameLayout';

// components import
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import MissionButton from '../../components/game/MissionButton';
import ColorMatchGame from '../../components/game/missions/ColorMatchGame';

const TwistedForest = () => {
 const { gameState, players } = useGame();
 const [showMiniGame, setShowMiniGame] = useState(false);
 const [completedMissions, setCompletedMissions] = useState([]);

 const handleMissionClick = (missionId) => {
   if (completedMissions.includes(missionId)) return;
   if (gameState.role === 'good' && gameState.fatigue < 1) return;
   setShowMiniGame(true);
 };

 const handleMissionComplete = () => {
   setCompletedMissions(prev => [...prev, 'colorMatch']);
   setShowMiniGame(false);
 };

 const gameLayoutProps = {
   // 기본 레이아웃 요소
   leftVideoGrid: <VideoGrid players={players} gridPosition="left" />,
   rightVideoGrid: <VideoGrid players={players} gridPosition="right" />,
   gameTimer: <GameTimer />,
   statePanel: <StatePanel />,
   myVideo: <MyVideo />,
   miniMap: <MiniMap />,
   
   // 미션 관련
   missionButtons: (
     <MissionButtons>
       <MissionButton 
         onClick={() => handleMissionClick('colorMatch')}
         completed={completedMissions.includes('colorMatch')}
       />
       <MissionButton disabled />
       <MissionButton disabled />
     </MissionButtons>
   ),
   
   // 미니게임 오버레이
   miniGameOverlay: showMiniGame && (
     <ColorMatchGame 
       onComplete={handleMissionComplete}
       onClose={() => setShowMiniGame(false)}
     />
   ),
   
   // 기타
   isGameStarted: gameState.isStarted,
   background: backgroundImages.twistedForest,
   mainForestButtons: null,  // 메인 숲 버튼 없음
   voteScreen: null         // 투표 화면 없음
 };

 return <GameLayout {...gameLayoutProps} />;
};

// MissionButtons styled-component만 유지
const MissionButtons = styled.div`
 display: flex;
 gap: 50px;
`;

export default TwistedForest;