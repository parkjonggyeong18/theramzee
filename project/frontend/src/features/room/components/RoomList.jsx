import React from 'react';
import RoomListItem from './RoomListItem';

const RoomList = ({ rooms }) => {
  console.log('RoomList:', rooms);
  if (!rooms || rooms.length === 0) {
    return <p>방 목록이 없습니다.</p>;
  }

  return (
    <div className="room-list">
      {rooms.map((room) => (
        <RoomListItem key={room.id} room={room} />
      ))}
    </div>
  );
};

export default RoomList;