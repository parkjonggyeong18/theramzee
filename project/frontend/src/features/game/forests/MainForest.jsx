import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
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

  
 
  useEffect(() => {
    if (gameState.isGameOver) {
      console.log("Game Over detected - showing overlay");
    }
  }, [gameState.isGameOver]);

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
    leftVideoGrid: <VideoGrid players={players} gridPosition="left" />,
    rightVideoGrid: <VideoGrid players={players} gridPosition="right" />,
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