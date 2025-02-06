// components/game/MainForestButtons.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MainForestButtons = ({ onEmergencyClick, emergencyDisabled }) => {
<<<<<<< HEAD
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
       fatigue: prev.fatigue + 1
     }));
     setIsEnergyActive(false);
   }, gameState.role === 'good' ? 5000 : 10000); // 착한 다람쥐 5초, 나쁜 다람쥐 10초
   setTimer(energyTimer);
 };

 const cancelAction = () => {
   clearTimeout(timer);
   setIsStorageActive(false);
   setIsEnergyActive(false);
   setTimer(null);
 };

 return (
   <ButtonContainer>
     {gameState.role === 'good' && (
       <StorageButton 
         onClick={handleStorageClick}
         disabled={isStorageActive || gameState.heldAcorns === 0}
         $isActive={isStorageActive}
       >
         {isStorageActive ? '저장중...' : '창고'}
         {isStorageActive && <ProgressBar />}
       </StorageButton>
     )}

     <EnergyButton 
       onClick={handleEnergyClick}
       disabled={isEnergyActive || gameState.fatigue >= 3}
       $isActive={isEnergyActive}
       $role={gameState.role}
     >
       {isEnergyActive ? '충전중...' : '에너지'}
       {isEnergyActive && <ProgressBar />}
     </EnergyButton>

     <EmergencyButton 
       onClick={onEmergencyClick}
       disabled={emergencyDisabled}
     >
       긴급
     </EmergencyButton>

     {(isStorageActive || isEnergyActive) && (
       <CancelButton onClick={cancelAction}>
         취소
       </CancelButton>
     )}
   </ButtonContainer>
 );
};

const ButtonContainer = styled.div`
 position: absolute;
 left: 50%;
 bottom: 100px;
 transform: translateX(-50%);
 display: flex;
 gap: 20px;
`;

const BaseButton = styled.button`
 padding: 15px 30px;
 border: none;
 border-radius: 10px;
 font-family: 'JejuHallasan';
 font-size: 1.2rem;
 cursor: pointer;
 position: relative;
 overflow: hidden;

 &:disabled {
   opacity: 0.5;
   cursor: not-allowed;
 }
`;

const StorageButton = styled(BaseButton)`
 background-color: #90EE90;
 color: black;
 opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EnergyButton = styled(BaseButton)`
 background-color: ${props => props.$role === 'good' ? '#90EE90' : '#FF4444'};
 color: ${props => props.$role === 'good' ? 'black' : 'white'};
 opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EmergencyButton = styled(BaseButton)`
 background-color: #FF4444;
 color: white;

 &:disabled {
   background-color: #666;
 }
`;

const CancelButton = styled(BaseButton)`
 background-color: #666;
 color: white;
`;

const ProgressBar = styled.div`
 position: absolute;
 bottom: 0;
 left: 0;
 height: 3px;
 background-color: rgba(255, 255, 255, 0.8);
 animation: progress 10s linear forwards;

 @keyframes progress {
   from { width: 0; }
   to { width: 100%; }
 }
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default MainForestButtons;