<<<<<<< HEAD
=======
import React from 'react';
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
import styled from 'styled-components';

const FriendItem = ({ friend, onDelete, onFollow }) => {
  return (
    <Container>
      <span>{friend.name}</span>
      <Controls>
        <OnlineStatus isOnline={friend.isOnline} />
        <FollowButton 
          disabled={!friend.isOnline}
          onClick={() => onFollow(friend.id)}
        >
          따라가기
        </FollowButton>
        <DeleteButton onClick={() => onDelete(friend.id)}>
          삭제
        </DeleteButton>
      </Controls>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: rgba(0,0,0,0.2);
  color: white;
<<<<<<< HEAD
=======
  margin-bottom: 10px;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const Controls = styled.div`
  display: flex;
<<<<<<< HEAD
  gap: 5px;
  align-items: center;
=======
  gap: 10px;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const OnlineStatus = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
<<<<<<< HEAD
  background: ${props => props.isOnline ? '#90EE90' : '#666'};
=======
  background: ${({ isOnline }) => (isOnline ? 'green' : 'red')};
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const Button = styled.button`
  padding: 3px 6px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
`;

const FollowButton = styled(Button)`
  background: #90EE90;
  opacity: ${props => props.disabled ? 0.5 : 1};
`;

const DeleteButton = styled(Button)`
  background: #FF4444;
  color: white;
`;

export default FriendItem;