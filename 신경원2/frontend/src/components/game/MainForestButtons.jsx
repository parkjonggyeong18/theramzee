// components/game/MainForestButtons.jsx
import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MainForestButtons = () => {
 const { gameState, chargeFatigue, saveUserAcorns, startEmergency } = useGame();
 const [isStorageActive, setIsStorageActive] = useState(false);
 const [isEnergyActive, setIsEnergyActive] = useState(false);
 const [timer, setTimer] = useState(null);

 const clkSave = () => {
   if (gameState.evilSquirrel !== false || gameState.heldAcorns === 0 || isStorageActive) return;
   
   setIsStorageActive(true);
   const storageTimer = setTimeout(() => {
    saveUserAcorns();
    setIsStorageActive(false);
   }, 10000); // 10초
   setTimer(storageTimer);
 };

 const clkFatigue = () => {
   if (gameState.fatigue >= 3 || isEnergyActive) return;

   setIsEnergyActive(true);
   const energyTimer = setTimeout(() => {
    chargeFatigue();
    setIsEnergyActive(false);
   }, gameState.evilSquirrel === false ? 5000 : 10000); // 착한 다람쥐 5초, 나쁜 다람쥐 10초
   setTimer(energyTimer);
 };

 const clkEmergency = () => {
  startEmergency();
 }

 const cancelAction = () => {
   clearTimeout(timer);
   setIsStorageActive(false);
   setIsEnergyActive(false);
   setTimer(null);
 };

 return (
  <ButtonContainer>
    {gameState.evilSquirrel === false && (
      <StorageButton 
        onClick={clkSave}
        disabled={isStorageActive || gameState.heldAcorns === 0}
        $isActive={isStorageActive}
      >
        {isStorageActive ? '저장중...' : '창고'}
        {isStorageActive && <ProgressBar />}
      </StorageButton>
    )}

    <EnergyButton 
      onClick={clkFatigue}
      disabled={isEnergyActive || gameState.fatigue >= 3}
      $isActive={isEnergyActive}
      $evilSquirrel={gameState.evilSquirrel}
    >
      {isEnergyActive ? '충전중...' : '에너지'}
      {isEnergyActive && <ProgressBar />}
    </EnergyButton>

    <EmergencyButton 
      onClick={clkEmergency}
      disabled={gameState.hasUsedEmergency}
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
 display: flex;
 gap: 20px;
 z-index: 11;
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
 background-color: ${props => props.$evilSquirrel === false ? '#90EE90' : '#FF4444'};
 color: ${props => props.$evilSquirrel === false ? 'black' : 'white'};
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
`;

export default MainForestButtons;