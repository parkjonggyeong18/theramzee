// pages/forests/TwistedForest.jsx
import { useState,useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages,characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MiniMap from '../components/MiniMap';
import MissionButton from '../components/MissionButton';
import SnakeGame from '../components/missions/SnakeGame';
import MatchingGame from '../components/missions/MatchingGame';



const TwistedForest = () => {
  const { gameState, players, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  
  const showDescriptionOverlay = () => setIsDescriptionVisible(true);
  const hideDescriptionOverlay = () => setIsDescriptionVisible(false);
    const {
      joinSession,
      subscribers,
    } = useOpenVidu();
   
    // 현재 사용자가 위치한 숲 번호 가져오기
    const currentForestNum = gameState.forestNum;
    const currentForestUser = gameState.forestUsers?.[currentForestNum]; // 배열열
  
    const filteredSubscribers = subscribers.slice().reverse().filter(sub => {
      try {
        const rawData = sub.stream.connection.data.split("%/%")[0];
        const subData = JSON.parse(rawData);
        const subscriberNickname = subData.clientData;
        return currentForestUser?.includes(subscriberNickname);
      } catch (error) {
        console.error("🚨 OpenVidu 데이터 파싱 오류:", error);
        return false;
      }
    }).reverse();

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);
 
  
  
  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'snake' ? 1 : 
                      missionId === 'matching' ? 2 : 3;
    return gameState[`2_${missionNum}`][0]; // gameState에서 미션 완료 상태 확인
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
      const missionNum = currentMission === 'snake' ? 1 : 
                        currentMission === 'matching' ? 2 : 3;
      
      await completeMission(2, missionNum);
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
    // 기본 레이아웃 요소
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    
    // 미션 관련
    missionButtons: (
      <MissionButtons>
      <MissionButtonWrapper style={{ top: '160px', right: '450px' }}>
        <MissionButton 
          onClick={() => handleMissionClick('snake')}
          completed={isMissionCompleted('snake')}
        />
      </MissionButtonWrapper>
      <MissionButtonWrapper style={{ top: '185px', left: '500px' }}>
        <MissionButton 
          onClick={() => handleMissionClick('matching')}
          completed={isMissionCompleted('matching')}
        />
      </MissionButtonWrapper>
      <MissionButtonWrapper style={{ bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
        <MissionButton isDisabled />
      </MissionButtonWrapper>
    </MissionButtons>
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      currentMission === 'snake' ? (
        <SnakeGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : currentMission === 'matching' ? (
        <MatchingGame
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
    background: backgroundImages.twistedForest,
    mainForestButtons: null,
    voteScreen: null,

    isDescriptionVisible,
    onShowDescription: showDescriptionOverlay,
    onHideDescription: hideDescriptionOverlay,

    
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  position: relative;
  justify-content: center;
  width: 100%;
  height: 100px; // 버튼 컨테이너의 높이 조정
`;

const MissionButtonWrapper = styled.div`
  position: absolute;
`;

export default TwistedForest;