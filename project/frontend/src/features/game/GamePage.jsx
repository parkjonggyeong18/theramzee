import React, { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, subscribeToTopic } from '../../api/stomp';
import { getGameInfo, startGame } from '../../api/gameService';

function GameStart() {
  const [roomId, setRoomId] = useState('');
  const [nicknames, setNicknames] = useState('');
  const [gameInfo, setGameInfo] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await connectSocket();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isConnected && roomId) {
      const gameInfoSubscription = subscribeToTopic(`/user/queue/game/${roomId}/info`, handleGameInfo);
      const gameStartSubscription = subscribeToTopic(`/topic/game/${roomId}/start`, handleGameStart);

      return () => {
        if (gameInfoSubscription) gameInfoSubscription.unsubscribe();
        if (gameStartSubscription) gameStartSubscription.unsubscribe();
      };
    }
  }, [isConnected, roomId]);

  const handleGameInfo = useCallback((response) => {
    console.log('Game Info:', response);
    setGameInfo(response.data);
  }, []);

  const handleGameStart = useCallback((response) => {
    console.log('Game Started:', response);
    setGameStart(response.data);
  }, []);

  const requestGameInfo = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await getGameInfo(roomId);
      } catch (error) {
        console.error('Failed to request game info:', error);
      }
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  }, [isConnected, roomId]);

  const handleStartGame = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await startGame(roomId, nicknames.split(','));
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  }, [isConnected, roomId, nicknames]);

  return (
    <div>
      <h2>Game Start</h2>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <input
        type="text"
        value={nicknames}
        onChange={(e) => setNicknames(e.target.value)}
        placeholder="Nicknames (comma-separated)"
      />
      <button onClick={requestGameInfo} disabled={!isConnected || !roomId}>Get Game Info</button>
      <button onClick={handleStartGame} disabled={!isConnected || !roomId || !nicknames}>Start Game</button>
      {gameInfo && (
        <div>
          <h3>Game Info:</h3>
          <pre>{JSON.stringify(gameInfo, null, 2)}</pre>
        </div>
      )}
      {gameStart && (
        <div>
          <h3>Game Start Info:</h3>
          <pre>{JSON.stringify(gameStart, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default GameStart;
