import { useState } from 'react';
import { authApi } from '../api/auth';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const registerData = {
        username: userData.id,        
        password: userData.password,  
        name: userData.username,      
        nickname: userData.nickname,  
        email: userData.email        
      };
  
      console.log('Sending register data:', registerData); // 요청 데이터 확인
  
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      });
  
      // 응답이 JSON이 아닐 수 있으므로 조건부로 처리
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || '회원가입에 실패했습니다');
        }
        return data;
      } else {
        // JSON이 아닌 경우
        const text = await response.text();
        if (!response.ok) {
          throw new Error(text || '회원가입에 실패했습니다');
        }
        return text;
      }
  
    } catch (err) {
      console.error('Register error:', err);
      setError(err.message || '회원가입에 실패했습니다');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(credentials);
      const { token } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.resetPassword(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || '비밀번호 재설정에 실패했습니다');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const findUsername = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.findUsername(email);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || '아이디 찾기에 실패했습니다');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, login, resetPassword, findUsername, loading, error };
};