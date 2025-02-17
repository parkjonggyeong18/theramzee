import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Z_INDEX } from '../../../../constants/zIndex';
import { useGame } from '../../../../contexts/GameContext';
import { subscribeToTopic, unsubscribeTopic } from '../../../../api/stomp';
import { sendVote } from '../../../../api/gameService';

const EmergencyVoteModal = ({ isOpen, onClose, players, roomId }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [votes, setVotes] = useState({});
  const currentPlayer = sessionStorage.getItem('nickName');
  const { gameState, setGameState } = useGame();

  useEffect(() => {
    if (isOpen && roomId) {
      const voteSubscription = subscribeToTopic(
        `/topic/game/${roomId}/vote`,
        (message) => {
          if (message.success) {
            setVotes(prev => ({
              ...prev,
              [message.data.votedPlayer]: message.data.voteCount
            }));

            // 투표 상태 업데이트
            setGameState(prev => ({
              ...prev,
              currentVotes: {
                ...prev.currentVotes,
                [message.data.voter]: message.data.votedPlayer
              }
            }));
          }
        }
      );

      return () => {
        if (voteSubscription) {
          unsubscribeTopic(voteSubscription);
        }
      };
    }
  }, [isOpen, roomId, setGameState]);

  if (!isOpen) return null;

  const clkVote = (roomId, nickName) => {
    sendVote(roomId, nickName)
  };

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>긴급 투표</Title>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </Header>

        <AlertBox>
          의심되는 플레이어를 선택하여 투표해주세요. 다수결로 결정됩니다.
        </AlertBox>

        <PlayerGrid>
          {players.map((player) => (
            <PlayerCard
              key={player.nickName}
              $isSelected={selectedPlayer === player.nickName}
              $isDisabled={player.nickName === currentPlayer}
              onClick={() => clkVote(roomId, player.nickName)}
            >
              <PlayerInfo>
                <PlayerName>{player.nickName}</PlayerName>
                <VoteCount>{gameState[player.nickName] || 0}</VoteCount>
              </PlayerInfo>
            </PlayerCard>
          ))}
        </PlayerGrid>

        <ButtonGroup>
          <CancelButton onClick={onClose}>
            취소
          </CancelButton>
          <VoteButton
            onClick={sendVote}
            disabled={!selectedPlayer}
          >
            투표하기
          </VoteButton>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 4px;
  transition: color 0.2s;

  &:hover {
    color: #333;
  }
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`;

const BaseButton = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'JejuHallasan';
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(BaseButton)`
  background-color: #f0f0f0;
  color: #666;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const VoteButton = styled(BaseButton)`
  background-color: #4a90e2;
  color: white;

  &:hover:not(:disabled) {
    background-color: #357abd;
  }

  &:disabled {
    background-color: #cccccc;
  }
`;

export default EmergencyVoteModal;