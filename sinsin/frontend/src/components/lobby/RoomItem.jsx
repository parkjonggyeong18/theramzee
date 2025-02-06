import React from 'react';
import styled from 'styled-components';

const RoomItem = ({ room, onClick }) => {
  return (
    <RoomItemContainer onClick={onClick}>
      <span>{room.host}</span>
      <span>{room.name}</span>
      <span>{room.participants}</span>
    </RoomItemContainer>
  );
};

const RoomItemContainer = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export default RoomItem;