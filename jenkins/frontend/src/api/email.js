import { apiRequest } from './apiService';

// 비밀번호 초기화
export const resetPassword = async (email) => {
  return await apiRequest('/api/v1/email/reset-password', 'POST', { email }, false);
};

// 아이디 찾기
export const findUsername = async (email) => {
  return await apiRequest('/api/v1/email/find-username', 'POST', { email }, false);
};

// 이메일 인증번호 전송
export const sendEmailVerification = async (email) => {
  console.log('이메일 전송 요청:', email);
  return await apiRequest('/api/v1/email/email-send', 'POST', { email }, false);
};

// 이메일 인증번호 검증
export const verifyEmailCode = async (email, authNum) => {
  return await apiRequest('/api/v1/email/email-auth', 'POST', { email, authNum }, false);
};