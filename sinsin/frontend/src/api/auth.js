import { apiRequest } from '../services/apiService';

export const login = async (username, password) => {
  return await apiRequest('/api/v1/auth/login', 'POST', { username, password });
};

export const register = async (username, password) => {
  return await apiRequest('/api/v1/auth/register', 'POST', { username, password });
};

export const refreshToken = async () => {
  return await apiRequest('/api/v1/auth/refresh-token', 'POST');
};

export const logout = async () => {
  return await apiRequest('/api/v1/auth/logout', 'POST');
};