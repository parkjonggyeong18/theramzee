import React, { createContext, useContext, useState } from 'react';
import { logout } from '../api/auth'; // 로그아웃 API 호출 함수

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken') || null);

  const updateAccessToken = (response) => {
    setAccessToken(response.accessToken);
    sessionStorage.setItem('accessToken', response.accessToken);
    sessionStorage.setItem('nickName', response.usernickname);
    
  };

  const handleLogout = async () => {
    try {
      logout(); // 서버에 로그아웃 요청
    } catch (error) {
      console.error('로그아웃 실패', error);
    }
    // 토큰 삭제 및 로그인 페이지로 리다이렉트
    sessionStorage.clear();
    setAccessToken(null);
    window.location.href = '/login'; // ✅ useNavigate 대신 사용
  };

  return (
    <AuthContext.Provider value={{ accessToken, updateAccessToken, handleLogout }}>
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

export default AuthContext;
