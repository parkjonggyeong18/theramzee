// src/features/game/components/GameOverScreen.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../../contexts/GameContext';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import styled from 'styled-components';
  // ✅ roomId 가져오기

const GameOverScreen = () => {
  const navigate = useNavigate();
  const { gameState, roomId } = useGame();
  const {
    joinSession,
    leaveSession,
  } = useOpenVidu();
  const token = sessionStorage.getItem('openViduToken');
  const nickname = sessionStorage.getItem('nickName')
  console.log("🔴 GameOverScreen Rendered!", gameState);

  const handleExit = () => {
    leaveSession();
    joinSession(token, nickname)

    if (roomId) {
      setTimeout(() => {
        window.location.href = `/room/${roomId}/game`;  // ✅ 새로고침 후 방으로 이동
      }, 500);  // 0.5초 지연 후 이동
    } else {
      setTimeout(() => {
        window.location.href = '/rooms';  // ✅ 새로고침 후 로비로 이동
      }, 500);
    }
  };
  
  // 디버깅용 console.log 추가
  console.log('GameOverScreen Rendered:', {
    gameState: gameState,
    reason: gameState.gameOverReason,
    winner: gameState.winner
  });

  const getMessage = () => {
    if (gameState.gameOverReason === 'acorns') {
      return gameState.goodSquirrel 
        ? "도토리를 모두 모으지 못했습니다!\n나쁜 다람쥐 승리!" 
        : "도토리를 모두 모았습니다!\n착한 다람쥐 승리!";
    }
  
    if (gameState.gameOverReason === 'emergency') {
      return gameState.lastKilledPlayer === gameState.evilSquirrel
        ? "나쁜 다람쥐를 찾아냈습니다!\n착한 다람쥐 승리!"
        : "착한 다람쥐를 죽였습니다!\n나쁜 다람쥐 승리!";
    }
  
    if (gameState.gameOverReason === 'time') {
      return gameState.lastKilledPlayer === gameState.evilSquirrel
        ? "시간 종료! 나쁜 다람쥐를 찾아냈습니다!\n착한 다람쥐 승리!"
        : "시간 종료! 나쁜 다람쥐를 찾지 못했습니다!\n나쁜 다람쥐 승리!";
    }
  
    if (gameState.gameOverReason === 'kill') {
      return "4명의 다람쥐를 처치했습니다!\n나쁜 다람쥐 승리!";
    }
  
    return "게임 종료!";
  };

  return (
    <OverlayContainer>
      <ContentBox>
        <Title>게임 종료</Title>
        <Message>{getMessage()}</Message>
        <ExitButton onClick={handleExit}>
          로비로 돌아가기
        </ExitButton>
      </ContentBox>
    </OverlayContainer>
  );
};

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;  /* 매우 높은 z-index 값으로 설정 */
`;

const ContentBox = styled.div`
  background-color: rgba(139, 69, 19, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  text-align: center;
  z-index: 10000;  /* overlay보다 더 높게 설정 */
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  font-family: 'JejuHallasan';
  margin-bottom: 1.5rem;
`;

const Message = styled.p`
  color: white;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 2rem;
  white-space: pre-line;
`;

const ExitButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #98FB98;
  }
`;

export default GameOverScreen;