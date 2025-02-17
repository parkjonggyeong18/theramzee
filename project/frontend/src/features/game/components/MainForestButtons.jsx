import { useState } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import EmergencyVoteModal from '../../../features/game/components/vote/EmergencyVoteModal';
import * as gameService from '../../../api/gameService';  // gameService import 추가
import { useParams } from 'react-router-dom';  // useParam

const MainForestButtons = () => {
  const { roomId } = useParams();
  const { 
    gameState, 
    startSaveAcorns, 
    startChargeFatigue, 
    startEmergency,
    cancelAction, 
    isStorageActive, 
    isEnergyActive,
    setGameState,
    players,
    startEmergencyVote
  } = useGame();

  const clkSave = () => {
    startSaveAcorns();
  };

  const clkFatigue = () => {
    startChargeFatigue();
  };

  const clkEmergency = async () => {
    if (gameState.isDead || gameState.hasUsedEmergency) return;
    
    try { 
      startEmergencyVote();
      gameState.hasUsedEmergency = true;
    } catch (error) {
      console.error('Failed to start emergency vote:', error);
    }
  };

  return (
    <ButtonContainer>
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

      {/* 모달 컴포넌트를 분리하여 렌더링 */}
      <EmergencyVoteModal
        players={players}
      />
    </ButtonContainer>
  );
};


const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  z-index: 11;
  justify-content: flex-end; /* 오른쪽 정렬 */
`;

const BaseButton = styled.button`
 padding: 20px 20px;
  border: none;
  border-radius: 10px;
  font-family: 'JejuHallasan';
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0); /* 배경 투명 */
  color: rgba(0, 0, 0, 0); /* 글자 투명 */
  border: 2px solid rgba(0, 0, 0, 0); /* 테두리 투명 */
  transition: all 0.3s ease; /* 모든 속성 변화에 부드러운 효과 적용 */

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    background-color: rgba(239, 239, 13, 0.8); /* 배경색 반투명 */
    color: rgb(255, 255, 255); /* 글자색 검정 */
  }
`;

const StorageButton = styled(BaseButton)`
 
  top: -290px;  /* EnergyButton을 위에서 20px 만큼 이동 */
  left: -280px; /* EnergyButton을 왼쪽에서 50px 만큼 이동 */
`;

const EnergyButton = styled(BaseButton)`
  top: -70px;  /* EnergyButton을 위에서 20px 만큼 이동 */
  left: -335px; /* EnergyButton을 왼쪽에서 50px 만큼 이동 */
`;

const EmergencyButton = styled(BaseButton)`
  top: -260px;  /* EnergyButton을 위에서 20px 만큼 이동 */
  left: 130px; /* EnergyButton을 왼쪽에서 50px 만큼 이동 */
 }
`;

const CancelButton = styled(BaseButton)`
  top: -60px;  /* EnergyButton을 위에서 20px 만큼 이동 */
  left: -560px; /* EnergyButton을 왼쪽에서 50px 만큼 이동 */
background-color: rgba(255, 255, 255, 0); /* 배경 투명 */
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