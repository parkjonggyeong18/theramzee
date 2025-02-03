// pages/forests/FoggyForest.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import VideoGrid from '../../components/game/VideoGrid';
import MyVideo from '../../components/game/MyVideo';
import GameTimer from '../../components/game/GameTimer';
import StatePanel from '../../components/game/StatePanel';
import MiniMap from '../../components/game/MiniMap';
import MissionButton from '../../components/game/MissionButton';
import EmptyMissionOverlay from '../../components/game/missions/EmptyMissionOverlay';

const FoggyForest = () => {
 const { gameState, setGameState } = useGame();
 const [showMiniGame, setShowMiniGame] = useState(false);
 const [completedMissions, setCompletedMissions] = useState([]);
 const [audioContext, setAudioContext] = useState(null);

 // 입장 시 모든 캠 OFF
 useEffect(() => {
   setGameState(prev => ({
     ...prev,
     forceVideosOff: true
   }));

   // 음성 변조 설정
   const context = new (window.AudioContext || window.webkitAudioContext)();
   const pitchShifter = context.createBiquadFilter();
   const distortion = context.createWaveShaper();

   pitchShifter.type = 'lowshelf';
   pitchShifter.frequency.value = 100;
   pitchShifter.gain.value = 25;

   // 디스토션 커브 생성
   const makeDistortionCurve = (amount = 50) => {
     const k = typeof amount === 'number' ? amount : 50;
     const n_samples = 44100;
     const curve = new Float32Array(n_samples);
     const deg = Math.PI / 180;

     for (let i = 0; i < n_samples; i++) {
       const x = (i * 2) / n_samples - 1;
       curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
     }
     return curve;
   };

   distortion.curve = makeDistortionCurve(50);
   setAudioContext({ context, pitchShifter, distortion });

   // 정리 함수
   return () => {
     setGameState(prev => ({
       ...prev,
       forceVideosOff: false
     }));
     if (audioContext) {
       audioContext.context.close();
     }
   };
 }, []);

 // 음성 변조 적용
 useEffect(() => {
   if (audioContext && gameState.publisher) {
     const stream = gameState.publisher.stream.getAudioTracks()[0];
     const source = audioContext.context.createMediaStreamSource(new MediaStream([stream]));
     
     source.connect(audioContext.pitchShifter);
     audioContext.pitchShifter.connect(audioContext.distortion);
     audioContext.distortion.connect(audioContext.context.destination);
   }
 }, [audioContext, gameState.publisher]);

 const handleMissionClick = (missionId) => {
   if (completedMissions.includes(missionId)) return;
   if (gameState.role === 'good' && gameState.fatigue < 1) return;
   setShowMiniGame(true);
 };

 const handleMissionComplete = () => {
   setShowMiniGame(false);
 };

 return (
   <FoggyContainer>
     <BackgroundImage />
     <FogOverlay />
     
     <TopSection>
       <GameTimer />
     </TopSection>

     <ContentSection>
       <VideoSection>
         <VideoGrid />
         <StatePanel />
       </VideoSection>

       <MissionButtons>
         <MissionButton 
           onClick={() => handleMissionClick('mission1')}
           completed={completedMissions.includes('mission1')}
         />
         <MissionButton 
           onClick={() => handleMissionClick('mission2')}
           completed={completedMissions.includes('mission2')}
         />
         <MissionButton 
           onClick={() => handleMissionClick('mission3')}
           completed={completedMissions.includes('mission3')}
         />
       </MissionButtons>

       <BottomSection>
         <MyVideo />
         <MiniMap />
       </BottomSection>

       {showMiniGame && (
         <MiniGameOverlay>
           <EmptyMissionOverlay 
             onClose={() => setShowMiniGame(false)}
           />
         </MiniGameOverlay>
       )}
     </ContentSection>
   </FoggyContainer>
 );
};

// 기존 스타일드 컴포넌트들과 동일
const FoggyContainer = styled.div`
 width: 100vw;
 height: 100vh;
 position: relative;
 overflow: hidden;
`;

const BackgroundImage = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background-image: url('/src/assets/images/backgrounds/foggy-forest.png');
 background-size: cover;
 background-position: center;
 z-index: -1;
`;

// 안개 효과를 위한 추가 스타일
const FogOverlay = styled.div`
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 background: rgba(255, 255, 255, 0.3);
 backdrop-filter: blur(5px);
 z-index: 0;
`;

// 나머지 스타일드 컴포넌트 추가
const TopSection = styled.div`
 position: absolute;
 top: 20px;
 left: 50%;
 transform: translateX(-50%);
 z-index: 1;
`;

const ContentSection = styled.div`
 height: 100%;
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 padding: 80px 20px 20px;
 position: relative;
 z-index: 1;
`;

const VideoSection = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: flex-start;
`;

const MissionButtons = styled.div`
 position: absolute;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 display: flex;
 gap: 50px;
`;

const BottomSection = styled.div`
 display: flex;
 justify-content: flex-end;
 align-items: flex-end;
 gap: 20px;
`;

const MiniGameOverlay = styled.div`
 position: fixed;
 top: 0;
 left: 0;
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.8);
 z-index: 1000;
 display: flex;
 justify-content: center;
 align-items: center;
`;

export default FoggyForest;