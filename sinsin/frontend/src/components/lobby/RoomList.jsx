<<<<<<< HEAD
import styled from 'styled-components';
import RoomItem from './RoomItem';

const RoomList = ({ rooms, onRoomClick }) => {
=======
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomItem from './RoomItem';
import { fetchRooms } from '../../api/rooms';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      try {
        const data = await fetchRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    getRooms();
  }, []);

  const onRoomClick = (roomId) => {
    // 방 클릭 시 처리 로직
  };

>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  return (
    <>
      <RoomListHeader>
        <span>| 호스트 |</span>
        <span>| 방제목 |</span>
        <span>| 인원 |</span>
      </RoomListHeader>

      <RoomListContainer>
        {rooms.map((room) => (
          <RoomItem 
            key={room.id} 
            room={room} 
            onClick={() => onRoomClick(room.id)} 
          />
        ))}
      </RoomListContainer>
    </>
  );
};

const RoomListHeader = styled.div`
  display: flex;
  justify-content: space-around;
  color: white;
  padding: 10px;
<<<<<<< HEAD
=======
  background-color: #333;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const RoomListContainer = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default RoomList;