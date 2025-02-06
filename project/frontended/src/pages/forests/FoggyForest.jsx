// pages/forests/FoggyForest.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import MissionButton from '../../components/game/MissionButton';
import ShadowGame from 'components/game/missions/ShadowGame';
import HiddenDoorGame from 'components/game/missions/HiddenDoorGame';
import { backgroundImages } from '../../assets/images';


const FoggyForest = () => {
  const { gameState, setGameState } = useGame();
  const [currentMiniGame, setCurrentMiniGame] = useState(null);  // 현재 미니게임 상태 추가
  const [completedMissions, setCompletedMissions] = useState([]);

  const handleMissionClick = (missionId) => {
    if (completedMissions.includes(missionId)) return;
    if (gameState.role === 'good' && gameState.fatigue < 1) {
      alert("피로도가 부족하여 미션을 수행할 수 없습니다.");
      return;
    }
    setCurrentMiniGame(missionId);  // 클릭한 미션 ID 저장
  };

  const handleMissionComplete = (missionId) => {
    setCompletedMissions(prev => [...prev, missionId]);  // 해당 미션만 완료 처리
    setCurrentMiniGame(null);  // 미니게임 종료
    if (gameState.role === 'good') {  // 착한 다람쥐일 때만 피로도 감소
      setGameState(prev => ({
        ...prev,
        fatigue: Math.max(0, prev.fatigue - 1)
      }));
    }
  
  };

  return (
    <FoggyContainer>
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
            onClick={() => handleMissionClick('hiddendoor')}
            completed={completedMissions.includes('hiddendoor')}
          />
          <MissionButton 
            onClick={() => handleMissionClick('shadow')}
            completed={completedMissions.includes('shadow')}
          />
          <MissionButton disabled />
        </MissionButtons>

        <BottomSection>
          <MyVideo />
          <MiniMap />
        </BottomSection>

        {currentMiniGame === 'hiddendoor' && (
          <MiniGameOverlay>
            <HiddenDoorGame
              onComplete={() => handleMissionComplete('hiddendoor')}
              onClose={() => setCurrentMiniGame(null)}
            />
          </MiniGameOverlay>
        )}

        {currentMiniGame === 'shadow' && (
          <MiniGameOverlay>
            <ShadowGame
              onComplete={() => handleMissionComplete('shadow')}
              onClose={() => setCurrentMiniGame(null)}
            />
          </MiniGameOverlay>
        )}
      </ContentSection>
    </FoggyContainer>
  );
};

// 기존 스타일드 컴포넌트들과 동일
const FoggyContainer = styled.div`
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
 background-image: url(${backgroundImages.foggyForest});
 background-size: cover;
 background-position: center;
 z-index: -1;
`;

// 안개 효과를 위한 추가 스타일
const FogOverlay = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(255, 255, 255, 0.3);
 backdrop-filter: blur(5px);
 z-index: 0;
`;

// 나머지 스타일드 컴포넌트 추가
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
 position: relative;
 z-index: 1;
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

export default FoggyForest;