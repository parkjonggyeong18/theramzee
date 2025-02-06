// pages/Lobby.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FriendList from '../components/lobby/FriendList';
import ChatWindow from '../components/lobby/ChatWindow';
import RoomList from '../components/lobby/RoomList';
import SearchBar from '../components/lobby/SearchBar';
import CreateRoomModal from '../components/lobby/CreateRoomModal';
import forestBg from '../assets/images/backgrounds/forest-bg.gif';

const Lobby = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFriendList, setShowFriendList] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      // API 호출 예시
      // const response = await fetch('/api/rooms');
      // const data = await response.json();
      // setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleCreateRoom = (roomData) => {
    // 방 생성 로직
    setShowCreateModal(false);
  };

  return (
    <LobbyContainer>
      <BackgroundImage src={forestBg} />
      <Header>
        <Title>로비</Title>
        <Button onClick={() => setShowFriendList(!showFriendList)}>친구 목록</Button>
        <Button onClick={() => setShowChat(!showChat)}>채팅</Button>
        <Button onClick={() => setShowCreateModal(true)}>방 생성</Button>
      </Header>
      <SearchBar onSearch={handleSearch} />
      <RoomList rooms={rooms} loading={loading} />
      {showFriendList && <FriendList />}
      {showChat && <ChatWindow />}
      {showCreateModal && <CreateRoomModal onCreate={handleCreateRoom} onClose={() => setShowCreateModal(false)} />}
    </LobbyContainer>
  );
};

const LobbyContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
`;

const Title = styled.h1`
  margin: 0;
`;

const Button = styled.button`
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkblue;
  }
`;

export default Lobby;