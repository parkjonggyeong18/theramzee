import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useOpenVidu } from '../../../contexts/OpenViduContext';
import goodSquirrel from '../../../assets/images/characters/good-squirrel.png';

const VideoGrid = (props) => {
  // OpenViduContext에서 session을 가져옵니다.
  const { session } = useOpenVidu();
  const videoRefs = useRef({}); // 각 비디오 DOM 요소의 ref를 저장할 객체
  const subscribers = props.players || [];
  const totalSlots = props.totalSlots;
  
  // subscribers 배열의 길이가 totalSlots보다 작으면, 나머지는 null로 채워진 슬롯 배열 생성
  const slots = Array.from({ length: totalSlots }, (_, i) => subscribers[i] || null);


  useEffect(() => {
    // 각 슬롯에서 subscriber가 존재하고, 내부 속성이 준비되었을 때 ref 초기화
    slots.forEach((player) => {
      if (player?.stream?.connection?.connectionId) {
        const connectionId = player.stream.connection.connectionId;
        if (!videoRefs.current[connectionId]) {
          videoRefs.current[connectionId] = React.createRef();
        }
      }
    });

    // 각 슬롯에서 subscriber가 존재하면, video 요소에 스트림을 할당
    slots.forEach((player) => {
      if (player?.stream?.connection?.connectionId) {
        const connectionId = player.stream.connection.connectionId;
        const videoElement = videoRefs.current[connectionId]?.current;
        if (videoElement && !videoElement.dataset.assigned) {
          console.log("📌 Assigning video element for", connectionId);
          player.addVideoElement(videoElement);
          videoElement.dataset.assigned = "true"; // 중복 할당 방지
        }
      }
    });
  }, [slots]);

  
  // session이 준비되지 않았으면 로딩 상태 렌더링
  if (!session) {
    return <GridContainer>Loading...</GridContainer>;
  }

  return (
    <GridContainer>
      {slots.map((sub, idx) => {
        // 옵셔널 체이닝으로 안전하게 connectionId 추출
        const connectionId = sub?.stream?.connection?.connectionId;
        return (
          <VideoContainer key={idx}>
            {connectionId ? (
              <StyledVideo
                ref={(el) => {
                  if (el && connectionId) {
                    if (!videoRefs.current[connectionId]) {
                      videoRefs.current[connectionId] = { current: el };
                    } else {
                      videoRefs.current[connectionId].current = el;
                    }
                  }
                }}
                autoPlay
              />
            ) : (
              // subscriber가 없거나 준비되지 않았으면 placeholder 이미지 렌더링
              <ImageContainer>
              <PlaceholderImage 
                src={props.placeholderImage || goodSquirrel}  
              />
              </ImageContainer>
            )}
          </VideoContainer>
        );
      })}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  padding: 0px;
  opacity: 100%;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 173px;
  height: 130px;
  border-radius: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  object-fit: contain;
  transform: scaleX(-1);
  max-width: 300px;
  max-height: 300px;
  opacity: 100%;
`;

const PlaceholderImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 100%;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 80%;
=======
  object-fit: contain; /* 🔥 화면이 잘리지 않도록 설정 */
  transform: scaleX(-1); /* 🔥 좌우 반전 유지 */
  max-width: 200px;
  max-height: 150px;
>>>>>>> develop
`;

export default VideoGrid;
