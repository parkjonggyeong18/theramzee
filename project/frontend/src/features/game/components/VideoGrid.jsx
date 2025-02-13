import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useOpenVidu } from '../../../contexts/OpenViduContext';

const VideoGrid = () => {
  const { subscribers } = useOpenVidu();
  const videoRefs = useRef({}); // ✅ 비디오 요소 저장
  const prevSubscribers = useRef(new Map()); // ✅ connectionId 기반 중복 체크

  useEffect(() => {
    subscribers.forEach((sub) => {
      const connectionId = sub.stream.connection.connectionId;
      
      // ✅ 새로운 subscriber인 경우만 videoRefs 초기화
      if (!videoRefs.current[connectionId]) {
        videoRefs.current[connectionId] = React.createRef();
      }

      // ✅ 중복 등록 방지
      if (!prevSubscribers.current.has(connectionId)) {
        const videoElement = videoRefs.current[connectionId]?.current;
        if (videoElement) {
          console.log("📌 Assigning video element for", connectionId);
          sub.addVideoElement(videoElement);
          prevSubscribers.current.set(connectionId, sub); // ✅ 등록된 subscriber 저장
        }
      }
    });

  }, [subscribers]); // ✅ subscribers가 변경될 때만 실행

  return (
    <GridContainer>
      {subscribers.map((sub) => (
        <VideoContainer key={sub.stream.connection.connectionId}>
          <StyledVideo
            ref={(el) => {
              const connectionId = sub.stream.connection.connectionId;
              if (el) {
                videoRefs.current[connectionId] = { current: el };
              }
            }}
            autoPlay
          />
        </VideoContainer>
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  background: #000;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain; /* 🔥 화면이 잘리지 않도록 설정 */
  transform: scaleX(-1); /* 🔥 좌우 반전 유지 */
  max-width: 200px;
  max-height: 150px;
`;

export default VideoGrid;
