// components/game/MiniMap.jsx
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MiniMap = () => {
 const navigate = useNavigate();
 const { gameState } = useGame();

 const forests = [
   { 
     id: 'twisted', 
     position: 'top-left', 
     backgroundImage: '/src/assets/images/backgrounds/twisted-forest.png',
     name: '뒤틀린 숲'
   },
   { 
     id: 'dry', 
     position: 'top-center', 
     backgroundImage: '/src/assets/images/backgrounds/dry-forest.png',
     name: '메마른 숲'
   },
   { 
     id: 'fairy', 
     position: 'top-right', 
     backgroundImage: '/src/assets/images/backgrounds/fairy-forest.png',
     name: '요정의 숲'
   },
   { 
     id: 'time', 
     position: 'bottom-left', 
     backgroundImage: '/src/assets/images/backgrounds/time-forest.png',
     name: '시간의 숲'
   },
   { 
     id: 'dark', 
     position: 'bottom-center', 
     backgroundImage: '/src/assets/images/backgrounds/dark-forest.png',
     name: '어둠의 숲'
   },
   { 
     id: 'light', 
     position: 'bottom-right', 
     backgroundImage: '/src/assets/images/backgrounds/light-forest.png',
     name: '빛의 숲'
   }
 ];

 const handleForestClick = (forestId) => {
   navigate(`/forest/${forestId}`);
 };

 return (
   <MapContainer>
     {forests.map(forest => (
       <ForestButton
         key={forest.id}
         position={forest.position}
         backgroundImage={forest.backgroundImage}
         onClick={() => handleForestClick(forest.id)}
       >
         {forest.name}
       </ForestButton>
     ))}
   </MapContainer>
 );
};

const MapContainer = styled.div`
 position: relative;
 width: 300px;
 height: 300px;
 background: url('/src/assets/images/backgrounds/map.png') no-repeat center center;
 background-size: cover;
 display: flex;
 flex-wrap: wrap;
`;

const ForestButton = styled.button`
 position: absolute;
 width: 80px;
 height: 80px;
 background: url(${({ backgroundImage }) => backgroundImage}) no-repeat center center;
 background-size: cover;
 border: none;
 cursor: pointer;
 ${({ position }) => position === 'top-left' && 'top: 10px; left: 10px;'}
 ${({ position }) => position === 'top-center' && 'top: 10px; left: calc(50% - 40px);'}
 ${({ position }) => position === 'top-right' && 'top: 10px; right: 10px;'}
 ${({ position }) => position === 'bottom-left' && 'bottom: 10px; left: 10px;'}
 ${({ position }) => position === 'bottom-center' && 'bottom: 10px; left: calc(50% - 40px);'}
 ${({ position }) => position === 'bottom-right' && 'bottom: 10px; right: 10px;'}
`;

export default MiniMap;