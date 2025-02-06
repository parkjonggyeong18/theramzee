import React, { createContext, useState, useContext } from 'react';
import { login, logout, refreshToken, register } from '../api/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = async (username, password) => {
    const data = await login(username, password);
    setUser(data.user);
    setToken(data.token);
  };

  const handleLogout = async () => {
    await logout(token);
    setUser(null);
    setToken(null);
  };

  const handleRegister = async (username, password) => {
    const data = await register(username, password);
    setUser(data.user);
    setToken(data.token);
  };

  const handleRefreshToken = async () => {
    const data = await refreshToken(token);
    setToken(data.token);
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleLogout, handleRegister, handleRefreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};