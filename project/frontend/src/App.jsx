import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import { GameProvider } from './contexts/GameContext';
import { OpenViduProvider } from './contexts/OpenViduContext';  // OpenViduContext 추가
import AppRoutes from './routes/AppRoutes';
import VolumeControl from './features/audio/VolumeControl';
import { VolumeProvider } from './contexts/VolumeContext';
import { FriendProvider } from './contexts/FriendContext';
import GlobalStyle from './styles/GlobalStyle'; // GlobalStyle 추가

const App = () => (
  <>
 
    <VolumeProvider>
      <VolumeControl />
      <AuthProvider>
        <UserProvider>
          <FriendProvider>
            <GameProvider>
              <OpenViduProvider>  {/* OpenViduProvider 추가 */}
                <AppRoutes></AppRoutes>
              </OpenViduProvider>
            </GameProvider>
          </FriendProvider>
        </UserProvider>
      </AuthProvider>
    </VolumeProvider>
  </>
);

export default App;