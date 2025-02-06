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
<<<<<<< HEAD
     id: 'foggy', 
     position: 'bottom-center', 
     backgroundImage: '/src/assets/images/backgrounds/foggy-forest.png',
     name: '안개낀 숲'
   },
   { 
     id: 'breathing', 
     position: 'bottom-right', 
     backgroundImage: '/src/assets/images/backgrounds/breathing-forest.png',
     name: '숨쉬는 숲'
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
   }
 ];

 const handleForestClick = (forestId) => {
<<<<<<< HEAD
   // 죽었을 때도 관전은 가능하도록 함
   navigate(`/game/${gameState.roomId}/forest/${forestId}`);
 };

 const handleMainForestClick = () => {
   navigate(`/game/${gameState.roomId}/main`);
=======
   navigate(`/forest/${forestId}`);
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
 };

 return (
   <MapContainer>
<<<<<<< HEAD
     <ForestGrid>
       {forests.map((forest) => (
         <ForestButton
           key={forest.id}
           $position={forest.position}
           $backgroundImage={forest.backgroundImage}
           onClick={() => handleForestClick(forest.id)}
           title={forest.name}
         />
       ))}
       <MainForestButton
         onClick={handleMainForestClick}
         $backgroundImage="/src/assets/images/backgrounds/main-forest.gif"
       />
     </ForestGrid>
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
   </MapContainer>
 );
};

const MapContainer = styled.div`
<<<<<<< HEAD
 position: absolute;
 bottom: 20px;
 right: 20px;
 width: 200px;
 height: 200px;
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
 grid-area: 2 / 2 / 3 / 3;

 &:hover {
   transform: scale(1.1);
   box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
 }
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default MiniMap;