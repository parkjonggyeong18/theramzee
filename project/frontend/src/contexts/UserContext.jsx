import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../api/user';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (accessToken) {
        try {
          const userProfile = await getCurrentUser();
          setUser(userProfile);
        } catch (error) {
          console.error('사용자 프로필 불러오기 실패', error);
        }
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const value = {
    user,
    setUser,
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