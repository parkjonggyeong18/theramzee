import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/user';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [nickname, setNickname] = useState(null);


  const value = {
    nickname,
    setNickname,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;