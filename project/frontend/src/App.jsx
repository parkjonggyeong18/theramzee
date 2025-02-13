import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import { OpenViduProvider } from './contexts/OpenViduContext';  // OpenViduContext 추가
import AppRoutes from './routes/AppRoutes';

const App = () => (
  <AuthProvider>
    <UserProvider>
      <GameProvider>
        <OpenViduProvider>  {/* OpenViduProvider 추가 */}
          <AppRoutes />
        </OpenViduProvider>
      </GameProvider>
    </UserProvider>
  </AuthProvider>
);

export default App;
