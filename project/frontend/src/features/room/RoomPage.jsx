// RoomPage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRooms, createRoom } from '../../api/room';
import RoomList from './components/RoomList';
import CreateRoomForm from './components/CreateRoomForm';

const RoomPage = () => {
  const { accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    if (!accessToken) return;

    const fetchRoomsList = async () => {
      try {
        const roomsList = await fetchRooms();
        setRooms(roomsList);
      } catch (error) {
        console.error('방 목록 불러오기 실패', error);
      }
    };

    fetchRoomsList();
  }, [accessToken]);

  const handleRoomCreated = async (newRoomTitle) => {
    try {
      await createRoom(newRoomTitle);
      const updatedRooms = await fetchRooms();
      setRooms(updatedRooms);
    } catch (error) {
      console.error('방 생성 실패', error);
    }
  };

  return (
    <div>
      <h1>방 목록</h1>
      <CreateRoomForm onRoomCreated={handleRoomCreated} />
      <RoomList rooms={rooms} />
    </div>
  );
};

export default RoomPage;