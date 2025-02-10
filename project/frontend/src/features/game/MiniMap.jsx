import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const MiniMap = () => {
  const { gameState } = useGame();

  return (
    <MapContainer>
      {[1, 2, 3, 4, 5].map(num => (
        <ForestNode 
          key={num}
          isActive={gameState.currentForest === num}
        >
          {num}
        </ForestNode>
      ))}
    </MapContainer>
  );
};

const MapContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 10px;
  display: flex;
  gap: 10px;
`;

const ForestNode = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${props => props.isActive ? '#90EE90' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.isActive ? 'black' : 'white'};
`;

export default MiniMap;