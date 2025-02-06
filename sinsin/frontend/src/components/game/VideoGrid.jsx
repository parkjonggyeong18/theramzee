// components/game/VideoGrid.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OpenVidu } from 'openvidu-browser';
import { useGame } from '../../contexts/GameContext';
import { useKillSystem } from '../../hooks/useKillSystem';
import DeadOverlay from './DeadOverlay';
import KillAnimation from './KillAnimation';

const VideoGrid = () => {
  const { gameState, players } = useGame();
  const { killingPlayer, handleDragStart, isKillable, isDragging } = useKillSystem();
  
  const [videoControls, setVideoControls] = useState(
    players.filter(p => !p.isMe).map(p => ({
      id: p.id,
      isCameraOn: true,
      isMicOn: true,
      showControls: false,
      publisher: null
    }))
  );

  useEffect(() => {
    const OV = new OpenVidu();
    
    const initializePublishers = async () => {
      try {
        const publishers = await Promise.all(
          players.filter(p => !p.isMe).map(async player => {
            const publisher = OV.initPublisher(undefined, {
              publishAudio: true,
              publishVideo: !gameState.forceVideosOff,
              resolution: '640x480',
              frameRate: 30,
            });
            return { id: player.id, publisher };
          })
        );
        setVideoControls(prev => prev.map(vc => ({
          ...vc,
          publisher: publishers.find(p => p.id === vc.id)?.publisher || vc.publisher
        })));
      } catch (error) {
        console.error('Error initializing publishers:', error);
      }
    };

    initializePublishers();

    return () => {
      videoControls.forEach(vc => {
        if (vc.publisher) {
          vc.publisher.destroy();
        }
      });
    };
  }, [gameState.forceVideosOff, players]);

  const toggleCamera = (id) => {
    setVideoControls(prev => prev.map(vc => {
      if (vc.id === id && vc.publisher) {
        vc.publisher.publishVideo(!vc.isCameraOn);
        return { ...vc, isCameraOn: !vc.isCameraOn };
      }
      return vc;
    }));
  };

  const toggleMic = (id) => {
    setVideoControls(prev => prev.map(vc => {
      if (vc.id === id && vc.publisher) {
        vc.publisher.publishAudio(!vc.isMicOn);
        return { ...vc, isMicOn: !vc.isMicOn };
      }
      return vc;
    }));
  };

  return (
    <GridContainer>
      {videoControls.map(vc => (
        <VideoContainer key={vc.id}>
          {gameState.killedPlayers.includes(vc.id) && <DeadOverlay playerName={players.find(p => p.id === vc.id)?.name} />}
          <VideoElement id={`video-${vc.id}`} />
          <Controls>
            <ControlButton onClick={() => toggleCamera(vc.id)}>
              {vc.isCameraOn ? '카메라 끄기' : '카메라 켜기'}
            </ControlButton>
            <ControlButton onClick={() => toggleMic(vc.id)}>
              {vc.isMicOn ? '마이크 끄기' : '마이크 켜기'}
            </ControlButton>
          </Controls>
        </VideoContainer>
      ))}
      {isDragging && <KillAnimation onAnimationEnd={() => killingPlayer(null)} />}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 200px;
  height: 150px;
  background: black;
`;

const VideoElement = styled.div`
  width: 100%;
  height: 100%;
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
  padding: 5px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default VideoGrid;