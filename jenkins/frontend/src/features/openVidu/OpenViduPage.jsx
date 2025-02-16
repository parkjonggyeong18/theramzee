import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import UserVideoComponent from './components/UserVideoComponent';
import { useOpenVidu } from '../../contexts/OpenViduContext';

const OpenViduPage = () => {
  const {
    session,
    mainStreamManager,
    subscribers,
    isPreview,
    previewPublisher,
    joinSession,
    leaveSession,
    setIsPreview,
  } = useOpenVidu();

  const { roomId } = useParams();
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('nickName') || 'Guest';
  const token = sessionStorage.getItem('openViduToken');

  /**
   * "게임에 입장하기" 버튼 클릭 시 처리
   */
  const enterGame = async () => {
    await joinSession(token, nickname);
    setIsPreview(false);
    navigate(`/room/${roomId}/game`);
  };

<<<<<<< HEAD
  const goBack = () => {
    leaveSession();
    navigate(`/rooms`);

  }
  // 미리보기 상태일 때 렌더링
  if (isPreview) {
    return (
      <PreviewContainer>
        <PreviewTitle>다람쥐 월드 미리보기</PreviewTitle>
        <PreviewText>카메라 영상을 미리 확인하세요.</PreviewText>
        <VideoWrapper>
          {previewPublisher && (
            <UserVideoComponent streamManager={previewPublisher} />
          )}
        </VideoWrapper>
        <ButtonGroup>
          <LeaveButton onClick={goBack}>돌아가기</LeaveButton>
=======
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
>>>>>>> 6fa67cf969c7279cd409d7515e0ade8e2a0ee209
          <EnterButton onClick={enterGame}>게임에 입장하기</EnterButton>
        </ButtonGroup>
      </PreviewContainer>
    );
  }

<<<<<<< HEAD
  // 세션 화면: mainStreamManager와 subscribers를 합쳐서 스트림 배열 생성
  const topStreams = [
    ...(mainStreamManager ? [mainStreamManager] : []),
    ...((Array.isArray(subscribers) && subscribers) || []),
  ];

  return (
    <SessionContainer>
      <SessionTitle>다람쥐 월드: {sessionId}</SessionTitle>
      <LeaveButton onClick={leaveSession}>돌아가기</LeaveButton>
      <VideoGridContainer>
        {topStreams.map((stream, idx) => (
          <UserVideoComponent key={idx} streamManager={stream} />
        ))}
      </VideoGridContainer>
=======
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
>>>>>>> 6fa67cf969c7279cd409d7515e0ade8e2a0ee209
    </SessionContainer>
  );
};

const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0;
`;

const PreviewTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const PreviewText = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
`;

const VideoWrapper = styled.div`
  width: 45%;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const LeaveButton = styled.button`
  padding: 10px 20px;
  background-color: #ff4444;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

const EnterButton = styled.button`
  padding: 10px 20px;
  background-color: #90ee90;
  color: #000;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
`;

const SessionContainer = styled.div`
  padding: 20px;
  width: 100vw;
  height: 100vh;
  background-color: #ffffff;
`;

const SessionTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

const VideoGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

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
