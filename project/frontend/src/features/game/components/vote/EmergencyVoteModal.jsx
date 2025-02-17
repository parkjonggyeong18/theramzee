import React, { useState } from 'react';
import styled from 'styled-components';
import { Z_INDEX } from '../../../../constants/zIndex';
import { useGame } from '../../../../contexts/GameContext';
import { sendVote } from '../../../../api/gameService';

const EmergencyVoteModal = ({ isOpen, players, roomId }) => {
  const { gameState } = useGame();
  const [isVoteCompleted, setIsVoteCompleted] = useState(false);

  if (!isOpen) return null;

  const clkVote = (roomId, nickName) => {
    // 이미 투표가 완료된 경우 클릭 방지
    if (isVoteCompleted) return;

    // 투표 처리
    sendVote(roomId, nickName)

    // 투표 완료 상태로 변경
    setIsVoteCompleted(true);
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>긴급 투표</Title>
        </Header>

        <AlertBox>
          의심되는 플레이어를 선택하여 투표해주세요.
          기회는 단 한번, 신중하게 선택하세요.
        </AlertBox>

        <PlayerGrid>
          {players.map((player) => (
            <PlayerCard
              key={player.nickName}
              $isDisabled={isVoteCompleted}
              onClick={() => clkVote(roomId, player.nickName)}
            >
              <PlayerInfo>
                <PlayerName>{player.nickName}</PlayerName>
                <VoteCount>{gameState[player.nickName] || 0}</VoteCount>
              </PlayerInfo>
            </PlayerCard>
          ))}
        </PlayerGrid>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${Z_INDEX.OVERLAY};
`;

const ModalContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  width: 34%;
  max-width: 800px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-family: 'JejuHallasan';
  color: #333;
  margin: 0;
`;

const AlertBox = styled.div`
  background-color: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  font-family: 'JejuHallasan';
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
`;

const PlayerCard = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 2px solid ${props => props.$isSelected ? '#4a90e2' : '#ddd'};
  background-color: ${props => props.$isSelected ? 'rgba(74, 144, 226, 0.1)' : 'white'};
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.$isDisabled ? 0.5 : 1};
  transition: all 0.2s;

  &:hover {
    ${props => !props.$isDisabled && `
      border-color: #4a90e2;
      transform: translateY(-2px);
    `}
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PlayerName = styled.span`
  font-family: 'JejuHallasan';
  font-size: 1.2rem;
  color: #333;
`;

const VoteCount = styled.span`
  background-color: #f0f0f0;
  padding: 4px 12px;
  border-radius: 16px;
  font-family: 'JejuHallasan';
  font-size: 0.9rem;
  color: #666;
`;

export default EmergencyVoteModal;