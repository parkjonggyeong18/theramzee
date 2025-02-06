import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { fetchRooms, createRoom } from '../../api/room';
import RoomList from './components/RoomList';
import CreateRoomForm from './components/CreateRoomForm';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RoomPage = () => {
  const { accessToken } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    console.log("방 목록 불러오기");
    if (!accessToken) {
      setLoading(false); // If no token, no need to fetch
      return;
    }

    const fetchRoomsList = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(null); // Clear any previous errors
      try {
        const response = await fetchRooms();
        const roomsList = response.data;
        setRooms(roomsList);
        console.log('방 목록:', roomsList);
      } catch (err) {
        console.error('방 목록 불러오기 실패', err);
        setError(err); // Set the error state
      } finally {
        setLoading(false); // Set loading to false regardless of success/failure
      }
    };

    fetchRoomsList();
  }, []);

  const handleRoomCreated = async (newRoomTitle) => {
    try {
      const response = await createRoom(newRoomTitle);
      const roomId = response.data.roomId
      const openViduToken = response.data.token;
      sessionStorage.setItem('openViduToken', openViduToken); 
      // setRooms((prevRooms) => [...prevRooms, room]);

      // Use useNavigate for navigation:
      navigate(`/room/${roomId}`);

    } catch (error) {
      console.error('방 생성 실패', error);
      // Consider displaying an error message to the user
      alert("방 생성에 실패했습니다."); // Simple alert, could be a more sophisticated notification
    }
  };

  if (loading) {
    return <div>Loading rooms...</div>; // Display loading message
  }

  if (error) {
    return <div>Error: {error.message}</div>; // Display error message
  }

  return (
    <div>
      <h1>방 목록</h1>
      <button onClick={() => setIsModalOpen(true)}>방 만들기</button>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setIsModalOpen(false)}>X</button>
            <CreateRoomForm onRoomCreated={handleRoomCreated} />
          </div>
        </div>
      )}

      <RoomList rooms={rooms} />
    </div>
  );
};

export default RoomPage;