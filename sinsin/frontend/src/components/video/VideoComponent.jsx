// components/video/VideoComponent.jsx
<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import React, { useState, useEffect, useRef } from 'react';
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
import { OpenVidu, Publisher } from 'openvidu-browser';
import styled from 'styled-components';

const VideoComponent = ({ onVideoStateChange }) => {
  const [publisher, setPublisher] = useState(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
<<<<<<< HEAD
=======
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d

  useEffect(() => {
    const initializePublisher = async () => {
      const OV = new OpenVidu();
      try {
        const pub = OV.initPublisher(undefined, {
          publishAudio: audioEnabled,
          publishVideo: videoEnabled,
          resolution: '640x480',
          frameRate: 30,
          mirror: false
        });
        setPublisher(pub);
        onVideoStateChange?.({ videoEnabled, audioEnabled });
      } catch (error) {
        console.error('Error initializing publisher:', error);
      }
    };

    initializePublisher();

    return () => {
      publisher?.stream?.dispose();
    };
  }, []);

  const toggleVideo = () => {
<<<<<<< HEAD
=======
    if (isVideoPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsVideoPlaying(!isVideoPlaying);
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
    setVideoEnabled(!videoEnabled);
    publisher?.publishVideo(!videoEnabled);
    onVideoStateChange?.({ videoEnabled: !videoEnabled, audioEnabled });
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    publisher?.publishAudio(!audioEnabled);
    onVideoStateChange?.({ videoEnabled, audioEnabled: !audioEnabled });
  };

  return (
    <VideoContainer>
      <Video>
        {publisher && (
          <Publisher
            streamManager={publisher}
            style={{ width: '100%', height: '100%' }}
          />
        )}
<<<<<<< HEAD
      </Video>
      <ControlsContainer>
        <ControlButton onClick={toggleVideo}>
          {videoEnabled ? '🎥' : '❌'}
=======
        <video ref={videoRef} src="video.mp4" controls />
      </Video>
      <ControlsContainer>
        <ControlButton onClick={toggleVideo}>
          {isVideoPlaying ? 'Pause' : 'Play'}
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
        </ControlButton>
        <ControlButton onClick={toggleAudio}>
          {audioEnabled ? '🎤' : '🔇'}
        </ControlButton>
      </ControlsContainer>
    </VideoContainer>
  );
};

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
`;

const Video = styled.div`
  width: 100%;
  height: 100%;
  background: #000;
  border-radius: 10px;
  overflow: hidden;
`;

const ControlsContainer = styled.div`
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const ControlButton = styled.button`
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;

export default VideoComponent;