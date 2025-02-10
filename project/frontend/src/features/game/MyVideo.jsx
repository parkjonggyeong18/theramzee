import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import UserVideoComponent from '../openVidu/components/UserVideoComponent';

const MyVideo = ({ publisher }) => {
  const { gameState } = useGame();
  
  return (
    <Container isDead={gameState.isDead}>
      {publisher && <UserVideoComponent streamManager={publisher} />}
    </Container>
  );
};

const Container = styled.div`
  width: 180px;
  aspect-ratio: 16/9;
  background-color: ${props => props.isDead ? 'rgba(255, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.5)'};
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #FFD700;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export default MyVideo;