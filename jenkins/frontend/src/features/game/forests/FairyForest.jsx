// pages/forests/FairyForest.jsx
import { useState,useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { backgroundImages,characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import MissionButton from '../components/MissionButton';
import FlowerGame from '../components/missions/FlowerGame';
import FishingGame from '../components/missions/FishingGame';


const FairyForest = () => {
  const { gameState, players, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'flower' ? 1 : 
                      missionId === 'fishing' ? 2 : 3;
    return gameState[`4_${missionNum}`][0]; // gameState에서 미션 완료 상태 확인
  };
  const handleMissionClick = (missionId) => {
    if (isMissionCompleted(missionId)) return;
    if (gameState.fatigue < 1) return;
    setCurrentMission(missionId);
    setShowMiniGame(true);
  };


  const handleMissionComplete = async () => {
    try {
      const missionNum = currentMission === 'flower' ? 1 : 
                        currentMission === 'fishing' ? 2 : 3;
      
      await completeMission(4, missionNum);
      setShowMiniGame(false);
      setCurrentMission(null);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };
  useEffect(() => {
    if (gameState.isStarted && gameState.evilSquirrel !== null) {
      const cursorImage = gameState.evilSquirrel ? characterImages.badSquirrel : characterImages.goodSquirrel;
      document.body.style.cursor = `url("${cursorImage}") 16 16, auto`;
      console.log('✅ 커서 변경:', cursorImage);
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.isStarted, gameState.evilSquirrel]);
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
          onClick={() => handleMissionClick('flower')}
          completed={isMissionCompleted('flower')}
        />
        <MissionButton 
          onClick={() => handleMissionClick('fishing')}
          completed={isMissionCompleted('fishing')}
        />
        <MissionButton isDisabled
    
        />
      </MissionButtons>
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      currentMission === 'flower' ? (
        <FlowerGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : currentMission === 'fishing' ? (
        <FishingGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : null
    ),
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.fairyForest,
    mainForestButtons: null,
    voteScreen: null
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  gap: 50px;
`;

export default FairyForest;