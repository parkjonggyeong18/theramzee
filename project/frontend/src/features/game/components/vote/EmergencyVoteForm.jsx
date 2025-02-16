import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Z_INDEX } from '../../../../constants/zIndex';
import { useGame } from '../../../../contexts/GameContext';

const EmergencyVoteForm = ({ onVoteEnd }) => {
  const { gameState, players } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [votes, setVotes] = useState({});
  const [timeLeft, setTimeLeft] = useState(180); // 3분
  const [hasVoted, setHasVoted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // 타이머 효과
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleVotingEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 투표 종료 처리
  const handleVotingEnd = () => {
    setShowResults(true);
    
    // 투표 집계
    const voteCounts = {};
    Object.values(votes).forEach(vote => {
      voteCounts[vote] = (voteCounts[vote] || 0) + 1;
    });

    // 가장 많은 표를 받은 플레이어 찾기
    let maxVotes = 0;
    let eliminatedPlayer = null;
    Object.entries(voteCounts).forEach(([player, count]) => {
      if (count > maxVotes) {
        maxVotes = count;
        eliminatedPlayer = player;
      }
    });

    // 3초 후에 결과 전달
    setTimeout(() => {
      onVoteEnd({
        winner: eliminatedPlayer === gameState.evilSquirrel ? 'good' : 'evil',
        eliminatedPlayer
      });
    }, 3000);
  };

  // 투표 제출
  const handleVoteSubmit = () => {
    if (!selectedPlayer || hasVoted) return;

    setVotes(prev => ({
      ...prev,
      [gameState.nickName]: selectedPlayer
    }));
    setHasVoted(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Overlay>
      <VoteContainer>
        <Title>긴급 회의</Title>
        <Timer>{formatTime(timeLeft)}</Timer>

        {showResults ? (
          <ResultsContainer>
            <h2>투표 결과</h2>
            {Object.entries(votes).map(([voter, votedFor]) => (
              <ResultRow key={voter}>
                <span>{voter}</span>
                <Arrow>→</Arrow>
                <span>{votedFor}</span>
              </ResultRow>
            ))}
          </ResultsContainer>
        ) : (
          <>
            <PlayerList>
              {players.map(player => (
                !gameState.killedPlayers?.includes(player.nickName) && (
                  <PlayerCard
                    key={player.nickName}
                    $isSelected={selectedPlayer === player.nickName}
                    $hasVoted={hasVoted}
                    onClick={() => !hasVoted && setSelectedPlayer(player.nickName)}
                  >
                    <PlayerName>{player.nickName}</PlayerName>
                    <VoteCount>
                      투표 수: {Object.values(votes).filter(v => v === player.nickName).length}
                    </VoteCount>
                  </PlayerCard>
                )
              ))}
            </PlayerList>

            <VoteButton
              onClick={handleVoteSubmit}
              disabled={!selectedPlayer || hasVoted}
            >
              {hasVoted ? '투표 완료!' : '투표하기'}
            </VoteButton>
          </>
        )}
      </VoteContainer>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${Z_INDEX.OVERLAY};
`;

const VoteContainer = styled.div`
  background: rgba(139, 69, 19, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 90%;
  max-width: 600px;
  text-align: center;
`;

const Title = styled.h2`
  color: white;
  font-size: 2.5rem;
  font-family: 'JejuHallasan';
  margin-bottom: 1rem;
`;

const Timer = styled.div`
  color: white;
  font-size: 2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 2rem;
`;

const PlayerList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
`;

const PlayerCard = styled.div`
  background: ${props => props.$isSelected ? '#90EE90' : 'rgba(255, 255, 255, 0.1)'};
  padding: 1.5rem;
  border-radius: 10px;
  cursor: ${props => props.$hasVoted ? 'default' : 'pointer'};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => !props.$hasVoted && 'scale(1.05)'};
    background: ${props => !props.$hasVoted && '#98FB98'};
  }
`;

const PlayerName = styled.div`
  color: white;
  font-size: 1.5rem;
  font-family: 'JejuHallasan';
  margin-bottom: 0.5rem;
`;

const VoteCount = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-family: 'JejuHallasan';
`;

const VoteButton = styled.button`
  background: #4CAF50;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  font-family: 'JejuHallasan';
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    background: #666;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: #45a049;
  }
`;

const ResultsContainer = styled.div`
  color: white;
  font-family: 'JejuHallasan';

  h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const ResultRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 0.5rem 0;
  font-size: 1.2rem;
`;

const Arrow = styled.span`
  color: #90EE90;
`;

export default EmergencyVoteForm;