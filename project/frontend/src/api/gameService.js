import { sendMessage } from './stomp';

export const getGameInfo = async (roomId) => {
  try {
    await sendMessage(`/app/game/${roomId}/info`, { roomId });
  } catch (error) {
    console.error('Failed to get game info:', error);
    throw error;
  }
};

export const startGame = async (roomId, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/start`, { roomId, nicknames });
  } catch (error) {
    console.error('Failed to start game:', error);
    throw error;
  }
};

// 필요한 다른 게임 관련 함수들도 여기에 추가
