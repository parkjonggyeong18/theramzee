import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import UserPage from '../features/user/UserPage';
import RoomPage from '../features/room/RoomPage';
import OpenViduPageWrapper from '../features/openVidu/OpenViduPage';
import GamePage from '../features/game/GameRoom';
import ChatPage from '../features/chat/ChatPage';
import FriendPage from '../features/friend/FriendPage';
import RegisterPage from '../features/auth/RegisterPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<OpenViduPageWrapper />} />
        <Route path="/room/:roomId/game" element={<GamePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
