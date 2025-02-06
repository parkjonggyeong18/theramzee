// components/lobby/FriendList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import VideoComponent from '../video/VideoComponent';
import FriendItem from './FriendItem';
import AddFriendModal from './AddFriendModal';
import { getFriendsList } from '../../api/friends';

const FriendList = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const data = await getFriendsList();
        setFriends(data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();
  }, []);

  const handleAddFriend = (friendName) => {
    const newFriend = {
      id: Date.now(),
      name: friendName,
      isOnline: false,
      roomId: null
    };
    setFriends(prev => [...prev, newFriend]);
  };

  const handleDeleteFriend = (friendId) => {
    setFriends(prev => prev.filter(friend => friend.id !== friendId));
  };

  const handleToggleModal = () => {
    setShowAddModal(!showAddModal);
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/room/${roomId}`);
  };

  return (
    <FriendListContainer>
      <VideoComponent />
      <FriendListHeader>
        <h2>친구 목록</h2>
        <button onClick={handleToggleModal}>친구 추가</button>
      </FriendListHeader>
      <FriendListContent>
        {friends.map(friend => (
          <FriendItem 
            key={friend.id} 
            friend={friend} 
            onJoinRoom={handleJoinRoom} 
            onDeleteFriend={handleDeleteFriend}
          />
        ))}
      </FriendListContent>
      {showAddModal && <AddFriendModal onAddFriend={handleAddFriend} onClose={handleToggleModal} />}
    </FriendListContainer>
  );
};

const FriendListContainer = styled.div`
  padding: 20px;
`;

const FriendListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FriendListContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default FriendList;