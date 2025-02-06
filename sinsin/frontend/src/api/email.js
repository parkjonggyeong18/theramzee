import { apiRequest } from '../services/apiService';

export const resetPassword = async (email) => {
  return await apiRequest('/api/v1/email/reset-password', 'POST', { email });
};

export const findUsername = async (email) => {
  return await apiRequest('/api/v1/email/find-username', 'POST', { email });
};

export const sendEmailVerification = async (email) => {
  return await apiRequest('/api/v1/email/email-send', 'POST', { email });
};

export const verifyEmailCode = async (email, code) => {
  return await apiRequest('/api/v1/email/email-auth', 'POST', { email, code });
};