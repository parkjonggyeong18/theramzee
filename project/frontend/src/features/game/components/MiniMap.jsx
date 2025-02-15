// components/game/MiniMap.jsx
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import { backgroundImages } from '../../../assets/images';

const MiniMap = () => {
 const navigate = useNavigate();
 const { gameState, moveForest, players } = useGame();

 const forests = [
   { 
     id: 'twisted', 
     position: 'top-left', 
     backgroundImage: backgroundImages.twistedForest,
     name: '뒤틀린 숲'
   },
   { 
     id: 'dry', 
     position: 'top-center', 
     backgroundImage: backgroundImages.dryForest,
     name: '메마른 숲'
   },
   { 
     id: 'fairy', 
     position: 'top-right', 
     backgroundImage: backgroundImages.fairyForest,
     name: '요정의 숲'
   },
   { 
     id: 'time', 
     position: 'bottom-left', 
     backgroundImage: backgroundImages.timeForest,
     name: '시간의 숲'
   },
   { 
     id: 'foggy', 
     position: 'bottom-center', 
     backgroundImage: backgroundImages.foggyForest,
     name: '안개낀 숲'
   },
   { 
     id: 'breathing', 
     position: 'bottom-right', 
     backgroundImage: backgroundImages.breathingForest,
     name: '숨쉬는 숲'
   }
 ];

 const clkForest = (forestId, forestNum) => {
  if (!gameState.isStarted || gameState.isDead) return;
  if (!gameState.roomId) return;
  moveForest(forestNum);
  navigate(`/game/${gameState.roomId}/forest/${forestId}`);
};

const clkMainForest = () => {
  if (!gameState.isStarted || gameState.isDead) return;
  if (!gameState.roomId) return;
  moveForest(1);
  navigate(`/game/${gameState.roomId}/main`);
};

 return (
  <MapContainer>
    <ForestGrid>
      {forests.map((forest, index) => (
        <ForestButton
          key={forest.id}
          $position={forest.position}
          $backgroundImage={forest.backgroundImage}
          onClick={() => clkForest(forest.id, index+2)}
          title={forest.name}
          disabled={!gameState.isStarted && !gameState.isDead}
          $isDisabled={!gameState.isStarted && !gameState.isDead}
        />
      ))}
      <MainForestButton
        onClick={clkMainForest}
        $backgroundImage={backgroundImages.mainForest}
        disabled={!gameState.isStarted && !gameState.isDead}
        $isDisabled={!gameState.isStarted && !gameState.isDead}
      />
    </ForestGrid>
  </MapContainer>
 );
};

const MapContainer = styled.div`
 width: 150px;
 height: 150px;
  background-color:rgba(240, 240, 240, 0.34); // 회색 배경 추가
  padding: 10px; // 내부 여백 추가
  border-radius: 10px; // 모서리 둥글게 처리
`;

const ForestGrid = styled.div`
 position: relative;
 width: 100%;
 height: 100%;
 display: grid;
 grid-template-columns: repeat(3, 1fr);
 grid-template-rows: repeat(3, 1fr);
 gap: 5px;
`;

const ForestButton = styled.button`
 background-image: ${props => `url(${props.$backgroundImage})`};
 background-size: cover;
 background-position: center;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 transition: transform 0.2s;
 opacity: ${props => props.$isDisabled ? 0.5 : 1};
 cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
 grid-area: ${props => {
   switch (props.$position) {
     case 'top-left': return '1 / 1 / 2 / 2';
     case 'top-center': return '1 / 2 / 2 / 3';
     case 'top-right': return '1 / 3 / 2 / 4';
     case 'bottom-left': return '3 / 1 / 4 / 2';
     case 'bottom-center': return '3 / 2 / 4 / 3';
     case 'bottom-right': return '3 / 3 / 4 / 4';
     default: return 'auto';
   }
 }};

 &:hover {
   transform: scale(1.1);
   box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
 }

 &:before {
   content: attr(title);
   position: absolute;
   top: -25px;
   left: 50%;
   transform: translateX(-50%);
   background: rgba(0, 0, 0, 0.8);
   color: white;
   padding: 5px;
   border-radius: 5px;
   font-size: 12px;
   opacity: 0;
   transition: opacity 0.2s;
 }

 &:hover:before {
   opacity: 1;
 }
`;

const MainForestButton = styled.button`
 background-image: ${props => `url(${props.$backgroundImage})`};
 background-size: cover;
 background-position: center;
 border: none;
 border-radius: 50%;
 cursor: pointer;
 transition: transform 0.2s;
 opacity: ${props => props.$isDisabled ? 0.5 : 1};
 cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
 grid-area: 2 / 2 / 3 / 3;

 &:hover {
   transform: scale(1.1);
   box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
 }
`;

export default MiniMap;