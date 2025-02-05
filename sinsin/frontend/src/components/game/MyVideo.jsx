// components/game/MyVideo.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OpenVidu, Publisher } from 'openvidu-browser';
import { useGame } from '../../contexts/GameContext';
import DeadOverlay from './DeadOverlay';

const MyVideo = () => {
 const { gameState, players } = useGame();
 const [controls, setControls] = useState({
   isCameraOn: true,
   isMicOn: true,
   showControls: false,
   publisher: null
 });

 const myPlayer = players.find(p => p.isMe);
 const isKilled = gameState.killedPlayers.includes(myPlayer?.id);

 useEffect(() => {
   const OV = new OpenVidu();
   
   const initializePublisher = async () => {
     try {
       const publisher = OV.initPublisher(undefined, {
         publishAudio: true,
         publishVideo: !gameState.forceVideosOff,
         audioSource: gameState.foggyVoiceEffect ? 'processed-audio' : undefined,
         resolution: '640x480',
         frameRate: 30,
         mirror: false
       });

       setControls(prev => ({
         ...prev,
         publisher,
         isCameraOn: !gameState.forceVideosOff
       }));
     } catch (error) {
       console.error('Error initializing publisher:', error);
     }
   };

   initializePublisher();

   return () => {
     controls.publisher?.stream?.dispose();
   };
 }, []);

 // 안개 숲 효과 감지
 useEffect(() => {
  if (gameState.forceVideosOff) {
   setControls(prev => {
    prev.publisher?.publishVideo(false);
     return {
      ...prev,
      isCameraOn: false
     };
   });
  }
 }, [gameState.forceVideosOff]);

 useEffect(() => {
   // 죽었을 때 자동으로 카메라와 마이크 끄기
   if (isKilled) {
     setControls(prev => {
       prev.publisher?.publishVideo(false);
       prev.publisher?.publishAudio(false);
       return {
         ...prev,
         isCameraOn: false,
         isMicOn: false
       };
     });
   }
 }, [isKilled]);

 const toggleControl = (control) => {
   if (isKilled || (control === 'isCameraOn' && gameState.forceVideosOff)) return;

   setControls(prev => {
     if (control === 'isCameraOn') {
       prev.publisher?.publishVideo(!prev[control]);
     } else if (control === 'isMicOn') {
       prev.publisher?.publishAudio(!prev[control]);
     }
     return { ...prev, [control]: !prev[control] };
   });
 };

 return (
   <VideoContainer $isKilled={isKilled}>
     <Video $isDisabled={!controls.isCameraOn || isKilled}>
       {controls.publisher && (
         <Publisher
           streamManager={controls.publisher}
           style={{ 
             width: '100%', 
             height: '100%',
             opacity: isKilled ? 0.5 : 1
           }}
         />
       )}
       {!controls.isCameraOn && <CameraOffOverlay>카메라 OFF</CameraOffOverlay>}
       {isKilled && (
         <DeadOverlay 
           playerName={myPlayer?.name} 
         />
       )}
     </Video>
     {!isKilled && (
       <>
         <ControlsButton
           onClick={() => setControls(prev => ({
             ...prev,
             showControls: !prev.showControls
           }))}
         >
           ⚙️
         </ControlsButton>
         {controls.showControls && (
           <ControlsPanel>
             <ControlButton
               onClick={() => toggleControl('isCameraOn')}
               $isOn={controls.isCameraOn}
               disabled={gameState.forceVideosOff}
             >
               🎥
             </ControlButton>
             <ControlButton
               onClick={() => toggleControl('isMicOn')}
               $isOn={controls.isMicOn}
             >
               🎤
             </ControlButton>
           </ControlsPanel>
         )}
       </>
     )}
   </VideoContainer>
 );
};

const VideoContainer = styled.div`
 position: relative;
 width: 300px;
 height: 225px;
 background: #000;
 border-radius: 10px;
 overflow: hidden;
 opacity: ${props => props.$isKilled ? 0.8 : 1};
`;

const Video = styled.div`
 width: 100%;
 height: 100%;
 opacity: ${props => props.$isDisabled ? 0.5 : 1};
`;

const CameraOffOverlay = styled.div`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 color: white;
 font-family: 'JejuHallasan';
`;

const ControlsButton = styled.button`
 position: absolute;
 top: 5px;
 right: 5px;
 background: none;
 border: none;
 cursor: pointer;
 font-size: 1.2rem;
 color: white;
 z-index: 2;
`;

const ControlsPanel = styled.div`
 position: absolute;
 top: 30px;
 right: 5px;
 display: flex;
 flex-direction: column;
 gap: 5px;
 background: rgba(0, 0, 0, 0.5);
 padding: 5px;
 border-radius: 5px;
 z-index: 2;
`;

const ControlButton = styled.button`
 background: none;
 border: none;
 cursor: pointer;
 color: ${props => props.$isOn ? 'white' : 'red'};
 opacity: ${props => props.$isOn ? 1 : 0.5};
`;

export default MyVideo;