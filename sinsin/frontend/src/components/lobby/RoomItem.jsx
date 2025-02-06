<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
import styled from 'styled-components';

const RoomItem = ({ room, onClick }) => {
  return (
<<<<<<< HEAD
    <Container onClick={onClick}>
      <span>{room.host}</span>
      <span>{room.title}</span>
      <span>{room.currentPlayers}/{room.maxPlayers}</span>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  background-color: rgba(139, 69, 19, 0.8);
  border-radius: 10px;
  color: white;
  padding: 15px;
  cursor: pointer;

  span {
    flex: 1;
    text-align: center;
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  }
`;

export default RoomItem;