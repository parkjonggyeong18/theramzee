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
     
     // 테스트용 더미 데이터
     const dummyRooms = [
       { id: 1, host: '사나이경환', title: '대현이만입장', currentPlayers: 1, maxPlayers: 6 },
       { id: 2, host: '이대현쟁쟁맨', title: '경환이만입장', currentPlayers: 2, maxPlayers: 6 },
     ];
     setRooms(dummyRooms);
   } catch (error) {
     console.error('방 목록을 불러오는데 실패했습니다:', error);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchRooms();
 }, []);

 const handleCreateRoom = () => {
   setShowCreateModal(true);
 };

 const handleCreateRoomSubmit = async (roomData) => {
   try {
     // API 호출
     // const response = await createRoom(roomData);
     setShowCreateModal(false);
     fetchRooms(); // 방 목록 새로고침
   } catch (error) {
     alert('방 생성에 실패했습니다.');
   }
 };

 const handleJoinRoom = (roomId) => {
   navigate(`/game/${roomId}`);
 };

 const handleSearch = (query) => {
   setSearchQuery(query);
   if (!query) {
     fetchRooms(); // 전체 방 목록 표시
     return;
   }
   // 검색어로 필터링
   const filteredRooms = rooms.filter(room => 
     room.title.toLowerCase().includes(query.toLowerCase())
   );
   setRooms(filteredRooms);
 };

 return (
   <LobbyContainer>
     <BackgroundImage />
     <Header>
       <Title>THE RAMZEE STORY</Title>
       <SearchBar onSearch={handleSearch} />
     </Header>

     {loading ? (
       <LoadingMessage>방 목록을 불러오는 중...</LoadingMessage>
     ) : (
       <RoomList rooms={rooms} onRoomClick={handleJoinRoom} />
     )}

     <Pagination>
       <PageButton onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}>◀</PageButton>
       <span>{currentPage}/9</span>
       <PageButton onClick={() => setCurrentPage(prev => Math.min(9, prev + 1))}>▶</PageButton>
     </Pagination>

     <CreateRoomButton onClick={handleCreateRoom}>
       방 만들기
     </CreateRoomButton>

     {showFriendList && <FriendList />}
     {showChat && <ChatWindow />}
     {showCreateModal && (
       <CreateRoomModal
         onClose={() => setShowCreateModal(false)}
         onCreate={handleCreateRoomSubmit}
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
 background-image: url(${forestBg});
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
`;

const LoadingMessage = styled.div`
 color: white;
 text-align: center;
 padding: 20px;
 font-size: 1.2em;
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

 &:hover {
   background: #98FB98;
 }
`;

export default Lobby;