import { apiRequest } from './apiService';

export const gameStart = async (roomId, nicknames) => {
  return await apiRequest('/api/v1/room/game-start', 'POST', { roomId, nicknames });
};

export const saveAcorns = async (roomId, userNum) => {
  return await apiRequest('/api/v1/room/game-save', 'POST', { roomId, userNum });
};

export const moveForest = async (roomId, userNum, newForest) => {
  return await apiRequest('/api/v1/room/game-move', 'POST', { roomId, userNum, newForest });
};

export const completeMission = async (roomId, forestNum, missionNum, userNum) => {
  return await apiRequest('/api/v1/room/game-mission', 'POST', { roomId, forestNum, missionNum, userNum });
};

export const killPlayer = async (roomId, userNum, myNum) => {
  return await apiRequest('/api/v1/room/game-kill', 'POST', { roomId, userNum, myNum });
};

export const getGameInfo = async (roomId) => {
  return await apiRequest('/api/v1/room/game-info', 'POST', { roomId });
};

export const getUserFatigue = async (roomId, userNum) => {
  return await apiRequest('/api/v1/room/game-get/user-fatigue', 'POST', { roomId, userNum });
};

export const getUserAcorns = async (roomId, userNum) => {
  return await apiRequest('/api/v1/room/game-get/user-acorns', 'POST', { roomId, userNum });
};

export const getMissionStatus = async (roomId, forestNum) => {
  return await apiRequest('/api/v1/room/game-get/mission-status', 'POST', { roomId, forestNum });
};

export const emergencyCall = async (roomId) => {
  return await apiRequest('/api/v1/room/game-emergency', 'POST', { roomId });
};

export const chargeFatigue = async (roomId, userNum) => {
  return await apiRequest('/api/v1/room/game-charge', 'POST', { roomId, userNum });
};