import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useOpenVidu } from '../../../contexts/OpenViduContext';

const VideoGrid = () => {
  const { subscribers } = useOpenVidu();
  const videoRefs = useRef({}); // ✅ 비디오 요소 저장을 위한 useRef()

  useEffect(() => {
    // ✅ 새로운 subscriber가 추가될 때만 videoRefs 초기화
    subscribers.forEach((sub) => {
      if (!videoRefs.current[sub.stream.connection.connectionId]) {
        videoRefs.current[sub.stream.connection.connectionId] = React.createRef();
      }
    });

    // ✅ 중복 실행 방지를 위해 videoRefs.current의 존재 여부를 먼저 체크
    subscribers.forEach((sub) => {
      const videoElement = videoRefs.current[sub.stream.connection.connectionId]?.current;
      if (videoElement && !videoElement.dataset.assigned) {
        console.log("📌 Assigning video element for", sub.stream.connection.connectionId);
        sub.addVideoElement(videoElement);
        videoElement.dataset.assigned = "true"; // ✅ 한 번만 실행되도록 설정
      }
    });
  }, [subscribers]);

  return (
    <GridContainer>
      {subscribers.map((sub) => (
        <VideoContainer key={sub.stream.connection.connectionId}>
          <StyledVideo
            ref={(el) => {
              if (el) {
                // ✅ videoRefs에 connectionId가 존재하지 않는 경우 안전하게 초기화
                if (!videoRefs.current[sub.stream.connection.connectionId]) {
                  videoRefs.current[sub.stream.connection.connectionId] = { current: el };
                } else {
                  videoRefs.current[sub.stream.connection.connectionId].current = el;
                }
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
  max-width: 200px; /* 🔥 너무 커지지 않도록 제한 */
  max-height: 150px;
`;

export default VideoGrid;
