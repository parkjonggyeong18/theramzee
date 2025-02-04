import React, { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, subscribeToTopic, sendMessage } from './stomp';

function GameStart() {
  const [roomId, setRoomId] = useState('');
  const [nicknames, setNicknames] = useState('');
  const [gameInfo, setGameInfo] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = useCallback(() => {
    setIsConnected(true);
  }, []);

  useEffect(() => {
    connectSocket(handleConnect);
    return () => {
      disconnectSocket();
    };
  }, [handleConnect]);

  useEffect(() => {
    if (isConnected && roomId) {
      const subscription = subscribeToTopic(`/user/queue/game/${roomId}/info`, handleGameInfo);
        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
        };
        }
    }, [isConnected, roomId]);

  useEffect(() => {
    if (isConnected && roomId) {
      const subscription = subscribeToTopic(`/topic/game/${roomId}/start`, handleGameStart);
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, roomId]);

  const handleGameInfo = (response) => {
    console.log('Game Info:', response);
    setGameInfo(response.data);
  };

  const handleGameStart = (response) => {
    console.log('Game Started:', response);
    setGameStart(response.data);
  };

  const requestGameInfo = () => {
    if (isConnected && roomId) {
      sendMessage(`/app/game/${roomId}/info`, { roomId });
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  };

  const startGame = () => {
    if (isConnected && roomId) {
      sendMessage(`/app/game/${roomId}/start`, { roomId, nicknames: nicknames.split(',') });
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  };

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
      <button onClick={startGame} disabled={!isConnected || !roomId || !nicknames}>Start Game</button>
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
