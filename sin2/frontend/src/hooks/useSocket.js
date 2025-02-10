import { useState, useEffect, useCallback } from 'react';
import { connectSocket, disconnectSocket, subscribeToTopic } from '../services/stomp';

const useGameSocket = (roomId, handlers) => {
  const [isConnected, setIsConnected] = useState(false);

  // 소켓 연결 초기화
  const initializeSocket = useCallback(async () => {
    if (!isConnected) {
      try {
        await connectSocket();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect:', error);
        setIsConnected(false);
        return false;
      }
    }
    return true;
  }, [isConnected]);

  // 구독 설정
  useEffect(() => {
    let subscriptions = [];

    const setupSubscriptions = async () => {
      if (isConnected && roomId) {
        subscriptions = [
          subscribeToTopic(`/user/queue/game/${roomId}/info`, handlers.handleGameInfo),
          subscribeToTopic(`/topic/game/${roomId}/start`, handlers.handleGameStartResponse),
          subscribeToTopic(`/topic/game/${roomId}/emergency`, handlers.handleEmergencyResponse),
          subscribeToTopic(`/topic/game/${roomId}/move`, handlers.handleMoveResponse),
          subscribeToTopic(`/topic/game/${roomId}/save-acorns`, handlers.handleSaveAcornsResponse),
          subscribeToTopic(`/topic/game/${roomId}/charge-fatigue`, handlers.handleChargeFatigueResponse),
          subscribeToTopic(`/topic/game/${roomId}/kill`, handlers.handleKillResponse),
          subscribeToTopic(`/topic/game/${roomId}/complete-mission`, handlers.handleCompleteMissionResponse)
        ];
      }
    };

    setupSubscriptions();

    return () => {
      subscriptions.forEach(sub => sub?.unsubscribe());
    };
  }, [isConnected, roomId]);

  return { isConnected, initializeSocket };
};

export default useGameSocket;
