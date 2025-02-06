// hooks/useKillSystem.js
import { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';

export const useKillSystem = () => {
  const { gameState, killPlayer } = useGame();
  const [killingPlayer, setKillingPlayer] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // 드래그 시작 핸들러
  const handleDragStart = (e, playerId) => {
    // 나쁜 다람쥐이고 피로도가 3일때만 가능
    if (gameState.role !== 'bad' || gameState.fatigue < 3) return;
    
    // 이미 죽은 플레이어는 제외
    if (gameState.killedPlayers.includes(playerId)) return;

    setDragStart({ 
      y: e.clientY, 
      playerId,
      timestamp: Date.now() 
    });
    setIsDragging(true);
  };

  // 드래그 진행 핸들러
  const handleDragMove = (e) => {
    if (!dragStart || !isDragging) return;
    const distance = e.clientY - dragStart.y;
    if (distance > 100) {
      setKillingPlayer(dragStart.playerId);
      setIsDragging(false);
    }
  };

  // 드래그 종료 핸들러
  const handleDragEnd = () => {
    if (killingPlayer) {
      killPlayer(killingPlayer);
      setKillingPlayer(null);
    }
    setDragStart(null);
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    } else {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging]);

  return {
    killingPlayer,
    handleDragStart,
    isKillable: gameState.role === 'bad' && gameState.fatigue >= 3,
    isDragging
  };
};