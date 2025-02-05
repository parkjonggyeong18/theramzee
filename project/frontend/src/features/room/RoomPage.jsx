import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRooms, joinRoom, leaveRoom, createRoom } from '../../api/room';
import RoomList from './components/RoomList';
import RoomDetail from './components/RoomDetail';
import { Client } from '@stomp/stompjs';

const RoomPage = () => {
  const { accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

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

  useEffect(() => {
    if (!accessToken) return;

    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      onConnect: () => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/rooms', (message) => {
          setRooms(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket Error:', frame.headers['message']);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [accessToken]);

  const handleJoinRoom = useCallback(async (roomId) => {
    if (!roomId) return;

    try {
      const room = await joinRoom(roomId);
      setSelectedRoom(room);
    } catch (error) {
      console.error('방 참여 실패, 새 방을 생성합니다.', error);
      await handleCreateRoom(`Room ${roomId}`);
    }
  }, []);

  const handleLeaveRoom = useCallback(async () => {
    if (!selectedRoom?.roomId) return;

    try {
      await leaveRoom(selectedRoom.roomId);
      setSelectedRoom(null);
      setRooms(await fetchRooms());
    } catch (error) {
      console.error('방 나가기 실패', error);
    }
  }, [selectedRoom]);

  const handleCreateRoom = useCallback(async (title) => {
    if (!title.trim()) return;

    try {
      await createRoom(title);
      const updatedRooms = await fetchRooms();
      setRooms(updatedRooms);

      // 방 생성 후 자동 참가
      const newRoom = updatedRooms.find((room) => room.title === title);
      if (newRoom) {
        await handleJoinRoom(newRoom.roomId);
      }
    } catch (error) {
      console.error('방 생성 실패', error);
    }
  }, []);

  return (
    <div>
      <h1>Waiting Room</h1>
      <div>
        <input
          type="text"
          placeholder="Enter room title"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleCreateRoom(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
      {selectedRoom ? (
        <RoomDetail room={selectedRoom} onLeaveRoom={handleLeaveRoom} />
      ) : (
        <RoomList rooms={rooms} onJoinRoom={handleJoinRoom} />
      )}
    </div>
  );
};

export default RoomPage;
