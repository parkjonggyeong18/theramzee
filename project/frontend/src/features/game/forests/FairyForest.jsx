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
import FlowerGame from '../components/missions/FlowerGame';
import FishingGame from '../components/missions/FishingGame';
import FairyCatchingGame from '../components/missions/FairyCatchingGame';
import flower from '../../../assets/images/object/fairy.png'
import fish from '../../../assets/images/object/fish.png'
import fairy from '../../../assets/images/object/fairy2.png'
import { leaveRoom } from '../../../api/room';
import { disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
const FairyForest = () => {
  const { gameState, completeMission } = useGame();
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [currentMission, setCurrentMission] = useState(null);
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [isForestTransitioning, setIsForestTransitioning] = useState(false);
  
  const showDescriptionOverlay = () => setIsDescriptionVisible(true);
  const hideDescriptionOverlay = () => setIsDescriptionVisible(false);
  
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { handleLogout2 } = useAuth();
  const {
    subscribers,
    leaveSession,
    initPreview
  } = useOpenVidu();
   
    // 현재 사용자가 위치한 숲 번호 가져오기
    const currentForestNum = gameState.forestNum;
    const currentForestUser = gameState.forestUsers?.[currentForestNum]; // 배열

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
          // 🔥 JSON 데이터와 추가 문자열(`%/%닉네임`) 분리
          const rawData = sub.stream.connection.data.split("%/%")[0]; 
          const subData = JSON.parse(rawData); // {"clientData": "test1"}
          const subscriberNickname = subData.clientData;
  
          // 🔥 현재 숲에 속한 유저(`currentForestUser`)와 일치하는 경우만 필터링
          return currentForestUser.includes(subscriberNickname);
      } catch (error) {
          return false; // 파싱 실패한 경우 필터링에서 제외
      }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);
 
  const isMissionCompleted = (missionId) => {
    const missionNum = missionId === 'flower' ? 1 : 
                      missionId === 'fishing' ? 2 : 3;
    return gameState[`4_${missionNum}`][0]; // gameState에서 미션 완료 상태 확인
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
    const handleBeforeUnload = () => { 
          handleExit2();
    
        };
            const handleExit2 = () => {
              disconnectSocket();
              leaveRoom(roomId);
              leaveSession();
              initPreview();
              handleLogout2();
            }
    if (gameState.isStarted && gameState.evilSquirrel !== null) {
      const cursorImage = gameState.evilSquirrel ? characterImages.badSquirrel : characterImages.goodSquirrel;
      document.body.style.cursor = `url("${cursorImage}") 16 16, auto`;
    } else {
      document.body.style.cursor = 'auto';
    }

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameState.isStarted, gameState.evilSquirrel,roomId, navigate]);
  
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
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('flower')}
            completed={isMissionCompleted('flower')}
          >
            <MissionImage src={flower} alt="flower mission" />
            {isMissionCompleted('flower') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('fishing')}
            completed={isMissionCompleted('fishing')}
          >
            <MissionImage src={fish} alt="fishing mission" />
            {isMissionCompleted('fishing') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
        <MissionButtonWrapper>
          <StyledMissionButton 
            onClick={() => handleMissionClick('fairy')}
            completed={isMissionCompleted('fairy')}
          >
            <MissionImage src={fairy} alt="fairy mission" />
            {isMissionCompleted('fairy') && <CompletedOverlay>✓</CompletedOverlay>}
          </StyledMissionButton>
        </MissionButtonWrapper>
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
      ) : currentMission === 'fairy' ? (
        <FairyCatchingGame
          onComplete={handleMissionComplete}
          onClose={() => {
            setShowMiniGame(false);
            setCurrentMission(null);
          }}
        />
      ) :null
    ),
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.fairyForest,
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
  background: url('/path/to/transition3.gif') center center no-repeat;
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
  &:nth-child(1) {
    top: -12vh;
    right: 20vw;
  }
  &:nth-child(2) {
    top: 27vh;
    right: 4vw;
  }
  &:nth-child(3) {
    bottom: 5vh;
    left: 80vh;
    transform: translateX(-50%);
  }
`;

const StyledMissionButton = styled.button`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
  background: transparent;
  border: none;
  padding: 0;
  opacity: ${props => props.completed ? 0.5 : 1};
  cursor: ${props => props.completed ? 'not-allowed' : 'pointer'};
  
  &:hover {
    transform: ${props => props.completed ? 'none' : 'scale(1.1)'};
  }
`;

const MissionImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const CompletedOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: red;
  font-size: 70px;
`;

export default FairyForest;