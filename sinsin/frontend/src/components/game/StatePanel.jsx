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
           />
         ))}
       </FatigueBar>
     </StateItem>
   </StatePanelContainer>
 );
};

const StatePanelContainer = styled.div`
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
`;

const FatigueBar = styled.div`
 display: flex;
 gap: 5px;
`;

const FatiguePoint = styled.div`
 width: 20px;
 height: 20px;
 background: ${({ $isFilled }) => ($isFilled ? 'red' : 'gray')};
 border-radius: 50%;
`;

export default StatePanel;