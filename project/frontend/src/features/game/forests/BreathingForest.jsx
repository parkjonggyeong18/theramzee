// pages/forests/BreathingForest.jsx
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
import MazeGame from '../components/missions/MazeGame';
import VineSlashGame from '../components/missions/VineSlashGame';


const BreathingForest = () => {
  const { gameState, players, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [completedMissions, setCompletedMissions] = useState([]);

  const {
    joinSession,
    subscribers,
  } = useOpenVidu();
 
  // 현재 사용자가 위치한 숲 번호 가져오기
  const currentForestNum = gameState.forestNum;
  console.log('currentForestNum:', currentForestNum);
  const currentForestUser = gameState.forestUsers?.[currentForestNum]; // 배열열
  console.log('currentForestUser:', currentForestUser);

  const filteredSubscribers = subscribers.filter(sub => {
    try {
        // 🔥 JSON 데이터와 추가 문자열(`%/%닉네임`) 분리
        const rawData = sub.stream.connection.data.split("%/%")[0]; 
        const subData = JSON.parse(rawData); // {"clientData": "test1"}
        const subscriberNickname = subData.clientData;

        // 🔥 현재 숲에 속한 유저(`currentForestUser`)와 일치하는 경우만 필터링
        return currentForestUser?.includes(subscriberNickname);
    } catch (error) {
        console.error("🚨 OpenVidu 데이터 파싱 오류:", error);
        return false; // 파싱 실패한 경우 필터링에서 제외
    }
});

 const leftFilterCam = filteredSubscribers.slice(0, 3);
 const rightFilterCam = filteredSubscribers.slice(3, 7);

    
  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'maze' ? 1 : 
                      missionId === 'vine' ? 2 : 3;
    return gameState[`7_${missionNum}`][0]; // gameState에서 미션 완료 상태 확인
  };

  const handleMissionClick = (missionId) => {
    if (isMissionCompleted(missionId)) return;
    if (gameState.fatigue < 1) return;
    setCurrentMission(missionId);
    setShowMiniGame(true);
  };


  const handleMissionComplete = async () => {
    try {
      const missionNum = currentMission === 'maze' ? 1 : 
                        currentMission === 'vine' ? 2 : 3;
      
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
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    
    // 미션 관련
    missionButtons: (
      <MissionButtons>
        <MissionButton 
          onClick={() => handleMissionClick('maze')}
          completed={isMissionCompleted('maze')}
        />
        <MissionButton 
          onClick={() => handleMissionClick('vine')}
          completed={isMissionCompleted('vine')}
        />
        <MissionButton isDisabled
    
        />
      </MissionButtons>
    ),
    
    // 미니게임 오버레이
    miniGameOverlay: showMiniGame && (
      currentMission === 'maze' ? (
        <MazeGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) : currentMission === 'vine' ? (
        <VineSlashGame
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
    background: backgroundImages.breathingForest,
    mainForestButtons: null,
    voteScreen: null
  };

  return <GameLayout {...gameLayoutProps} />;
};

const MissionButtons = styled.div`
  display: flex;
  gap: 50px;
`;

export default BreathingForest;