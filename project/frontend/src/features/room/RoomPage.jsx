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

  // 방 목록 불러오기 함수
  const loadRooms = async () => {
    setLoading(true);
    try {
      const response = await fetchRooms();
      console.log('방 목록:', response);
     
      setRooms(response.data);
      setError(null); // 이전 에러 메시지 초기화
    } catch (err) {
      setError('방 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 방 목록 불러오기
  useEffect(() => {
    sessionStorage.setItem('roomHost', false)
    loadRooms();
    // 주기적으로 방 목록 업데이트
    const interval = setInterval(loadRooms, 500000);
    return () => clearInterval(interval);
  }, []);

  // 방 생성 처리
  const handleRoomCreated = async (title, password) => {
    try {
      const response = await createRoom(title, password);
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
            <RefreshButtonComponent onClick={loadRooms} loading={loading} />
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
const RefreshIcon = styled.svg`
  width: 36px;
  height: 36px;
  cursor: pointer;
  fill: lightgreen;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;

const RefreshButtonComponent = ({ onClick, loading }) => (
  <RefreshIcon
    onClick={onClick}
    disabled={loading}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0-2C5.373 0 .5 4.873.5 11S5.373 22 .5 22C17.627" />
    <path d="M12 5v4l3-2-3-2zm6.364-1.364A9.956 9.956 0 0112 4a9.956 9.956 0 01-6.364-2.364L4.222-.222A11.96 11.96 0 0012 .5c6.627-.001-.5z" />
    <path d="M15.293,8.707l1.414-1.414L12,3L8,7h3v4h4V8H15Z" />
  </RefreshIcon>
);

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;
const RefreshButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover span {
    transform: scale(1.2);
    transition: transform 0.2s ease-in-out;
  }
`;

const Emoji = styled.span`
  font-size: 1.5rem;
  display: inline-block;
  color: #ff6b6b;
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