import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Lobby from './components/Lobby';
import React from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RoomListPage from './pages/RoomListPage';
import GameRoomPage from './pages/GameRoomPage';
import FriendPage from './pages/FriendPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/game/:roomId" element={<GameRoomPage />} />
        <Route path="/friends" element={<FriendPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;