import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../features/auth/LoginPage';
import UserPage from '../features/user/UserPage';
import RoomPage from '../features/room/RoomPage';
import OpenViduPageWrapper from '../features/openVidu/OpenViduPage';
import GamePage from '../features/game/GamePage';
import ChatPage from '../features/chat/ChatPage';
import FriendPage from '../features/friend/FriendPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/rooms" element={<RoomPage />} />
        <Route path="/room/:roomId" element={<OpenViduPageWrapper />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
