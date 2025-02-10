import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchRooms, createRoom } from '../../api/room';
import RoomList from './components/RoomList';
import CreateRoomForm from './components/CreateRoomForm';
import forestBg from "../../assets/images/backgrounds/forest-bg.gif";
import { useAuth } from '../../contexts/AuthContext'; // 추가

const RoomPage = () => {
  const { handleLogout } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        setRooms(response.data);
      } catch (err) {
        setError('방 목록을 불러오는데 실패했습니다');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
    // 주기적으로 방 목록 업데이트
    const interval = setInterval(loadRooms, 500000);
    return () => clearInterval(interval);
  }, []);

  const handleRoomCreated = async (title) => {
    try {
      const response = await createRoom(title);
      const roomId = response.data.roomId;
      const openViduToken = response.data.token;
      sessionStorage.setItem('openViduToken', openViduToken);
      navigate(`/room/${roomId}`);
    } catch (error) {
      setError('방 생성에 실패했습니다');
    }
  };

  return (
    <PageContainer>
      <BackgroundImage />
      
      <ContentWrapper>
        <Header>
          <Title>THE RAMZEE</Title>
          <ButtonGroup>
          <CreateRoomButton onClick={() => setIsModalOpen(true)}>
            방 만들기
          </CreateRoomButton>
          <LogoutButton onClick={handleLogout}>
              로그아웃
            </LogoutButton>
            </ButtonGroup>
        </Header>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {loading ? (
          <LoadingMessage>방 목록을 불러오는 중...</LoadingMessage>
        ) : (
          <RoomListContainer>
            <RoomList rooms={rooms} />
          </RoomListContainer>
        )}

        {isModalOpen && (
          <ModalOverlay>
            <ModalContent>
              <CloseButton onClick={() => setIsModalOpen(false)}>×</CloseButton>
              <CreateRoomForm onRoomCreated={handleRoomCreated} />
            </ModalContent>
          </ModalOverlay>
        )}
      </ContentWrapper>
    </PageContainer>
  );
};

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const LogoutButton = styled.button`
  background-color: #ff6b6b;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #ff8787;
  }
`;


const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${forestBg});
  background-size: cover;
  z-index: -1;
`;

const ContentWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 2rem auto;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: white;
  text-shadow: 
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 30px #00ff00;
`;

const CreateRoomButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const RoomListContainer = styled.div`
  background-color: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  min-height: 400px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(139, 69, 19, 0.95);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  
  &:hover {
    color: #ff6b6b;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: rgba(255, 107, 107, 0.1);
  border-radius: 10px;
`;

const LoadingMessage = styled.div`
  color: white;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
`;

export default RoomPage;