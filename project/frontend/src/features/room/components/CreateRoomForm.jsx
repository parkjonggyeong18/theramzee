import React, { useState } from 'react';

const CreateRoomForm = ({ onRoomCreated }) => {
  const [roomTitle, setRoomTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomTitle.trim()) return;
    onRoomCreated(roomTitle);
    setRoomTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="방 이름 입력"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
      />
      <button type="submit">방 만들기</button>
    </form>
  );
};

export default CreateRoomForm;