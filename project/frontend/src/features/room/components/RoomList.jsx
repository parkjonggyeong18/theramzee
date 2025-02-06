import React from 'react';
import RoomListItem from './RoomListItem';

const RoomList = ({ rooms }) => {
  if (rooms.length === 0) {
    return <p>방 목록이 없습니다.</p>;
  }

  return (
    <div>
      {rooms.map((room) => (
        <RoomListItem key={room.roomId} room={room} />
      ))}
    </div>
  );
};

export default RoomList;