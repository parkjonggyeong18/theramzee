import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { roomService } from '../services/roomService';
import { useGame } from '../contexts/GameContext';

import VideoGrid from '../components/game/VideoGrid';
import MyVideo from '../components/game/MyVideo';
import GameTimer from '../components/game/GameTimer';
import StatePanel from '../components/game/StatePanel';
import MainForestButtons from '../components/game/MainForestButtons';
import MiniMap from '../components/game/MiniMap';

import { backgroundImages, characterImages } from '../assets/images';

const GameRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const { gameState, setGameState } = useGame();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const data = await roomService.getRoom(roomId);
        setRoom(data);
      } catch (error) {
        console.error('방 정보 조회 실패:', error);
        setError('방 정보를 불러오는데 실패했습니다');
      }
    };

    fetchRoomData();
  }, [roomId]);

  const handleGameStart = () => {
    // 1인 테스트용 임시 로직 유지
    const randomRole = Math.random() < 0.5 ? 'good' : 'bad';
    setGameState(prev => ({
      ...prev,
      isStarted: true,
      role: randomRole
    }));
  };

  const handleExit = async () => {
    try {
      await roomService.leaveRoom(roomId);
      navigate('/lobby');
    } catch (error) {
      console.error('방 나가기 실패:', error);
      alert('방 나가기에 실패했습니다');
    }
  };

  // 커서 스타일 변경
  useEffect(() => {
    if (gameState.isStarted && gameState.role) {
      const cursorImage = gameState.role === 'good' ? characterImages.goodSquirrel : characterImages.badSquirrel;
      document.body.style.cursor = `url(${cursorImage}), auto`;
    } else {
      document.body.style.cursor = 'auto';
    }

    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [gameState.isStarted, gameState.role]);

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!room) {
    return <LoadingMessage>방 정보를 불러오는 중...</LoadingMessage>;
  }

  return (
    <GameRoomContainer>
      <GameBackground />
      {!gameState.isStarted ? (
        <>
          <RoomInfo>
            <h2>{room.title}</h2>
            <p>플레이어: {room.currentPlayers}/{room.maxPlayers}</p>
          </RoomInfo>
          <VideoGrid />
          <ButtonContainer>
            <StartButton 
              onClick={handleGameStart}
              disabled={room.currentPlayers < 1} // 테스트용 1명, 실제로는 6명
            >
              GAME START
            </StartButton>
            <ExitButton onClick={handleExit}>나가기</ExitButton>
          </ButtonContainer>
        </>
      ) : (
        <>
          <TopSection>
            <GameTimer />
          </TopSection>

          <VideoSection>
            <VideoGrid />
            <StatePanel />
          </VideoSection>

          <MainForestButtons />
          
          <BottomSection>
            <MyVideo />
            <MiniMap />
          </BottomSection>
        </>
      )}
    </GameRoomContainer>
  );
};


const GameRoomContainer = styled.div`
 width: 100vw;
 height: 100vh;
 position: relative;
 overflow: hidden;
`;

const GameBackground = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url(${backgroundImages.mainForest});
 background-size: cover;
 background-position: center;
 z-index: -1;
`;

const TopSection = styled.div`
 position: absolute;
 top: 20px;
 left: 50%;
 transform: translateX(-50%);
`;

const VideoSection = styled.div`
 display: flex;
 justify-content: space-between;
 padding: 20px;
 margin-top: 60px;
`;

const BottomSection = styled.div`
  position: absolute;
  bottom: 20px;
  width: calc(100% - 40px); // 좌우 여백 고려
  padding: 0 20px;
  display: flex;
  justify-content: space-between; // MyVideo와 MiniMap을 양쪽 끝으로
  align-items: flex-end;
  z-index: 10;
`;

const ButtonContainer = styled.div`
 position: absolute;
 top: 20px;
 right: 20px;
 display: flex;
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
const RoomInfo = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  z-index: 1;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
`;
export default GameRoom;