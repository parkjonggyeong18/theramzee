// pages/forests/MainForest.jsx
import { useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import MainForestButtons from '../../components/game/MainForestButtons';
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import VoteScreen from '../../components/game/vote/VoteScreen';
import { backgroundImages } from '../../assets/images';

const MainForest = () => {
 const { gameState, startEmergencyVote, endVote } = useGame();

 const handleVoteEnd = (result) => {
  endVote(result);
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

       <MainForestButtons 
         onEmergencyClick={startEmergencyVote}
         emergencyDisabled={gameState.hasUsedEmergency}
       />

       <BottomSection>
         <MyVideo />
         <MiniMap />
       </BottomSection>

       {gameState.isVoting && (
         <VoteScreen 
           onVoteEnd={handleVoteEnd}
           isEmergency={gameState.isEmergencyVote}
         />
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

const BottomSection = styled.div`
 display: flex;
 justify-content: flex-end;
 align-items: flex-end;
 gap: 20px;
`;

export default MainForest;