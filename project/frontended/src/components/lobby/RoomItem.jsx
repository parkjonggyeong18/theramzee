import React from 'react';
import styled from 'styled-components';

const RoomItem = ({ room, onClick }) => {
  const isFull = room.currentPlayers >= room.maxPlayers;

  return (
    <RoomContainer onClick={onClick}>
      <RoomCell style={{ flex: 2 }}>
        {room.password && <LockIcon>🔒</LockIcon>}
        <RoomTitle>{room.title}</RoomTitle>
      </RoomCell>
      
      <RoomCell style={{ flex: 1 }}>
        <HostName>{room.host}</HostName>
      </RoomCell>
      
      <RoomCell style={{ flex: 1, textAlign: 'center' }}>
        <PlayerCount>
          {room.currentPlayers}/{room.maxPlayers}
        </PlayerCount>
      </RoomCell>
      
      <RoomCell style={{ flex: 1, textAlign: 'center' }}>
        <StatusBadge isFull={isFull}>
          {isFull ? '만원' : '참가가능'}
        </StatusBadge>
      </RoomCell>
    </RoomContainer>
  );
};

const RoomContainer = styled.div`
  display: flex;
  padding: 15px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const RoomCell = styled.div`
  padding: 0 10px;
  display: flex;
  align-items: center;
`;

const LockIcon = styled.span`
  margin-right: 8px;
  font-size: 0.9em;
`;

const RoomTitle = styled.span`
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HostName = styled.span`
  color: #2c3e50;
  font-size: 0.95em;
`;

const PlayerCount = styled.span`
  font-weight: 500;
  color: #34495e;
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9em;
  background-color: ${props => props.isFull ? '#ff4444' : '#4CAF50'};
  color: white;
  transition: background-color 0.2s;

  ${props => !props.isFull && `
    &:hover {
      background-color: #45a049;
    }
  `}
`;

export default RoomItem;