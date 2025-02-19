import { useState, useEffect } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import { useNavigate, useParams } from 'react-router-dom';
import GameOverScreen from '../components/GameOverScreen';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MainForestButtons from '../components/MainForestButtons';
import MiniMap from '../components/MiniMap';
import EmergencyVoteModal from '../../game/components/vote/EmergencyVoteModal';
import FinalVoteModal from '../../game/components/vote/FinalVoteModal';
import { leaveRoom } from '../../../api/room';
import { disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';
const MainForest = () => {
  const { 
    gameState, 
    players, 
  } = useGame();

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
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
  const currentForestUser = gameState.forestUsers?.[currentForestNum];

  const filteredSubscribers = subscribers.filter(sub => {
    try {
      const rawData = sub.stream.connection.data.split("%/%")[0];
      const subData = JSON.parse(rawData);
      const subscriberNickname = subData.clientData;
      return currentForestUser?.includes(subscriberNickname);
    } catch (error) {
      return false;
    }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);

  // 커서 효과 설정
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
        
    // 공통 종료 처리 함수
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

  const handleExitGame = () => {
    navigate('/rooms');
  };

  const gameLayoutProps = {
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,
    mainForestButtons: <MainForestButtons />,
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    missionButtons: null,
    miniGameOverlay: null,
    isDescriptionVisible,
    onShowDescription: () => setIsDescriptionVisible(true),
    onHideDescription: () => setIsDescriptionVisible(false),
    
  };

  return (
    <>
      {gameState.isGameOver ? (
        <GameOverScreen onExit={handleExitGame} />
      ) : (
        <>
          <GameLayout {...gameLayoutProps} />
          {gameState.isVoting && gameState.isEmergencyVote && (
            <EmergencyVoteModal
              isOpen={gameState.isVoting && !gameState.isDead}
              players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
              roomId={roomId}
            />
          )}
          {gameState.isVoting && !gameState.isEmergencyVote && (
            <FinalVoteModal
              isOpen={gameState.isVoting && !gameState.isDead}
              players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
              roomId={roomId}
            />
          )}
        </>
      )}
    </>
  );
};

export default MainForest;