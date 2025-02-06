// components/game/MyVideo.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OpenVidu } from 'openvidu-browser';
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
        });
        setControls(prev => ({ ...prev, publisher }));
      } catch (error) {
        console.error('Error initializing publisher:', error);
      }
    };

    initializePublisher();

    return () => {
      if (controls.publisher) {
        controls.publisher.destroy();
      }
    };
  }, [gameState.forceVideosOff, gameState.foggyVoiceEffect]);

  const toggleCamera = () => {
    if (controls.publisher) {
      controls.publisher.publishVideo(!controls.isCameraOn);
      setControls(prev => ({ ...prev, isCameraOn: !prev.isCameraOn }));
    }
  };

  const toggleMic = () => {
    if (controls.publisher) {
      controls.publisher.publishAudio(!controls.isMicOn);
      setControls(prev => ({ ...prev, isMicOn: !prev.isMicOn }));
    }
  };

  return (
    <VideoContainer>
      {isKilled && <DeadOverlay playerName={myPlayer?.name} />}
      <VideoElement id="my-video" />
      <Controls>
        <ControlButton onClick={toggleCamera}>
          {controls.isCameraOn ? '카메라 끄기' : '카메라 켜기'}
        </ControlButton>
        <ControlButton onClick={toggleMic}>
          {controls.isMicOn ? '마이크 끄기' : '마이크 켜기'}
        </ControlButton>
      </Controls>
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const VideoElement = styled.div`
  width: 100%;
  height: 100%;
  background: black;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default MyVideo;