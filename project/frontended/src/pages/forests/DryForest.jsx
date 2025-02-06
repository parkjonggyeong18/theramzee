import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import MissionButton from '../../components/game/MissionButton';
import FireGame from 'components/game/missions/FireGame';
import ArrowPuzzleGame from 'components/game/missions/ArrowPuzzleGame';
import { backgroundImages } from '../../assets/images';


const DryForest = () => {
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
            onClick={() => handleMissionClick('arrow')}
            completed={completedMissions.includes('arrow')}
          />
          <MissionButton 
            onClick={() => handleMissionClick('fire')}
            completed={completedMissions.includes('fire')}
          />
          <MissionButton disabled />
        </MissionButtons>

        <BottomSection>
          <MyVideo />
          <MiniMap />
        </BottomSection>

        {currentMiniGame === 'arrow' && (
          <MiniGameOverlay>
            <ArrowPuzzleGame
              onComplete={() => handleMissionComplete('arrow')}
              onClose={() => setCurrentMiniGame(null)}
            />
          </MiniGameOverlay>
        )}

        {currentMiniGame === 'fire' && (
          <MiniGameOverlay>
            <FireGame
              onComplete={() => handleMissionComplete('fire')}
              onClose={() => setCurrentMiniGame(null)}
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
  background-image: url(${backgroundImages.dryForest});
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
    display: flex; /* ✅ 수평 정렬을 위한 플렉스박스 적용 */
  gap: 20px;      /* ✅ 타이머와 비디오 사이 간격 추가 */
  align-items: center; /* ✅ 수직 정렬 */
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
  justify-content: flex-start;
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