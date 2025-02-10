import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { backgroundImages, characterImages } from '../../assets/images';
import { connectSocket, disconnectSocket } from '../../api/stomp';

// 공통 레이아웃 import
import GameLayout from './components/common/GameLayout';

// components import
import VideoGrid from './components/VideoGrid';
import MyVideo from './components/MyVideo';
import GameTimer from './components/GameTimer';
import StatePanel from './components/StatePanel';
import MainForestButtons from './components/MainForestButtons';
import MiniMap from './components/MiniMap';

const GameRoom = () => {
  const navigate = useNavigate();
  const { 
    gameState, 
    startGame,   // startGame 함수 사용
    players,
    setRoomId,
    setIsConnected,
    setGameState,
  } = useGame();
  const { roomId } = useParams();  // roomId 가져오기

  useEffect(() => {
    setRoomId(roomId);
    setGameState((prev) => ({
      ...prev,
      roomId: roomId,
      nickName: sessionStorage.getItem('nickName'),
    }));
    connectSocket();
    setIsConnected(true);
  }, []);

  const clkStart = () => {
    startGame();
    navigate(`/game/${roomId}/main`);
  };

  const clkExit = () => {
    disconnectSocket();
    navigate('/lobby');
  };

  // 커서 스타일 변경
  useEffect(() => {
    if (gameState.isStarted && gameState.evilSquirrel) {
      document.body.style.cursor = `url(${gameState.evilSquirrel === false ? characterImages.goodSquirrel : characterImages.badSquirrel}), auto`;
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.isStarted, gameState.evilSquirrel]);

  // GameLayout에 전달할 컴포넌트들
  const gameLayoutProps = {
    leftVideoGrid: <VideoGrid players={players} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={players} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    buttonContainer: (
      <ButtonContainer>
        <StartButton onClick={clkStart}>GAME START</StartButton>
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

  return <GameLayout {...gameLayoutProps} />;
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