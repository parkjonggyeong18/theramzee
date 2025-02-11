// components/game/MissionButton.jsx
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MissionButton = ({ 
 onClick, 
 completed = false,
 disabled = false,
}) => {
 const { gameState } = useGame();
 const isDisabled = disabled || 
   completed || 
   (gameState.role === 'good' && gameState.fatigue < 1);

 return (
   <StyledMissionButton
     onClick={onClick}
     disabled={isDisabled}
     $completed={completed}
     $isKillable={gameState.role === 'bad' && gameState.fatigue >= 3}
   >
     ⭐
     {/* 추후 이미지로 변경 예정 
     backgroundImage props 추가 후:
     <StyledMissionButton
       onClick={onClick}
       disabled={isDisabled}
       $completed={completed}
       $isKillable={gameState.role === 'bad' && gameState.fatigue >= 3}
       $backgroundImage={backgroundImage}
     />
     */}
   </StyledMissionButton>
 );
};

const StyledMissionButton = styled.button`
 width: 50px;
 height: 50px;
 border: none;
 border-radius: 50%;
 background: ${props => props.$completed ? '#666' : '#FFD700'};
 color: white;
 font-size: 1.5rem;
 cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
 opacity: ${props => props.disabled ? 0.5 : 1};
 transition: transform 0.2s;

 /* 추후 이미지 버튼으로 변경 시 추가할 스타일
 background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
 background-size: cover;
 background-position: center;
 background-color: ${props => !props.$backgroundImage && (props.$completed ? '#666' : '#FFD700')};
 */

 &:hover:not(:disabled) {
   transform: scale(1.2);
   ${props => props.$isKillable && `
     background: rgba(255, 0, 0, 0.2);
   `}
 }
`;

export default MissionButton;