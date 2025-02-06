// components/game/missions/ColorMatchGame.jsx
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../contexts/GameContext';

const ColorMatchGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [colors, setColors] = useState(['red', 'blue', 'green']);
  const [selectedColors, setSelectedColors] = useState(['', '', '']);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleColorClick = (index, color) => {
    const newColors = [...selectedColors];
    newColors[index] = color;
    setSelectedColors(newColors);

    // 모든 색상이 같은지 확인
    if (newColors.every(c => c === newColors[0] && c !== '')) {
      setIsSuccess(true);
      // 3초 후 성공 처리
      setTimeout(() => {
        if (gameState.role === 'good') {
          setGameState(prev => ({
            ...prev,
            heldAcorns: prev.heldAcorns + 3
          }));
        }
        onComplete();
      }, 3000);
    }
  };

  return (
    <GameContainer>
      <GameHeader>
        <h3>색상 맞추기 게임</h3>
        <CloseButton onClick={onClose}>X</CloseButton>
      </GameHeader>
      <GameBody>
        {colors.map((color, index) => (
          <ColorButton
            key={index}
            color={color}
            onClick={() => handleColorClick(index, color)}
          >
            {color}
          </ColorButton>
        ))}
      </GameBody>
      {isSuccess && <SuccessMessage>성공!</SuccessMessage>}
    </GameContainer>
  );
};

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const GameBody = styled.div`
  display: flex;
  gap: 10px;
`;

const ColorButton = styled.button`
  padding: 10px;
  background: ${({ color }) => color};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SuccessMessage = styled.div`
  margin-top: 20px;
  color: green;
  font-size: 18px;
`;

export default ColorMatchGame;