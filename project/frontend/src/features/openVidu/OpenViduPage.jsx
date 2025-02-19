import React , {useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UserVideoComponent from './components/UserVideoComponent';
import { useOpenVidu } from '../../contexts/OpenViduContext';
import { useAuth } from '../../contexts/AuthContext'; 
import { leaveRoom } from '../../api/room';
import { connectSocket, disconnectSocket } from '../../api/stomp';
const OpenViduPage = () => {
   const { handleLogout, handleLogout2 } = useAuth();
  const {
    session,
    mainStreamManager,
    subscribers,
    isPreview,
    previewPublisher,
    joinSession,
    leaveSession,
    setIsPreview,
    initPreview,
  } = useOpenVidu();

  const { roomId } = useParams();
  const navigate = useNavigate();
  const sessionId = `${roomId}-1`;
  const username = sessionStorage.getItem('username') || 'Guest';
  const nickname = sessionStorage.getItem('nickName') || 'Guest';
  const token = sessionStorage.getItem('openViduToken');

  /**
   * "게임에 입장하기" 버튼 클릭
   */
  const enterGame = async () => {
    await joinSession(token, nickname);
    setIsPreview(false);
    navigate(`/room/${roomId}/game`);
  };
useEffect(() => {
    

  const handleBeforeUnload = () => { 
    handleExit2();

  };
  
    // 뒤로가기 처리
    const handlePopState = () => {
      handleExit();
      navigate('/rooms');
    };
    // 종료 처리 함수
    const handleExit2 = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
      initPreview();
      handleLogout2();
    }
    // 뒤로가기 종료 처리 함수
    const handleExit = () => {
      disconnectSocket();
      leaveRoom(roomId);
      leaveSession();
      initPreview();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomId, navigate]);

  // 미리보기 화면
  if (isPreview) {
    return (
      <PreviewContainer>
        <Header>
          <Title>RAMZEE 미리보기</Title>
        </Header>
        <VideoWrapper>
          {previewPublisher ? (
            <UserVideoComponent streamManager={previewPublisher} />
          ) : (
            <Placeholder>카메라가 활성화되지 않았습니다</Placeholder>
          )}
        </VideoWrapper>
        <ButtonGroup>
          <EnterButton onClick={enterGame}>게임에 입장하기</EnterButton>
        </ButtonGroup>
      </PreviewContainer>
    );
  }

  // 세션 화면
  return (
    <SessionContainer>
      <Header>
        <Title>다람쥐 월드: {roomId}</Title>
      </Header>
      <VideoGrid>
        {[...(mainStreamManager ? [mainStreamManager] : []), ...subscribers].map((stream, idx) => (
          <UserVideoComponent key={idx} streamManager={stream} />
        ))}
      </VideoGrid>
    </SessionContainer>
  );
};

export default OpenViduPage;

// 스타일 컴포넌트
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: rgba(34, 17, 7, 0.9); /* 로비와 유사한 배경색 */
`;

const Header = styled.div`

`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #a4e17d; /* 밝은 녹색 */
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #fff;
`;

const VideoWrapper = styled.div`
  width: 60%;
  max-width: 650px;
  height: auto;
  margin: 2rem auto;
`;

const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 300px;
  background-color: #444;
  color: #fff;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const EnterButton = styled.button`
  background-color: #a4e17d; /* 밝은 녹색 */
  color: black;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.2rem;
`;

const LeaveButton = styled.button`
  background-color: #ff6b6b; /* 밝은 빨간색 */
`;

const SessionContainer = styled.div`
`;

const VideoGrid = styled.div`
`;
