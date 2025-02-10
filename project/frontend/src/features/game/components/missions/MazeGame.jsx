// MazeGame.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useGame } from '../../../../contexts/GameContext';

const MazeGame = ({ onComplete, onClose }) => {
  const { gameState, setGameState } = useGame();
  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [message, setMessage] = useState("살아있는 숲의 미로를 통과해보세요!");
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameRef = useRef(null);

  useEffect(() => {
    generateMaze();
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  // 방향키 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      // 방향키 입력 시 브라우저의 기본 스크롤 동작 방지
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      
      switch(e.key) {
        case 'ArrowUp':
          handleMove(playerPos.x, playerPos.y - 1);
          break;
        case 'ArrowDown':
          handleMove(playerPos.x, playerPos.y + 1);
          break;
        case 'ArrowLeft':
          handleMove(playerPos.x - 1, playerPos.y);
          break;
        case 'ArrowRight':
          handleMove(playerPos.x + 1, playerPos.y);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPos, gameOver, maze]);

  const generateMaze = () => {
    const newMaze = Array(5)
      .fill(null)
      .map(() =>
        Array(5)
          .fill(null)
          .map(() => ({
            isWall: Math.random() < 0.3,
            isVisited: false,
            isPath: false,
            isTrap: false,
            isTrapVisible: false,
          }))
      );

    // 시작 및 종료 셀 설정
    newMaze[0][0] = { isWall: false, isVisited: true, isPath: true, isStart: true, isTrap: false, isTrapVisible: false };
    newMaze[4][4] = { isWall: false, isVisited: false, isPath: false, isEnd: true, isTrap: false, isTrapVisible: false };

    // 미로를 통과하는 경로 확보
    const pathCells = [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4]];
    pathCells.forEach(([y, x]) => {
      newMaze[y][x].isWall = false;
    });

    placeTraps(newMaze, Math.random() < 0.5 ? 1 : 2);
    setMaze(newMaze);
  };

  const placeTraps = (maze, count) => {
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * 5);
      const y = Math.floor(Math.random() * 5);

      if (!maze[y][x].isWall && !maze[y][x].isStart && !maze[y][x].isEnd && !maze[y][x].isTrap) {
        maze[y][x].isTrap = true;
        placed++;
      }
    }
  };

  const handleMove = (x, y) => {
    if (gameOver) return;
    if (x < 0 || x >= 5 || y < 0 || y >= 5) return;
    if (maze[y][x].isWall) {
      setMessage("🌿 나뭇가지가 막고 있어요!");
      return;
    }

    if (maze[y][x].isTrap) {
      setMessage("❌ 파리지옥에 잡혔어요!");
      setGameOver(true);
      const newMaze = maze.map(row =>
        row.map(cell => ({
          ...cell,
          isTrapVisible: cell.isTrap ? true : cell.isTrapVisible,
        }))
      );
      setMaze(newMaze);
      setTimeout(() => onClose(), 1500);
      return;
    }

    setPlayerPos({ x, y });
    const newMaze = maze.map(row => row.map(cell => ({ ...cell })));
    newMaze[y][x].isVisited = true;
    newMaze[y][x].isPath = true;
    setMaze(newMaze);
    setMoves(prev => prev + 1);

    if (x === 4 && y === 4) {
      setMessage("🌟 미로를 통과했어요!");
      setGameOver(true);
      if (gameState.role === 'good') {
        setGameState(prev => ({
          ...prev,
          heldAcorns: prev.heldAcorns + 3,
        }));
      }
      setTimeout(() => onComplete(), 1500);
    }
  };

  return (
    <GameOverlay onClick={onClose}>
      <GameContent onClick={e => e.stopPropagation()} tabIndex={0} ref={gameRef}>
        <GameTitle>🌿 살아있는 숲의 미로</GameTitle>
        <MazeContainer>
          <MazeGrid>
            {maze.map((row, y) => (
              // MazeRow가 display: contents를 가지면, 자식들이 MazeGrid의 직접적인 그리드 아이템이 됩니다.
              <MazeRow key={y}>
                {row.map((cell, x) => (
                  <MazeCell key={`${x}-${y}`} $isWall={cell.isWall} $isPath={cell.isPath}>
                    {playerPos.x === x && playerPos.y === y && '🌰'}
                    {cell.isEnd && !cell.isPath && '🏠'}
                    {cell.isTrap && cell.isTrapVisible && '🕸️'}
                  </MazeCell>
                ))}
              </MazeRow>
            ))}
          </MazeGrid>
          <Message $type={message?.includes('🌟') ? 'success' : 'info'}>{message}</Message>
          <MovesCount>이동 횟수: {moves}</MovesCount>
        </MazeContainer>
      </GameContent>
    </GameOverlay>
  );
};

const GameOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const GameContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
  outline: none;
`;

const GameTitle = styled.h2`
  font-family: 'JejuHallasan';
  text-align: center;
  margin-bottom: 20px;
`;

const MazeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MazeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 50px);
  gap: 2px;
  background: #2d3748;
  padding: 2px;
`;

// MazeRow는 display: contents를 사용해 DOM 구조상 존재는 하지만 레이아웃에 영향을 주지 않습니다.
const MazeRow = styled.div`
  display: contents;
`;

const MazeCell = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${props => props.$isWall ? '#2d3748' : props.$isPath ? '#90cdf4' : '#f7fafc'};
`;

const Message = styled.div`
  text-align: center;
  color: ${props => props.$type === 'success' ? '#48bb78' : '#4a5568'};
`;

const MovesCount = styled.div`
  font-family: 'JejuHallasan';
  color: #4a5568;
`;

export default MazeGame;
