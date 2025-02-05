import { apiRequest } from './apiService';

export const fetchRooms = async () => {
  return await apiRequest('/api/v1/rooms', 'GET');
};

export const createRoom = async (roomData) => {
  return await apiRequest('/api/v1/rooms', 'POST', roomData);
};

export const leaveRoom = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}/leave`, 'POST');
};

export const joinRoom = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}/join`, 'POST');
};

export const fetchRoomById = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}`, 'GET');
};