import api from './axios';

export const authApi = {
 register: (userData) => 
   api.post('/auth/register', userData)
 ,
 
 login: (credentials) => 
   api.post('/auth/login', credentials),
 
 logout: () => 
   api.post('/auth/logout'),
   
 resetPassword: (email) =>
   api.post('/email/reset-password', { email }),
   
 findUsername: (email) =>
   api.post('/email/find-username', { email }),

 // 이메일 인증코드 요청
 sendEmailCode: (email) => 
  api.post('/email/email-send', { email }),
  
// 이메일 인증코드 확인
verifyEmailCode: (email, authNum) => 
  api.post('/email/email-auth', { email, authNum })
};

