import { apiRequest } from './apiService';

export const fetchRooms = async () => {
  return await apiRequest('/api/v1/rooms', 'GET');
};

export const createRoom = async (rommTitle) => {
  return await apiRequest('/api/v1/rooms', 'POST', {title: rommTitle});
};

export const leaveRoom = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}/leave`, 'POST');
};

export const joinRoom = async (roomId, password=null) => {
  return await apiRequest(`/api/v1/rooms/${roomId}/join`, 'POST', {password: password});
};

export const fetchRoomById = async (roomId) => {
  return await apiRequest(`/api/v1/rooms/${roomId}`, 'GET');
};