// pages/forests/DryForest.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { backgroundImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import MissionButton from '../components/MissionButton';
import EmptyMissionOverlay from '../components/missions/EmptyMissionOverlay';

const DryForest = () => {
  const { gameState, players } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [completedMissions, setCompletedMissions] = useState([]);

  const handleMissionClick = (missionId) => {
    if (completedMissions.includes(missionId)) return;
    if (gameState.evilSquirrel === true && gameState.fatigue < 1) return;
    setShowMiniGame(true);
  };

  const handleMissionComplete = () => {
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
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      <EmptyMissionOverlay 
        onClose={() => setShowMiniGame(false)}
      />
    ),
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.dryForest,
    mainForestButtons: null,
    voteScreen: null
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  gap: 50px;
`;

export default DryForest;