import React, { useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { getGameInfo, moveForest, completeMission } from '../../api/game';
import GameBoard from './components/GameBoard';
import ScoreBoard from './components/ScoreBoard';
import { Client } from '@stomp/stompjs';

const GamePage = ({ roomId }) => {
  const { accessToken } = useAuth();
  const { gameState, setGameState } = useGame();

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const fetchGameInfo = async () => {
      try {
        const gameInfo = await getGameInfo(roomId);
        setGameState(gameInfo);
      } catch (error) {
        console.error('게임 정보 불러오기 실패', error);
      }
    };

    fetchGameInfo();
  }, [roomId, accessToken, setGameState]);

  useEffect(() => {
    if (!roomId || !accessToken) return;

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe(`/topic/game/${roomId}`, (message) => {
          setGameState(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket Error:', frame.headers['message']);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [roomId, accessToken, setGameState]);

  const handleMove = useCallback(async (newLocation) => {
    if (!roomId || !gameState.userNum) return;

    try {
      await moveForest(roomId, gameState.userNum, newLocation);
    } catch (error) {
      console.error('이동 실패', error);
    }
  }, [roomId, gameState.userNum]);

  const handleCompleteMission = useCallback(async (missionId) => {
    if (!roomId || !gameState.forestNum || !gameState.userNum) return;

    try {
      await completeMission(roomId, gameState.forestNum, missionId, gameState.userNum);
    } catch (error) {
      console.error('미션 완료 실패', error);
    }
  }, [roomId, gameState.forestNum, gameState.userNum]);

  return (
    <div>
      <h1>Game Room {roomId}</h1>
      <GameBoard gameState={gameState} onMove={handleMove} onCompleteMission={handleCompleteMission} />
      <ScoreBoard scores={gameState.scores || []} />
    </div>
  );
};

export default GamePage;
