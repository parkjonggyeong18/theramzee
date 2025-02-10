import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import UserVideoComponent from '../openVidu/components/UserVideoComponent';

const VideoGrid = ({ subscribers }) => {
  const { gameState } = useGame();
  
  return (
    <GridContainer>
      {subscribers.map((sub, i) => (
        <VideoContainer key={i} isDead={gameState.killedPlayers.includes(sub.id)}>
          <UserVideoComponent streamManager={sub} />
        </VideoContainer>
      ))}
    </GridContainer>
  );
};

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
  max-width: 400px;
  margin: 0 auto;
`;

const VideoContainer = styled.div`
  aspect-ratio: 16/9;
  background-color: ${props => props.isDead ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #90EE90;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default VideoGrid;