// components/game/VideoGrid.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { OpenVidu, Publisher } from 'openvidu-browser';
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
     showControls: false
    //  publisher: null
   }))
 );

//  useEffect(() => {
//    const OV = new OpenVidu();
   
//    const initializePublishers = async () => {
//      try {
//        const publishers = await Promise.all(
//          players.filter(p => !p.isMe).map(async player => {
//            const publisher = OV.initPublisher(undefined, {
//              publishAudio: true,
//              publishVideo: !gameState.forceVideosOff,  // 안개 숲에서는 강제 OFF
//              audioSource: gameState.foggyVoiceEffect ? 'processed-audio' : undefined,
//              resolution: '640x480',
//              frameRate: 30,
//              mirror: false
//            });
//            return { id: player.id, publisher };
//          })
//        );

//        setVideoControls(prev => 
//          prev.map(control => {
//            const publisherData = publishers.find(p => p.id === control.id);
//            return {
//              ...control,
//              publisher: publisherData?.publisher || null,
//              isCameraOn: !gameState.forceVideosOff  // 안개 숲 상태 반영
//            };
//          })
//        );
//      } catch (error) {
//        console.error('Error initializing publishers:', error);
//      }
//    };

//    initializePublishers();

//    return () => {
//      videoControls.forEach(control => {
//        control.publisher?.stream?.dispose();
//      });
//    };
//  }, []);

 // 안개 숲 효과 감지
 useEffect(() => {
  if (gameState.forceVideosOff) {
  //  setVideoControls(prev => 
  //   prev.map(control => ({
  //    ...control,
  //     isCameraOn: false,
  //      publisher: control.publisher && {
  //       ...control.publisher,
  //       publishVideo: false
  //      }
  //   }))
  //  );

  // 더미
  setVideoControls(prev => 
    prev.map(control => ({
     ...control,
     isCameraOn: false
    }))
   );
  }
 }, [gameState.forceVideosOff]);

 const toggleControl = (playerId, control) => {
  //  setVideoControls(prev =>
  //    prev.map(p => {
  //      if (p.id === playerId) {
  //        if (control === 'isCameraOn') {
  //          p.publisher?.publishVideo(!p[control]);
  //        } else if (control === 'isMicOn') {
  //          p.publisher?.publishAudio(!p[control]);
  //        }
  //        return { ...p, [control]: !p[control] };
  //      }
  //      return p;
  //    })
  //  );

  // 더미
  setVideoControls(prev =>
    prev.map(p => {
      if (p.id === playerId) {
        return { ...p, [control]: !p[control] };
      }
      return p;
    })
  );
 };

 return (
   <>
     <GridContainer>
       {players.filter(p => !p.isMe).map((player) => {
         const controls = videoControls.find(c => c.id === player.id);
         const isKilled = gameState.killedPlayers.includes(player.id);
         const isBeingKilled = killingPlayer === player.id;

         return (
           <VideoContainer 
             key={player.id}
             onMouseDown={(e) => handleDragStart(e, player.id)}
             $isKillable={isKillable && !isKilled}
             $isDragging={isDragging}
           >
             <Video $isDisabled={!controls.isCameraOn || isKilled}>
               {/* {controls.publisher && (
                 <Publisher
                   streamManager={controls.publisher}
                   style={{ 
                     width: '100%', 
                     height: '100%',
                     opacity: isKilled ? 0.5 : 1
                   }}
                 />
               )} */}
               {/* 더미 */}
               <DummyVideo $isDisabled={!controls?.isCameraOn}>
                {!controls.isCameraOn && <CameraOffOverlay>카메라 OFF</CameraOffOverlay>}
                {isKilled && <DeadOverlay playerName={player.name} />}
               </DummyVideo>
             </Video>
             <ControlsButton
               onClick={() => setVideoControls(prev =>
                 prev.map(p => 
                   p.id === player.id
                     ? { ...p, showControls: !p.showControls }
                     : p
                 )
               )}
             >
               ⚙️
             </ControlsButton>
             {controls.showControls && (
               <ControlsPanel>
                 <ControlButton
                   onClick={() => toggleControl(player.id, 'isCameraOn')}
                   $isOn={controls.isCameraOn}
                 >
                   🎥
                 </ControlButton>
                 <ControlButton
                   onClick={() => toggleControl(player.id, 'isMicOn')}
                   $isOn={controls.isMicOn}
                 >
                   🎤
                 </ControlButton>
               </ControlsPanel>
             )}
           </VideoContainer>
         );
       })}
     </GridContainer>
     {killingPlayer && <KillAnimation />}
   </>
 );
};

const GridContainer = styled.div`
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 gap: 10px;
 padding: 20px;
`;

const VideoContainer = styled.div`
 position: relative;
 width: 200px;
 height: 150px;
 background: #000;
 border-radius: 10px;
 overflow: hidden;
 cursor: ${props => props.$isKillable ? 'grab' : 'default'};
 
 ${props => props.$isKillable && `
   &:hover {
     &::after {
       content: '';
       position: absolute;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: rgba(255, 0, 0, 0.2);
     }
   }
 `}

 ${props => props.$isDragging && `
   cursor: grabbing;
 `}
`;

const Video = styled.div`
 width: 100%;
 height: 100%;
 opacity: ${props => props.$isDisabled ? 0.5 : 1};
`;

const DummyVideo = styled.div`
width: 100%;
height: 100%;
background-color: ${props => props.$isDisabled ? '#333' : '#666'};
display: flex;
align-items: center;
justify-content: center;
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

export default VideoGrid;