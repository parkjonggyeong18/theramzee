import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const sessionId = `${roomId}-1`;
  const nickname = sessionStorage.getItem('nickName') || 'Guest';
  const token = sessionStorage.getItem('openViduToken');

  // subscribers 디버깅 로그
  console.log("subscribers:", subscribers);

  /**
   * "게임에 입장하기" 버튼 클릭
   */
  const enterGame = async () => {
    await joinSession(token, nickname);
    setIsPreview(false);
    navigate(`/room/${roomId}/game`);
  };

  // 1) 미리보기 화면
  if (isPreview) {
    return (
      <div className="preview-container">
        <h1>다람쥐 월드 미리보기</h1>
        <p>AI/AR 필터가 적용된 카메라 영상을 미리 확인하세요.</p>
        <div className="preview-video">
          {previewPublisher && <UserVideoComponent streamManager={previewPublisher} />}
        </div>
        <button onClick={enterGame}>게임에 입장하기</button>
      </div>
    );
  }

  // 2) 세션 화면
  const topStreams = [
    ...(mainStreamManager ? [mainStreamManager] : []),
    ...((Array.isArray(subscribers) && subscribers) || []), // undefined/null 방지
  ];

  return (
    <div className="container">
      <h1>다람쥐 월드: {sessionId}</h1>
      <button onClick={leaveSession}>Leave session</button>

      <div className="video-grid">
        {topStreams.map((stream, idx) => (
          <UserVideoComponent key={idx} streamManager={stream} />
        ))}
      </div>
    </div>
  );
};

export default OpenViduPage;
