// pages/forests/DryForest.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import MissionButton from '../../components/game/MissionButton';
import EmptyMissionOverlay from '../../components/game/missions/EmptyMissionOverlay';

const DryForest = () => {
 const { gameState } = useGame();
 const [showMiniGame, setShowMiniGame] = useState(false);
 const [completedMissions, setCompletedMissions] = useState([]);

 const handleMissionClick = (missionId) => {
   if (completedMissions.includes(missionId)) return;
   if (gameState.role === 'good' && gameState.fatigue < 1) return;
   setShowMiniGame(true);
 };

 const handleMissionComplete = () => {
   setShowMiniGame(false);
 };

 return (
   <ForestContainer>
     <BackgroundImage />
     
     <TopSection>
       <GameTimer />
     </TopSection>

     <ContentSection>
       <VideoSection>
         <VideoGrid />
         <StatePanel />
       </VideoSection>

       <MissionButtons>
         <MissionButton 
           onClick={() => handleMissionClick('fireOff')}
           completed={completedMissions.includes('fireOff')}
         />
         <MissionButton 
           onClick={() => handleMissionClick('shadowArrow')}
           completed={completedMissions.includes('shadowArrow')}
         />
         <MissionButton 
           onClick={() => handleMissionClick('findAcorn')}
           completed={completedMissions.includes('findAcorn')}
         />
       </MissionButtons>

       <BottomSection>
         <MyVideo />
         <MiniMap />
       </BottomSection>

       {showMiniGame && (
         <MiniGameOverlay>
           <EmptyMissionOverlay 
             onClose={() => setShowMiniGame(false)}
           />
         </MiniGameOverlay>
       )}
     </ContentSection>
   </ForestContainer>
 );
};

const ForestContainer = styled.div`
 width: 100vw;
 height: 100vh;
 position: relative;
 overflow: hidden;
`;

const BackgroundImage = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url('/src/assets/images/backgrounds/dry-forest.png');
 background-size: cover;
 background-position: center;
 z-index: -1;
`;

const TopSection = styled.div`
 position: absolute;
 top: 20px;
 left: 50%;
 transform: translateX(-50%);
 z-index: 1;
`;

const ContentSection = styled.div`
 height: 100%;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 padding: 80px 20px 20px;
`;

const VideoSection = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
`;

const MissionButtons = styled.div`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 display: flex;
 gap: 50px;
`;

const BottomSection = styled.div`
 display: flex;
 justify-content: flex-end;
 align-items: flex-end;
 gap: 20px;
`;

const MiniGameOverlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.8);
 z-index: 1000;
 display: flex;
 justify-content: center;
 align-items: center;
`;

export default DryForest;