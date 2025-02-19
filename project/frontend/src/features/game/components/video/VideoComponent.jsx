// // components/video/VideoComponent.jsx
// import { useState, useEffect } from 'react';
// import { OpenVidu, Publisher } from 'openvidu-browser';
// import styled from 'styled-components';

// const VideoComponent = ({ onVideoStateChange }) => {
//   // const [publisher, setPublisher] = useState(null);
//   const [videoEnabled, setVideoEnabled] = useState(true);
//   const [audioEnabled, setAudioEnabled] = useState(true);

//   // useEffect(() => {
//   //   const initializePublisher = async () => {
//   //     const OV = new OpenVidu();
//   //     try {
//   //       const pub = OV.initPublisher(undefined, {
//   //         publishAudio: audioEnabled,
//   //         publishVideo: videoEnabled,
//   //         resolution: '640x480',
//   //         frameRate: 30,
//   //         mirror: false
//   //       });
//   //       setPublisher(pub);
//   //       onVideoStateChange?.({ videoEnabled, audioEnabled });
//   //     } catch (error) {
//   //       console.error('Error initializing publisher:', error);
//   //     }
//   //   };

//   //   initializePublisher();

//   //   return () => {
//   //     publisher?.stream?.dispose();
//   //   };
//   // }, []);

//   // 더미 비디오 컴포넌트용 상태
//   const [isDummyMode] = useState(true); // 실제 구현 시에는 환경변수나 props로 관리

//   const toggleVideo = () => {
//     setVideoEnabled(!videoEnabled);
//     // publisher?.publishVideo(!videoEnabled);
//     onVideoStateChange?.({ videoEnabled: !videoEnabled, audioEnabled });
//   };

//   const toggleAudio = () => {
//     setAudioEnabled(!audioEnabled);
//     // publisher?.publishAudio(!audioEnabled);
//     onVideoStateChange?.({ videoEnabled, audioEnabled: !audioEnabled });
//   };

//   return (
//     <VideoContainer>
//       <Video>
//         {/* {publisher && (
//           <Publisher
//             streamManager={publisher}
//             style={{ width: '100%', height: '100%' }}
//           />
//         )} */
//           isDummyMode ? (
//             // 더미 비디오 표시
//             <DummyVideo $isDisabled={!videoEnabled}>
//               {!videoEnabled && <CameraOffText>카메라 OFF</CameraOffText>}
//             </DummyVideo>
//           ) : (
//             // 실제 Publisher 컴포넌트는 OpenVidu 연동 후 사용
//             null
//         )}
//       </Video>
//       <ControlsContainer>
//         <ControlButton onClick={toggleVideo}>
//           {videoEnabled ? '🎥' : '❌'}
//         </ControlButton>
//         <ControlButton onClick={toggleAudio}>
//           {audioEnabled ? '🎤' : '🔇'}
//         </ControlButton>
//       </ControlsContainer>
//     </VideoContainer>
//   );
// };

// const VideoContainer = styled.div`
//   position: relative;
//   width: 100%;
//   height: 200px;
// `;

// const Video = styled.div`
//   width: 100%;
//   height: 100%;
//   background: #000;
//   border-radius: 10px;
//   overflow: hidden;
// `;

// // 더미 1
// const DummyVideo = styled.div`
//   width: 100%;
//   height: 100%;
//   background-color: ${props => props.$isDisabled ? '#333' : '#666'};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// // 더미 2
// const CameraOffText = styled.div`
//   color: white;
//   font-size: 1.2rem;
// `;

// const ControlsContainer = styled.div`
//   position: absolute;
//   bottom: 10px;
//   right: 10px;
//   display: flex;
//   gap: 10px;
// `;

// const ControlButton = styled.button`
//   background: rgba(0, 0, 0, 0.5);
//   color: white;
//   border: none;
//   border-radius: 50%;
//   width: 30px;
//   height: 30px;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   &:hover {
//     background: rgba(0, 0, 0, 0.7);
//   }
// `;

// export default VideoComponent;