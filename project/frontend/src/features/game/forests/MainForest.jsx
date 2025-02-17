import { useState, useEffect } from 'react';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import { useNavigate, useParams } from 'react-router-dom';
import GameOverScreen from '../components/GameOverScreen';
import { subscribeToTopic, unsubscribeTopic } from '../../../api/stomp';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MainForestButtons from '../components/MainForestButtons';
import MiniMap from '../components/MiniMap';
import EmergencyVoteModal from '../../game/components/vote/EmergencyVoteModal';

const MainForest = () => {
  const { 
    gameState, 
    players, 
    setGameState 
  } = useGame();

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();

  const {
    subscribers,
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
      console.error("🚨 OpenVidu 데이터 파싱 오류:", error);
      return false;
    }
  });

  const leftFilterCam = filteredSubscribers.slice(0, 3);
  const rightFilterCam = filteredSubscribers.slice(3, 7);

  // 커서 효과 설정
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
        </>
      )}
    </>
  );
};

export default MainForest;