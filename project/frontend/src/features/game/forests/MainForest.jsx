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
import FinalVoteModal from '../../game/components/vote/FinalVoteModal';
import { leaveRoom } from '../../../api/room';
import { connectSocket, disconnectSocket } from '../../../api/stomp';
import { useAuth } from '../../../contexts/AuthContext';
const MainForest = () => {
  const { 
    gameState, 
    players, 
    setGameState,
    endVote 
  } = useGame();

  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { handleLogout, handleLogout2 } = useAuth();
  const {
    subscribers,
    leaveSession,
    initPreview
  } = useOpenVidu();

  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showLastVoteModal, setShowLastVoteModal] = useState(false);
  const nickName = sessionStorage.getItem('nickName');
  const [timeLeft, setTimeLeft] = useState(60);
  const [lastTimeLeft, setLastTimeLeft] = useState(60);

  // 긴급 투표 모달 띄우기기
  useEffect(() => {
    if (gameState.isVoting && gameState.isEmergencyVote) {
      setShowEmergencyModal(true);

      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleEmergencyEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isVoting, gameState.isEmergencyVote, gameState.votedPlayers, setGameState]);

  // 최종 투표 모달 띄우기기
  useEffect(() => {
    if (gameState.isVoting && !gameState.isEmergencyVote) {
      setShowLastVoteModal(true);

      const timer = setInterval(() => {
        setLastTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleLastVoteEnd();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameState.isVoting, gameState.isEmergencyVote, gameState.votedPlayers, setGameState]);

  // 긴급 투표 처리리
  const handleEmergencyEnd = () => {
    const result = endVote(gameState.votedPlayers)
    if (result === gameState.evilSquirrelNickname) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        winner: 'good',
        gameOverReason: 'emergency',
        timerRunning: false,
        isStarted: false,
      }));
    }

    setGameState((prev) => {
      const newKilledPlayers = [...prev.killedPlayers, result];

      const updates = {
        ...prev,
        killedPlayers: newKilledPlayers,
        isVoting: false,
        isEmergencyVote: false,
        votingInProgress: false,
        totalVote: 0,
        votedPlayers: [],
        isPaused: false,
      };
      for (const player of gameState.votedPlayers) {
        updates[player] = 0;
      }

      // 나쁜 다람쥐 승리 조건 체크 (4명 사망)
      if (newKilledPlayers.length >= 4) {
        updates.isGameOver = true;
        updates.gameOverReason = 'kill';
        updates.winner = 'bad';
        updates.timerRunning = false;
        updates.isStarted = false;
      }

      if (result === nickName) {
        updates.isDead = true;
      }
      return updates;
    });

    setShowEmergencyModal(false);
  };

  // 최종 투표 처리
  const handleLastVoteEnd = () => {
    const result = endVote(gameState.votedPlayers)
    if (result === gameState.evilSquirrelNickname) {
      setGameState((prev) => {
        const updates = {
          ...prev,
          isGameOver: true,
          winner: 'good',
          gameOverReason: 'time',
          timerRunning: false,
          isStarted: false,
        }
        for (const player of gameState.votedPlayers) {
          updates[player] = 0;
        }
        return updates;
      })
    } else{
      setGameState((prev) => {
        const updates = {
          ...prev,
          isGameOver: true,
          winner: 'bad',
          gameOverReason: 'time',
          timerRunning: false,
          isStarted: false,
        }
        for (const player of gameState.votedPlayers) {
          updates[player] = 0;
        }
        return updates;
      })
    }

    setShowLastVoteModal(false);
  };

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
          {gameState.isVoting && gameState.isEmergencyVote && showEmergencyModal && (
            <EmergencyVoteModal
              isOpen={gameState.isVoting && !gameState.isDead}
              players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
              roomId={roomId}
              timeLeft={timeLeft}
            />
          )}
          {gameState.isVoting && !gameState.isEmergencyVote && showLastVoteModal && (
            <FinalVoteModal
              isOpen={gameState.isVoting && !gameState.isDead}
              players={players.filter(p => !gameState.killedPlayers.includes(p.nickName))}
              roomId={roomId}
              lastTimeLeft={lastTimeLeft}
            />
          )}
        </>
      )}
    </>
  );
};

export default MainForest;