import React from 'react';

const RoomListItem = ({ room }) => {
  return (
    <div className="room-item">
      <h3>{room.title}</h3>
      <button onClick={() => console.log(`Joining room: ${room.roomId}`)}>참여</button>
    </div>
  );
};

export default RoomListItem;
