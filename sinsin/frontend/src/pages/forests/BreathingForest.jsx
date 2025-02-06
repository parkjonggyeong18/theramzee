// pages/forests/BreathingForest.jsx
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

const BreathingForest = () => {
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
    setCompletedMissions(prev => [...prev, 'mission1']);
  };

  return (
    <ForestContainer>
      <BackgroundImage src="/src/assets/images/backgrounds/breathing-forest.png" />
      <GameTimer />
      <StatePanel />
      <MiniMap />
      <VideoGrid />
      <MyVideo />
      <MissionButton onClick={() => handleMissionClick('mission1')} completed={completedMissions.includes('mission1')} />
      {showMiniGame && <EmptyMissionOverlay onClose={() => setShowMiniGame(false)} />}
    </ForestContainer>
  );
};

const ForestContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

export default BreathingForest;