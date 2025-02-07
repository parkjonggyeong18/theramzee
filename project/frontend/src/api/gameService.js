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

export const handleEmergency = async (roomId) => {
    try {
      await sendMessage(`/app/game/${roomId}/emergency`, { roomId });
    } catch (error) {
      console.error('Failed to handle emergency:', error);
      throw error;
    }
  };

  export const moveForest = async (roomId, userNum, newForest) => {
    try {
      await sendMessage(`/app/game/${roomId}/move`, { roomId, userNum, newForest });
    } catch (error) {
      console.error('Failed to move forest:', error);
      throw error;
    }
  };

  export const getUserAcorns = async (roomId, userNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/acorns`, { roomId, userNum });
    } catch (error) {
      console.error('Failed to get user acorns:', error);
      throw error;
    }
  };

  export const saveUserAcorns = async (roomId, userNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/save-acorns`, { roomId, userNum });
    } catch (error) {
      console.error('Failed to save user acorns:', error);
      throw error;
    }
  };

  export const getUserFatigue = async (roomId, userNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/fatigue`, { roomId, userNum });
    } catch (error) {
      console.error('Failed to get user fatigue:', error);
      throw error;
    }
  };

  export const chargeFatigue = async (roomId, userNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/charge-fatigue`, { roomId, userNum });
    } catch (error) {
      console.error('Failed to charge user fatigue:', error);
      throw error;
    }
  };

  export const killUser = async (roomId, userNum, myNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/kill`, { roomId, userNum, myNum });
    } catch (error) {
      console.error('Failed to kill user:', error);
      throw error;
    }
  };

  export const getMissionStatus = async (roomId, forestNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/mission`, { roomId, forestNum });
    } catch (error) {
      console.error('Failed to get mission status:', error);
      throw error;
    }
  };

  export const completeMission = async (roomId, forestNum, missionNum, userNum) => {
    try {
      await sendMessage(`/app/game/${roomId}/complete-mission`, { roomId, forestNum, missionNum, userNum });
    } catch (error) {
      console.error('Failed to complete mission:', error);
      throw error;
    }
  };

// 필요한 다른 게임 관련 함수들도 여기에 추가
