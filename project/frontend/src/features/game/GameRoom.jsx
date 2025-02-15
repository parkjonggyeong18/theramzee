import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { useOpenVidu } from '../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../assets/images';
import { connectSocket, disconnectSocket } from '../../api/stomp';
import { useGameHandlers } from '../../handlers/gameHandlers';
import { subscribeToTopic } from '../../api/stomp';
import { leaveRoom } from '../../api/room';
// 공통 레이아웃 import
import GameLayout from './components/common/GameLayout';
import RoleReveal from './components/RoleReveal';

// components import
import VideoGrid from './components/VideoGrid';
import MyVideo from './components/MyVideo';
import GameTimer from './components/GameTimer';
import StatePanel from './components/StatePanel';
import MainForestButtons from './components/MainForestButtons';
import MiniMap from './components/MiniMap';

const GameRoom = () => {
  const navigate = useNavigate();
  const [showRoleReveal, setShowRoleReveal] = useState(false);

  const { 
    gameState, 
    startGame, 
    players,
    setRoomId,
    setIsConnected,
    setGameState,
  } = useGame();

  const {
    joinSession,
    subscribers,
    leaveSession,
    initPreview
  } = useOpenVidu();


  const { roomId } = useParams();  // roomId 가져오기
  const handlers = useGameHandlers(roomId, setGameState, joinSession);
  const isSubscribed = useRef(false); // 중복 실행 방지 플래그
  const nickName = sessionStorage.getItem('nickName')
  const roomHost = sessionStorage.getItem('roomHost') || null;


  useEffect(() => {
    setRoomId(roomId);
    if (!roomId) {
      console.error("⚠️ roomId is missing.");
      return;
    }
    
    setGameState((prev) => ({
      ...prev,
      roomId: roomId,
    }));

    const connectAndSubscribe = async () => {
      try {
        if (isSubscribed.current) return; // 이미 구독된 경우 실행하지 않음
        isSubscribed.current = true; // 구독 상태 설정

        await connectSocket();
        setIsConnected(true);

        setTimeout(() => {
          console.log("📌 Subscribing to game topics...");
          subscribeToTopic(`/topic/game/${roomId}/start`, (response) => {
            handlers.handleGameStartResponse(response);
            setShowRoleReveal(true); // 역할 공개 화면 활성화
          });
          subscribeToTopic(`/topic/game/${roomId}/emergency`, handlers.handleEmergencyResponse);
          subscribeToTopic(`/topic/game/${roomId}/move`, handlers.handleMoveResponse);
          subscribeToTopic(`/topic/game/${roomId}/save-acorns`, handlers.handleSaveAcornsResponse);
          subscribeToTopic(`/user/queue/game/${roomId}/charge-fatigue`, handlers.handleChargeFatigueResponse);
          subscribeToTopic(`/topic/game/${roomId}/kill`, handlers.handleKillResponse);
          subscribeToTopic(`/topic/game/${roomId}/complete-mission`, handlers.handleCompleteMissionResponse);
          subscribeToTopic(`/topic/game/${roomId}/out`, handlers.handleOutResponse);
        }, 100);
      } catch (error) {
        console.error("⚠️ Failed to connect or subscribe:", error);
      }
    };

    connectAndSubscribe();
  }, [roomId]);

  const clkStart = () => {
    startGame();
  };

  const clkExit = () => {
    disconnectSocket();
    leaveRoom(roomId);
    leaveSession();
    initPreview();
    navigate('/rooms');
  };

  const leftCam = subscribers.slice(0, 3);
  console.log("leftPlayers:", leftCam);
  const rightCam = subscribers.slice(3, 7);
  console.log("rightPlayers:", rightCam);


  // GameLayout에 전달할 컴포넌트들
  const gameLayoutProps = {
      
    leftVideoGrid: <VideoGrid players={leftCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightCam} totalSlots={2} gridPosition="right" />,

    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    buttonContainer: (
      <ButtonContainer>
        <StartButton 
          onClick={clkStart} 
          disabled={roomHost !== "true"}
        >
          GAME START
        </StartButton>
        <ExitButton onClick={clkExit}>나가기</ExitButton>
      </ButtonContainer>  
    ),
    myVideo: <MyVideo />,
    mainForestButtons: <MainForestButtons />,
    miniMap: <MiniMap />,
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    miniGameOverlay: null,   // GameRoom에서는 미니게임 없음
    voteScreen: null        // GameRoom에서는 투표 화면 없음
  };

  return (
    <>
      <GameLayout {...gameLayoutProps} />
      {showRoleReveal && <RoleReveal roomId={roomId} />}
    </>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StartButton = styled.button`
  padding: 10px 20px;
  background-color: #90EE90;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';

  &:hover {
    background-color: #98FB98;
  }

  &:disabled {
    background-color: #d3d3d3;
    cursor: not-allowed;
  }
`;


const ExitButton = styled.button`
  padding: 10px 20px;
  background-color: #FF4444;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';

  &:hover {
    background-color: #FF6666;
  }
`;

export default GameRoom;