import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <AuthProvider>
    <UserProvider>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </UserProvider>
  </AuthProvider>
);

export default App;
