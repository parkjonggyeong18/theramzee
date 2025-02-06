import React from 'react';
import styled from 'styled-components';
import RoomItem from './RoomItem';

const RoomList = ({ rooms, onRoomClick }) => {
  if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
    return (
      <EmptyMessage>방 목록이 없습니다</EmptyMessage>
    );
  }

  return (
    <ListContainer>
      <ListHeader>
        <HeaderCell style={{ flex: 2 }}>방 제목</HeaderCell>
        <HeaderCell style={{ flex: 1 }}>방장</HeaderCell>
        <HeaderCell style={{ flex: 1, textAlign: 'center' }}>인원</HeaderCell>
        <HeaderCell style={{ flex: 1, textAlign: 'center' }}>상태</HeaderCell>
      </ListHeader>

      {rooms.map((room) => (
        <RoomItem 
          key={room.id} 
          room={room} 
          onClick={() => onRoomClick(room.id)} 
        />
      ))}
    </ListContainer>
  );
};

const ListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const EmptyMessage = styled.div`
  color: white;
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin: 20px;
`;

const ListHeader = styled.div`
  display: flex;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  margin-bottom: 10px;
  color: white;
  font-weight: bold;
`;

const HeaderCell = styled.div`
  padding: 0 10px;
`;

export default RoomList;