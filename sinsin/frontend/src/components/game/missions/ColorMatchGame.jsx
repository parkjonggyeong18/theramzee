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
<<<<<<< HEAD
      <GameTitle>같은 색으로 맞추기</GameTitle>
      
      <ColorGrid>
        {selectedColors.map((selectedColor, index) => (
          <ColorSlot key={index}>
            {selectedColor ? (
              <ColorButton
                $color={selectedColor}
                onClick={() => !isSuccess && setSelectedColors(prev => 
                  prev.map((c, i) => i === index ? '' : c)
                )}
              />
            ) : (
              <ColorOptions>
                {colors.map(color => (
                  <ColorOption
                    key={color}
                    $color={color}
                    onClick={() => !isSuccess && handleColorClick(index, color)}
                  />
                ))}
              </ColorOptions>
            )}
          </ColorSlot>
        ))}
      </ColorGrid>

      {isSuccess && <SuccessMessage>성공!</SuccessMessage>}
      
      <CloseButton onClick={onClose}>나가기</CloseButton>
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
    </GameContainer>
  );
};

const GameContainer = styled.div`
<<<<<<< HEAD
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
`;

const GameTitle = styled.h2`
  color: white;
  font-family: 'JejuHallasan';
  margin-bottom: 30px;
`;

const ColorGrid = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const ColorSlot = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ColorButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$color};
  cursor: pointer;
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 5px;
`;

const ColorOption = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
  background-color: ${props => props.$color};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.2);
  }
`;

const SuccessMessage = styled.div`
  color: #90EE90;
  font-size: 2rem;
  font-family: 'JejuHallasan';
  animation: bounce 0.5s infinite alternate;

  @keyframes bounce {
    from { transform: scale(1); }
    to { transform: scale(1.2); }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px 20px;
  background: #FF4444;
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
<<<<<<< HEAD
  font-family: 'JejuHallasan';
=======
`;

const SuccessMessage = styled.div`
  margin-top: 20px;
  color: green;
  font-size: 18px;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default ColorMatchGame;