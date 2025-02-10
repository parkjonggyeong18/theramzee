import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';
import { useParams } from 'react-router-dom';
import { moveForest } from '../../api/gameService';

const MainForestButtons = () => {
  const { roomId } = useParams();
  const { gameState } = useGame();

  const handleMove = async (forestNumber) => {
    try {
      await moveForest(roomId, gameState.myPlayerNum, forestNumber);
    } catch (error) {
      console.error('Failed to move:', error);
    }
  };

  return (
    <ButtonsContainer>
      {[1, 2, 3, 4, 5].map(num => (
        <ForestButton
          key={num}
          onClick={() => handleMove(num)}
          disabled={!gameState.isStarted || gameState.isDead}
        >
          Forest {num}
        </ForestButton>
      ))}
    </ButtonsContainer>
  );
};

const ButtonsContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
`;

const ForestButton = styled.button`
  padding: 10px 20px;
  background-color: rgba(144, 238, 144, 0.8);
  border: none;
  border-radius: 5px;
  color: black;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: rgba(152, 251, 152, 0.9);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default MainForestButtons;