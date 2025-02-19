import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import gaegeImage from'../../../assets/images/object/gaege.png'
import diaImage from'../../../assets/images/object/PAN.png'

const GameTimer = () => {
  const { gameState, setGameState,cancelAction, moveForest } = useGame();
  const INITIAL_TIME = 240; // 4분분
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    let timerInterval;
  
    if (gameState.isStarted && !gameState.isPaused && gameState.timer > 0) {
      timerInterval = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;
          
          if (newTimer === 0) {
            cancelAction();
            moveForest(1);
            navigate(`/game/${roomId}/main`); 
            return {
              ...prev,
              timer: 0,
              isVoting: true,
              votes: {}
            };
          }
          
          return {
            ...prev,
            timer: newTimer
          };
        });
      }, 1000);
    }
  
    return () => clearInterval(timerInterval);
  }, [gameState.isStarted, gameState.isPaused, gameState.timer]);

  const getProgressBarColor = (timer) => {
    const percentage = (timer / INITIAL_TIME) * 100;
    if (percentage > 66) return '#4CAF50'; // 녹색
    if (percentage > 33) return '#FFC107'; // 노란색
    return '#FF5252'; // 빨간색
  };

  useEffect(() => {
    // 폰트 미리 로드
    const font = new FontFace(
      'NeoDunggeunmoPro-Regular',
      `url('/fonts/NeoDunggeunmoPro-Regular.ttf')`,
      { display: 'swap' }
    );

    // 폰트 로드 및 적용
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('폰트 로드 실패:', error);
    });
  }, []);

  return (
    <TimerContainer $timer={gameState.timer}>
      <TimeText>남은 시간</TimeText>
      <ProgressBarContainer>
        <ProgressBar 
          $progress={(gameState.timer / INITIAL_TIME) * 100}
          $color={getProgressBarColor(gameState.timer)}
        />
      </ProgressBarContainer>
    </TimerContainer>
  );
};

const TimerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 200px;  // dia 이미지 크기에 맞게 조정
  height: 100px; // dia 이미지 크기에 맞게 조정
  background-image: url(${diaImage});
  background-size: contain;
  background-repeat: no-repeat;

  position: relative;
  padding: 20px;
  justify-content: center;
`;

const TimeText = styled.div`
  font-size: 1.6rem;
  font-family: 'NeoDunggeunmoPro-Regular', sans-serif;  
  color: white;
  text-align: center;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  position: relative;
  top: -40px;  // 위치 미세 조정
`;

const ProgressBarContainer = styled.div`
  width: 238px;
  height: 30px;
  background-image: url(${gaegeImage});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  position: relative;
  background-color: transparent;
  margin-top: -30px;  // 게이지바 위치 조정
`;
const ProgressBar = styled.div`
  position: absolute;
  top: 9px;
  left: 9px;
  border-radius : 2px;
  width: calc(${props => props.$progress}% - 33px);  // left 여백만큼 더 빼줌
  height: calc(100% - 18px);                         // 높이 조절
  background-color: rgba(76, 175, 80, 0.8);          // 약간 투명도 추가
  transition: width 1s linear;

  @keyframes flash {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }

  animation: ${props => props.$progress <= 25 ? 'flash 1s infinite' : 'none'};
`;
export default GameTimer;