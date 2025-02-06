// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';
import { refreshToken } from '../api/auth'; // Assuming you have a function to refresh the token

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('token') || null);

  const updateAccessToken = (newToken) => {
    setAccessToken(newToken);
    sessionStorage.setItem('token', newToken);
    console.log('토큰 갱신됨', sessionStorage.getItem('token'));
  };

  const handleTokenRefresh = async () => {
    try {
      const { accessToken: newAccessToken } = await refreshToken();
      updateAccessToken(newAccessToken);
    } catch (error) {
      console.error('토큰 갱신 실패', error);
      // 필요 시 로그아웃 처리 등 추가
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, updateAccessToken, handleTokenRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; // <== export default 추가
