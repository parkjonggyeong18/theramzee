import React, { useState } from 'react';
import { joinRoom } from '../../../api/room';

const RoomListItem = ({ room }) => {
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = async () => {
    if (isJoining) return; // 중복 요청 방지

    setIsJoining(true);
    try {
      const response = await joinRoom(room.roomId, null); // OpenVidu 토큰 요청
      const openViduToken = response.data.token;
      sessionStorage.setItem('openViduToken', openViduToken);
      window.location.href = `/room/${room.roomId}`; // 방으로 이동
    } catch (error) {
      console.error('방 참가 실패:', error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="room-item">
      <h3>{room.title}</h3>
      <button onClick={handleJoinRoom} disabled={isJoining}>
        {isJoining ? '참가 중...' : '참여'}
      </button>
    </div>
  );
};

export default RoomListItem;
