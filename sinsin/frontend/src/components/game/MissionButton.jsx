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
      >
      */}
    </StyledMissionButton>
  );
};

const StyledMissionButton = styled.button`
  width: 50px;
  height: 50px;
  background: ${({ $completed }) => ($completed ? 'green' : 'gray')};
  border: none;
  border-radius: 50%;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;

  &:before {
    content: ${({ $isKillable }) => ($isKillable ? '"🔪"' : '""')};
    position: absolute;
    top: -10px;
    right: -10px;
    font-size: 20px;
    color: red;
  }
`;

export default MissionButton;