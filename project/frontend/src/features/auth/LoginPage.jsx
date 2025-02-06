import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/auth';
import LoginForm from './components/LoginForm';

const LoginPage = () => {
  const { updateAccessToken } = useAuth(); // useContext 대신 커스텀 훅 사용
  const navigate = useNavigate(); // React Router v6 적용

  const handleLogin = useCallback(async (username, password) => {
    try {
      const response = await login(username, password);
      updateAccessToken(response.data.accessToken);
      navigate('/user'); // 로그인 후 홈으로 이동
    } catch (error) {
      console.error('로그인 실패', error);
      // TODO: 사용자에게 에러 메시지 표시
    }
  }, [updateAccessToken, navigate]);

  return (
    <div>
      <h1>Login</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
};

export default LoginPage;
