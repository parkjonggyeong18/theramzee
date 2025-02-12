import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';
import { Z_INDEX } from '../../../../constants/zIndex';
import UserVideoComponent from '../../../openVidu/components/UserVideoComponent';

const VoteScreen = ({ 
  onVoteEnd,
  isEmergency = false  // 긴급 투표 여부
}) => {
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
        if (prev <= 1) {
          clearInterval(countdown);
          handleTimerEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(countdown);
      if (isEmergency) {
        // 게임 타이머 재개
        setGameState(prev => ({
          ...prev,
          isPaused: false
        }));
      }
    };
  }, []);

  const handleVote = (playerId) => {
    if (selectedPlayer || gameState.isDead) return;
    setSelectedPlayer(playerId);
    setVotes(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const handleTimerEnd = () => {
    if (!selectedPlayer) {
      // 시간 초과시 자동 처리
      if (isEmergency) {
        onVoteEnd({ 
          continues: true,
          message: '투표 시간이 초과되었습니다. 게임을 계속합니다.'
        });
      } else {
        onVoteEnd({ 
          winner: 'bad',
          reason: 'VOTE_TIMEOUT',
          message: '최종 투표 시간이 초과되었습니다. 나쁜 다람쥐의 승리입니다!'
        });
      }
    } else {
      handleVoteEnd();
    }
  };

  const handleVoteEnd = () => {
    // 최다 득표자 결정
    const maxVotes = Math.max(...Object.values(votes));
    const maxVotedPlayers = Object.entries(votes)
      .filter(([_, count]) => count === maxVotes)
      .map(([player]) => player);

    // 동률이 있는 경우
    if (maxVotedPlayers.length > 1) {
      if (isEmergency) {
        // 긴급 투표 동률 - 게임 계속
        onVoteEnd({ 
          continues: true,
          message: '투표가 동률로 종료되었습니다. 게임을 계속합니다.'
        });
      } else {
        // 최종 투표 동률 - 나쁜 다람쥐 승리
        onVoteEnd({ 
          winner: 'bad',
          reason: 'VOTE_TIE',
          message: '최종 투표가 동률입니다. 나쁜 다람쥐의 승리입니다!'
        });
      }
      return;
    }

    // 단일 최다 득표자가 있는 경우
    const votedPlayer = maxVotedPlayers[0];
    const votedPlayerData = players.find(p => p.nickName === votedPlayer);

    setGameState(prev => ({
      ...prev,
      lastVotedPlayer: votedPlayer
    }));

    if (isEmergency) {
      // 긴급 투표 결과 처리
      if (votedPlayerData.evilSquirrel) {
        // 나쁜 다람쥐가 지목됨 -> 착한 다람쥐 승리
        onVoteEnd({
          winner: 'good',
          reason: 'EVIL_ELIMINATED',
          message: '착한 다람쥐 승리! 긴급 투표로 나쁜 다람쥐를 찾아냈습니다.',
          eliminatedPlayer: votedPlayer
        });
      } else {
        // 착한 다람쥐가 지목됨 -> 게임 계속
        onVoteEnd({
          continues: true,
          eliminatedPlayer: votedPlayer,
          message: '투표로 지목된 플레이어가 제거되었습니다.'
        });
      }
    } else {
      // 최종 투표 결과 처리
      if (votedPlayerData.evilSquirrel) {
        // 나쁜 다람쥐가 지목됨 -> 착한 다람쥐 승리
        onVoteEnd({
          winner: 'good',
          reason: 'EVIL_ELIMINATED',
          message: '착한 다람쥐 승리! 최종 투표로 나쁜 다람쥐를 찾아냈습니다.',
          eliminatedPlayer: votedPlayer
        });
      } else {
        // 착한 다람쥐가 지목됨 -> 나쁜 다람쥐 승리
        onVoteEnd({
          winner: 'bad',
          reason: 'FINAL_VOTE_KILL',
          message: '나쁜 다람쥐 승리! 최종 투표에서 착한 다람쥐를 죽였습니다.',
          eliminatedPlayer: votedPlayer
        });
      }
    }
  };

  return (
    <VoteContainer>
      <VoteTitle>{isEmergency ? '긴급 투표' : '최종 투표'}</VoteTitle>
      <Timer>{formatTime(timer)}</Timer>

      <PlayerGrid>
        {players.map(player => {
          const isKilled = gameState.killedPlayers.includes(player.nickName);
          if (isKilled) return null;

          return (
            <PlayerCard
              key={player.nickName}
              onClick={() => handleVote(player.nickName)}
              $selected={selectedPlayer === player.nickName}
              disabled={selectedPlayer || gameState.isDead}
            >
              <VideoContainer>
                {player.streamManager && (
                  <UserVideoComponent streamManager={player.streamManager} />
                )}
              </VideoContainer>
              <PlayerName>{player.nickName}</PlayerName>
              {votes[player.nickName] > 0 && (
                <VoteCount>{votes[player.nickName]}</VoteCount>
              )}
            </PlayerCard>
          );
        })}
      </PlayerGrid>
    </VoteContainer>
  );
};

const VoteContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  z-index: ${Z_INDEX.OVERLAY};
`;

const VoteTitle = styled.h2`
  color: white;
  font-size: 2rem;
  font-family: 'JejuHallasan';
  margin-bottom: 20px;
`;

const Timer = styled.div`
  color: white;
  font-size: 3rem;
  font-family: 'JejuHallasan';
  margin-bottom: 40px;
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  max-width: 1200px;
  width: 100%;
`;

const PlayerCard = styled.button`
  position: relative;
  width: 100%;
  aspect-ratio: 4/3;
  background: #333;
  border: none;
  border-radius: 10px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  overflow: hidden;

  ${props => props.$selected && `
    border: 3px solid #FFD700;
  `}

  &:hover:not(:disabled) {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PlayerName = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  font-family: 'JejuHallasan';
`;

const VoteCount = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #FFD700;
  color: black;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

export default VoteScreen;