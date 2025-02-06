import React, { useState } from 'react';

const CreateRoomForm = ({ onRoomCreated }) => {
  const [roomTitle, setRoomTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomTitle.trim() || isCreating) return;

    setIsCreating(true);
    try {
      await onRoomCreated(roomTitle, "");
    } catch (error) {
      console.error('방 생성 중 오류 발생:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="방 이름 입력"
        value={roomTitle}
        onChange={(e) => setRoomTitle(e.target.value)}
        disabled={isCreating}
      />
      <button type="submit" disabled={isCreating}>
        {isCreating ? '생성 중...' : '방 만들기'}
      </button>
    </form>
  );
};

export default CreateRoomForm;
