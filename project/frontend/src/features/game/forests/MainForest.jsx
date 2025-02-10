// pages/forests/MainForest.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { backgroundImages } from '../../../assets/images';
import GameLayout from '../components/common/GameLayout';

// components import
import VideoGrid from '../components/VideoGrid';
import MyVideo from '../components/MyVideo';
import GameTimer from '../components/GameTimer';
import StatePanel from '../components/StatePanel';
import MainForestButtons from '../components/MainForestButtons';
import MiniMap from '../components/MiniMap';
import VoteScreen from '../components/vote/VoteScreen';

const MainForest = () => {
  const { 
    gameState, 
    players, 
    startEmergencyVote, 
    endVote 
  } = useGame();

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
    
    // 기타
    isGameStarted: gameState.isStarted,
    background: backgroundImages.mainForest,
    missionButtons: null,    // 메인 숲은 미션 버튼 없음
    miniGameOverlay: null    // 메인 숲은 미니게임 없음
  };

  return <GameLayout {...gameLayoutProps} />;
};

// const ForestContainer = styled.div`
//  width: 100vw;
//  height: 100vh;
//  position: relative;
//  overflow: hidden;
// `;

// const BackgroundImage = styled.div`
//  position: absolute;
//  top: 0;
//  left: 0;
//  width: 100%;
//  height: 100%;
//  background-image: url(${backgroundImages.mainForest});
//  background-size: cover;
//  background-position: center;
//  z-index: -1;
// `;

// const TopSection = styled.div`
//  position: absolute;
//  top: 20px;
//  left: 50%;
//  transform: translateX(-50%);
//  z-index: 1;
// `;

// const ContentSection = styled.div`
//  height: 100%;
//  display: flex;
//  flex-direction: column;
//  justify-content: space-between;
//  padding: 80px 20px 20px;
// `;

// const VideoSection = styled.div`
//  display: flex;
//  justify-content: space-between;
//  align-items: flex-start;
// `;

// const BottomSection = styled.div`
//  display: flex;
//  justify-content: flex-end;
//  align-items: flex-end;
//  gap: 20px;
// `;

export default MainForest;