// components/game/vote/VoteScreen.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const VoteScreen = ({ onVoteEnd, isEmergency = false }) => {
  const { gameState, setGameState, players } = useGame();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [votes, setVotes] = useState({});
  const [timer, setTimer] = useState(180);  // 3분

  // 타이머 포맷팅 함수
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isEmergency) {
      // 게임 타이머 일시 정지
      setGameState(prev => ({
        ...prev,
        isPaused: true
      }));
    }

    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev === 0) {
          clearInterval(countdown);
          handleVoteEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [isEmergency, setGameState]);

  const handleVoteEnd = () => {
    const voteResult = Object.entries(votes).reduce((acc, [player, count]) => {
      if (count > acc.count) {
        return { player, count };
      }
      return acc;
    }, { player: null, count: 0 });

    onVoteEnd(voteResult.player);
  };

  const handleVote = (player) => {
    setVotes(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1
    }));
    setSelectedPlayer(player);
  };

  return (
    <VoteContainer>
      <VoteHeader>
        <h3>{isEmergency ? '긴급 투표' : '투표'}</h3>
        <Timer>{formatTime(timer)}</Timer>
      </VoteHeader>
      <VoteBody>
        {players.map(player => (
          <PlayerButton
            key={player.id}
            onClick={() => handleVote(player.id)}
            isSelected={selectedPlayer === player.id}
          >
            {player.name}
          </PlayerButton>
        ))}
      </VoteBody>
      <VoteFooter>
        <VoteButton onClick={handleVoteEnd}>투표 종료</VoteButton>
      </VoteFooter>
    </VoteContainer>
  );
};

const VoteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const VoteHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const Timer = styled.div`
  font-size: 1.5rem;
  color: red;
`;

const VoteBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PlayerButton = styled.button`
  padding: 10px;
  background: ${({ isSelected }) => (isSelected ? 'blue' : 'gray')};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const VoteFooter = styled.div`
  margin-top: 20px;
`;

const VoteButton = styled.button`
  padding: 10px 20px;
  background: green;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default VoteScreen;