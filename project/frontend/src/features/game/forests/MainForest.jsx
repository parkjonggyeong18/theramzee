import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import { backgroundImages, characterImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';
import { useNavigate } from 'react-router-dom';
import GameOverScreen from '../components/GameOverScreen'

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MainForestButtons from '../components/MainForestButtons';
import MiniMap from '../components/MiniMap';
import VoteScreen from '../components/vote/VoteScreen';

const MainForest = () => {
  const { gameState, players, startEmergencyVote, endVote,resetGame } = useGame();
  const navigate = useNavigate();

      const {
        joinSession,
        subscribers,
      } = useOpenVidu();
     
      // 현재 사용자가 위치한 숲 번호 가져오기
      const currentForestNum = gameState.forestNum;
      const currentForestUser = gameState.forestUsers?.[currentForestNum]; // 배열열
    
      const filteredSubscribers = subscribers.filter(sub => {
        try {
            // 🔥 JSON 데이터와 추가 문자열(`%/%닉네임`) 분리
            const rawData = sub.stream.connection.data.split("%/%")[0]; 
            const subData = JSON.parse(rawData); // {"clientData": "test1"}
            const subscriberNickname = subData.clientData;
    
            // 🔥 현재 숲에 속한 유저(`currentForestUser`)와 일치하는 경우만 필터링
            return currentForestUser.includes(subscriberNickname);
        } catch (error) {
            console.error("🚨 OpenVidu 데이터 파싱 오류:", error);
            return false; // 파싱 실패한 경우 필터링에서 제외
        }
    });
  
    const leftFilterCam = filteredSubscribers.slice(0, 3);
    const rightFilterCam = filteredSubscribers.slice(3, 7);
   

  // useEffect(() => {
  //   console.log("✅ 킬된 플레이어 목록 업데이트됨:", gameState.killedPlayers);
  // }, [gameState.killedPlayers]);
 
  // useEffect(() => {
  //   if (gameState.isGameOver) {
  //     console.log("Game Over detected - showing overlay");
  //   }
  // }, [gameState.isGameOver]);

  const handleExitGame = () => {
    resetGame();
    navigate('/rooms'); 
 
  };
  // 🌟 커서 스타일을 useEffect를 사용해 변경
  useEffect(() => {
    if (gameState.isStarted && gameState.evilSquirrel !== null) {
      const cursorImage = gameState.evilSquirrel
        ? characterImages.badSquirrel
        : characterImages.goodSquirrel;

      document.body.style.cursor = `url("${cursorImage}") 16 16, auto`;
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.isStarted, gameState.evilSquirrel]);

  const handleVoteEnd = (result) => {
    endVote(result);
  };

  const gameLayoutProps = {
    // 기본 레이아웃 요소
    leftVideoGrid: <VideoGrid players={leftFilterCam} totalSlots={3} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={rightFilterCam} totalSlots={2} gridPosition="right" />,
    gameTimer: <GameTimer />,
    statePanel: <StatePanel />,
    myVideo: <MyVideo />,
    miniMap: <MiniMap />,

    // 메인 숲 특화 요소
    mainForestButtons: (
      <MainForestButtons 
        onEmergencyClick={startEmergencyVote}
        emergencyDisabled={gameState.hasUsedEmergency}
      />
    ),

    // 오버레이
    voteScreen: gameState.isVoting && (
      <VoteScreen 
        onVoteEnd={handleVoteEnd}
        isEmergency={gameState.isEmergencyVote}
      />
    ),
    gameOverScreen: gameState.isGameOver ? (
      <GameOverScreen onExit={handleExitGame} />
    ) : null,
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    missionButtons: null,    // 메인 숲은 미션 버튼 없음
    miniGameOverlay: null    // 메인 숲은 미니게임 없음
  };
  


  return (
    <>
      {/* ✅ 게임이 끝나면 GameOverScreen을 독립적인 화면으로 렌더링 */}
      {gameState.isGameOver ? (
        <GameOverScreen onExit={handleExitGame} />
      ) : (
        <GameLayout {...gameLayoutProps} />
      )}
    </>
  );
};

export default MainForest;