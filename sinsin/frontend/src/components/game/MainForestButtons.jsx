// components/game/MainForestButtons.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MainForestButtons = ({ onEmergencyClick, emergencyDisabled }) => {
  const { gameState, setGameState } = useGame();
  const [isStorageActive, setIsStorageActive] = useState(false);
  const [isEnergyActive, setIsEnergyActive] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleStorageClick = () => {
    if (gameState.role !== 'good' || gameState.heldAcorns === 0 || isStorageActive) return;
    
    setIsStorageActive(true);
    const storageTimer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        totalAcorns: prev.totalAcorns + prev.heldAcorns,
        heldAcorns: 0
      }));
      setIsStorageActive(false);
    }, 10000); // 10초
    setTimer(storageTimer);
  };

  const handleEnergyClick = () => {
    if (gameState.fatigue >= 3 || isEnergyActive) return;

    setIsEnergyActive(true);
    const energyTimer = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        fatigue: prev.fatigue - 1
      }));
      setIsEnergyActive(false);
    }, 10000); // 10초
    setTimer(energyTimer);
  };

  return (
    <ButtonContainer>
      <ActionButton onClick={handleStorageClick} disabled={isStorageActive}>
        {isStorageActive ? '저장 중...' : '도토리 저장'}
      </ActionButton>
      <ActionButton onClick={handleEnergyClick} disabled={isEnergyActive}>
        {isEnergyActive ? '충전 중...' : '에너지 충전'}
      </ActionButton>
      <EmergencyButton onClick={onEmergencyClick} disabled={emergencyDisabled}>
        긴급 호출
      </EmergencyButton>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px;
  background: ${({ disabled }) => (disabled ? 'gray' : 'blue')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const EmergencyButton = styled.button`
  padding: 10px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default MainForestButtons;