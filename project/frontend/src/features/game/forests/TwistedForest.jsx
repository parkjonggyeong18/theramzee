// pages/forests/TwistedForest.jsx
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
import SnakeGame from '../components/missions/SnakeGame';

const TwistedForest = () => {
  const { gameState, players, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);

  const handleMissionClick = (missionId) => {
    if (completedMissions.includes(missionId)) return;
    if (gameState.evilSquirrel === true && gameState.fatigue < 1) return;
    setCurrentMission(missionId);
    setShowMiniGame(true);
  };

  const handleMissionComplete = async () => {
    try {
      // 뒤틀린 숲은 forestNum이 2
      // missionNum은 1, 2, 3 중 하나 (currentMission에 따라)
      const missionNum = currentMission === 'snake' ? 1 : 
                        currentMission === 'color' ? 2 : 3;
      
      await completeMission(2, missionNum);
      
      setCompletedMissions(prev => [...prev, currentMission]);
      setShowMiniGame(false);
      setCurrentMission(null);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
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
          onClick={() => handleMissionClick('snake')}
          completed={completedMissions.includes('snake')}
        />
        <MissionButton 
          onClick={() => handleMissionClick('color')}
          completed={completedMissions.includes('color')}
        />
        <MissionButton 
          onClick={() => handleMissionClick('puzzle')}
          completed={completedMissions.includes('puzzle')}
        />
      </MissionButtons>
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      <SnakeGame
        onComplete={handleMissionComplete}
        onClose={() => {
          setShowMiniGame(false);
          setCurrentMission(null);
        }}
      />
    ),
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.twistedForest,
    mainForestButtons: null,
    voteScreen: null
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  gap: 50px;
`;

export default TwistedForest;