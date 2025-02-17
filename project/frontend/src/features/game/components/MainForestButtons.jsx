import { useState,useEffect } from 'react';
import {styled,createGlobalStyle} from 'styled-components';
import { useGame } from '../../../contexts/GameContext';
import EmergencyVoteModal from '../../../features/game/components/vote/EmergencyVoteModal';
import * as gameService from '../../../api/gameService';  // gameService import 추가
import { useParams } from 'react-router-dom';  // useParam
import buttonBgImage from '../../../assets/images/object/plat.png';


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
    setGameState,players  
  } = useGame();
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const clkSave = () => {
    startSaveAcorns();
  };

  const clkFatigue = () => {
    startChargeFatigue();
  };

  const clkEmergency = async () => {
    if (gameState.isDead || gameState.hasUsedEmergency) return;
    
    try {
      const nicknameList = players.map(player => player.nickName);
      await gameService.startEmergencyVote(roomId, nicknameList);
    } catch (error) {
      console.error('Failed to start emergency vote:', error);
    }
  };
  
  const handleVote = (selectedPlayer) => {
    setGameState(prev => ({
      ...prev,
      isVoting: true,
      voteType: 'emergency',
      votes: {}
    }));
    
    startEmergency();
    setIsVoteModalOpen(false);
  };

  useEffect(() => {
    // 폰트 미리 로드
    const font = new FontFace(
      'NeoDunggeunmoPro-Regular',
      `url('/fonts/NeoDunggeunmoPro-Regular.ttf')`,
      { display: 'swap' }
    );

    // 폰트 로드 및 적용
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    }).catch((error) => {
      console.error('폰트 로드 실패:', error);
    });
  }, []);

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
        isOpen={isVoteModalOpen}
        onClose={() => setIsVoteModalOpen(false)}
        players={players}
        onVote={handleVote}
      />
    </ButtonContainer>
  );
};


const ButtonContainer = styled.div`
  display: flex;
  gap: 20px;
  z-index: 11;

  @font-face {
    font-family: 'NeoDunggeunmoPro-Regular';
    src: url('/fonts/NeoDunggeunmoPro-Regular.ttf') format('truetype');
    font-display: swap;
    font-weight: normal;
    font-style: normal;
  }
`;


const BaseButton = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
    font-family: 'NeoDunggeunmoPro-Regular', sans-serif;  
  font-size: 1.7rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background-image: url(${buttonBgImage});
  background-color: transparent; // 배경색 투명하게
  
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background-position: center;
  min-width: 150px;
  min-height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }

  &:active {
    transform: scale(0.95);
  }
`;

const StorageButton = styled(BaseButton)`
 
  opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EnergyButton = styled(BaseButton)`
 
  opacity: ${props => props.$isActive ? 0.8 : 1};
`;

const EmergencyButton = styled(BaseButton)`
  
`;

const CancelButton = styled(BaseButton)`
  filter: grayscale(1);
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