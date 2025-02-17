import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import UserPage from '../features/user/UserPage';
import RoomPage from '../features/room/RoomPage';
import OpenViduPageWrapper from '../features/openVidu/OpenViduPage';
import GamePage from '../features/game/GameRoom';
import MainForest from '../features/game/forests/MainForest';
import TwistedForest from '../features/game/forests/TwistedForest';
import DryForest from '../features/game/forests/DryForest';
import BreathingForest from '../features/game/forests/BreathingForest';
import FoggyForest from '../features/game/forests/FoggyForest';
import FairyForest from '../features/game/forests/FairyForest';
import TimeForest from '../features/game/forests/TimeForest';
import RegisterPage from '../features/auth/RegisterPage';
import BackgroundMusic from '../features/audio/BackgroundMusic';
import ForgotPassword from '../features/auth/components/ForgotPasswordForm';

const AppRoutes = () => {
  return (
    <BrowserRouter>
       <BackgroundMusic />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<OpenViduPageWrapper />} />
        <Route path="/room/:roomId/game" element={<GamePage />} />
        <Route path="/game/:roomId/main" element={<MainForest />} />
        <Route path="/game/:roomId/forest/twisted" element={<TwistedForest />} />
        <Route path="/game/:roomId/forest/dry" element={<DryForest />} />
        <Route path="/game/:roomId/forest/breathing" element={<BreathingForest />} />
        <Route path="/game/:roomId/forest/foggy" element={<FoggyForest />} />
        <Route path="/game/:roomId/forest/fairy" element={<FairyForest />} />
        <Route path="/game/:roomId/forest/time" element={<TimeForest />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
