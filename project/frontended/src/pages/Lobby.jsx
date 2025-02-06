import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { roomService } from '../services/roomService';
import RoomList from '../components/lobby/RoomList';
import SearchBar from '../components/lobby/SearchBar';
import CreateRoomModal from '../components/lobby/CreateRoomModal';
import { backgroundImages } from '../assets/images';

const Lobby = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await roomService.getRoomList(currentPage);
      setRooms(data);
    } catch (error) {
      console.error('방 목록을 불러오는데 실패했습니다:', error);
      setError('방 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage]);

  const handleCreateRoom = async (roomData) => {
    try {
      const createdRoom = await roomService.createRoom({
        ...roomData,
        maxPlayers: 6
      });
      setShowCreateModal(false);
      navigate(`/game/${createdRoom.id}`);
    } catch (error) {
      console.error('방 생성 실패:', error);
      alert('방 생성에 실패했습니다.');
    }
  };

  const handleJoinRoom = async (roomId) => {
    try {
      await roomService.joinRoom(roomId);
      navigate(`/game/${roomId}`);
    } catch (error) {
      console.error('방 입장 실패:', error);
      if (error.response?.status === 401) {
        alert('비밀번호가 일치하지 않습니다.');
      } else if (error.response?.status === 403) {
        alert('방이 가득 찼습니다.');
      } else {
        alert('방 입장에 실패했습니다.');
      }
    }
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      if (!query) {
        fetchRooms();
        return;
      }
      const data = await roomService.getRoomList(0, 10, query);
      setRooms(data);
    } catch (error) {
      console.error('방 검색 실패:', error);
      setError('방 검색에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LobbyContainer>
      <BackgroundImage />
      <Header>
        <Title>THE RAMZEE STORY</Title>
        <SearchBar onSearch={handleSearch} />
      </Header>

      {error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : loading ? (
        <LoadingMessage>방 목록을 불러오는 중...</LoadingMessage>
      ) : (
        <RoomList 
          rooms={rooms} 
          onRoomClick={handleJoinRoom}
        />
      )}

      <Pagination>
        <PageButton 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          ◀
        </PageButton>
        <span>{currentPage + 1}</span>
        <PageButton 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={rooms.length < 10}
        >
          ▶
        </PageButton>
      </Pagination>

      <CreateRoomButton onClick={() => setShowCreateModal(true)}>
        방 만들기
      </CreateRoomButton>

      {showCreateModal && (
        <CreateRoomModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateRoom}
        />
      )}
    </LobbyContainer>
  );
};

const LobbyContainer = styled.div`
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${backgroundImages.forest});
  background-size: cover;
  z-index: -1;
`;

const Header = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #90ff90;
  font-size: 2.5em;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 20px;
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  padding: 20px;
  font-size: 1.2em;
  margin-top: 20px;
`;

const Pagination = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;
`;

const PageButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:disabled {
    cursor: not-allowed;
  }
`;

const CreateRoomButton = styled.button`
  position: fixed;
  bottom: 20px;
  left: 20px;
  padding: 10px 20px;
  background: #90EE90;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'JejuHallasan';

  &:hover {
    background: #98FB98;
  }
`;

export default Lobby;