// components/game/StatePanel.jsx
import { useGame } from '../../contexts/GameContext';
import styled from 'styled-components';

const StatePanel = () => {
 const { gameState } = useGame();

 // 착한 다람쥐의 경우 도토리 정보와 피로도 표시
 // 나쁜 다람쥐의 경우 피로도만 표시
 return (
   <StatePanelContainer>
     {gameState.role === 'good' && (
       <>
         <StateItem>
           <StateLabel>총 도토리 수:</StateLabel>
           <StateValue>{gameState.totalAcorns} / 3</StateValue>
         </StateItem>
         <StateItem>
           <StateLabel>보유 도토리:</StateLabel>
           <StateValue>{gameState.heldAcorns} / 3</StateValue>
         </StateItem>
       </>
     )}
     <StateItem>
       <StateLabel>피로도:</StateLabel>
       <FatigueBar>
         {[...Array(3)].map((_, index) => (
           <FatiguePoint 
             key={index}
             $isFilled={index < gameState.fatigue}
<<<<<<< HEAD
             $role={gameState.role}
=======
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
           />
         ))}
       </FatigueBar>
     </StateItem>
<<<<<<< HEAD
     {gameState.role === 'bad' && gameState.fatigue >= 3 && (
       <KillModeText>킬 모드 활성화!</KillModeText>
     )}
=======
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
   </StatePanelContainer>
 );
};

const StatePanelContainer = styled.div`
<<<<<<< HEAD
 background: rgba(0, 0, 0, 0.7);
 padding: 15px;
 border-radius: 10px;
 min-width: 200px;
 color: white;
 font-family: 'JejuHallasan';
`;

const StateItem = styled.div`
 margin-bottom: 10px;
 display: flex;
 align-items: center;
 justify-content: space-between;
`;

const StateLabel = styled.span`
 font-size: 1rem;
 margin-right: 10px;
`;

const StateValue = styled.span`
 font-size: 1.2rem;
 color: #90EE90;
=======
 display: flex;
 flex-direction: column;
 gap: 10px;
 padding: 20px;
 background: rgba(0, 0, 0, 0.5);
 border-radius: 5px;
 color: white;
`;

const StateItem = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
`;

const StateLabel = styled.div`
 font-size: 1rem;
`;

const StateValue = styled.div`
 font-size: 1rem;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const FatigueBar = styled.div`
 display: flex;
 gap: 5px;
`;

const FatiguePoint = styled.div`
 width: 20px;
 height: 20px;
<<<<<<< HEAD
 border-radius: 50%;
 background-color: ${props => 
   props.$isFilled 
     ? props.$role === 'good' 
       ? '#90EE90' 
       : '#FF4444'
     : 'rgba(255, 255, 255, 0.2)'
 };
 transition: background-color 0.3s;
`;

const KillModeText = styled.div`
 color: #FF4444;
 font-size: 1.2rem;
 text-align: center;
 margin-top: 10px;
 animation: blink 1s infinite;

 @keyframes blink {
   0% { opacity: 1; }
   50% { opacity: 0.5; }
   100% { opacity: 1; }
 }
=======
 background: ${({ $isFilled }) => ($isFilled ? 'red' : 'gray')};
 border-radius: 50%;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default StatePanel;