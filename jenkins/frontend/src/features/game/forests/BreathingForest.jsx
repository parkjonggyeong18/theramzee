import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import MissionButton from '../components/MissionButton';
import MazeGame from '../components/missions/MazeGame';
import VineSlashGame from '../components/missions/VineSlashGame';

const BreathingForest = () => {
  const { gameState, players, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isForestTransitioning, setIsForestTransitioning] = useState(false);
  
  const showDescriptionOverlay = () => setIsDescriptionVisible(true);
  const hideDescriptionOverlay = () => setIsDescriptionVisible(false);
  const { joinSession, subscribers } = useOpenVidu();
  
  const currentForestNum = gameState.forestNum;
  const currentForestUser = gameState.forestUsers?.[currentForestNum];

  // 숲 이동 시 전환 애니메이션: forestNum 변경 시 1초 전환
  useEffect(() => {
    setIsForestTransitioning(true);
    const timer = setTimeout(() => {
      setIsForestTransitioning(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentForestNum]);
  
  const filteredSubscribers = subscribers.filter(sub => {
    try {
      const rawData = sub.stream.connection.data.split("%/%")[0];
      const subData = JSON.parse(rawData);
      const subscriberNickname = subData.clientData;
      return currentForestUser?.includes(subscriberNickname);
    } catch (error) {
      console.error("🚨 OpenVidu 데이터 파싱 오류:", error);
      return false;
    }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);

  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'maze' ? 1 : missionId === 'vine' ? 2 : 3;
    return gameState[`7_${missionNum}`][0];
  };

  const handleMissionClick = (missionId) => {
    if (isMissionCompleted(missionId)) return;
    if (gameState.fatigue < 1) return;
    if (gameState.evilSquirrel) return;
    setCurrentMission(missionId);
    setShowMiniGame(true);
  };

  const handleMissionComplete = async () => {
    try {
      const missionNum = currentMission === 'maze' ? 1 : currentMission === 'vine' ? 2 : 3;
      await completeMission(7, missionNum);
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
    } else {
      document.body.style.cursor = 'auto';
    }
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.isStarted, gameState.evilSquirrel]);
  const gameLayoutProps = {
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    missionButtons: (
      <MissionButtons>
        <MissionButtonWrapper style={{ top: '210px', right: '-560px' }}>
          <MissionButton onClick={() => handleMissionClick('maze')} completed={isMissionCompleted('maze')} />
        </MissionButtonWrapper>
        <MissionButtonWrapper style={{ top: '30px', right: '290px' }}>
          <MissionButton onClick={() => handleMissionClick('vine')} completed={isMissionCompleted('vine')} />
        </MissionButtonWrapper>
        <MissionButtonWrapper style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
          <MissionButton isDisabled />
        </MissionButtonWrapper>
      </MissionButtons>
    ),
    miniGameOverlay: showMiniGame && (
      currentMission === 'maze' ? (
        <MazeGame onComplete={handleMissionComplete} onClose={() => { setShowMiniGame(false); setCurrentMission(null); }} />
      ) : currentMission === 'vine' ? (
        <VineSlashGame onComplete={handleMissionComplete} onClose={() => { setShowMiniGame(false); setCurrentMission(null); }} />
      ) : null
    ),
    isGameStarted: gameState.isStarted,
    background: backgroundImages.breathingForest,
    mainForestButtons: null,
    voteScreen: null,
    isDescriptionVisible,
    onShowDescription: showDescriptionOverlay,
    onHideDescription: hideDescriptionOverlay,
  };

  return (
    <>
      <GameLayout {...gameLayoutProps}>
        {isForestTransitioning && <TransitionOverlay />}
      </GameLayout>
      {/* RoleReveal 등의 추가 컴포넌트가 있을 수 있음 */}
    </>
  );
};

const TransitionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: url('/path/to/transition.gif') center center no-repeat;
  background-size: cover;
  z-index: 9999;
`;

const MissionButtons = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100px;
`;

const MissionButtonWrapper = styled.div`
  position: absolute;
`;

export default BreathingForest;
