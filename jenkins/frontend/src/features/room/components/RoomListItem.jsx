import React, { useState } from 'react';
import styled from 'styled-components';
import { joinRoom } from '../../../api/room';
import { useNavigate } from 'react-router-dom';

const RoomListItem = ({ room }) => {
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // 안전한 방식으로 nickname 접근
  const hostNickname = room?.host?.nickname || '알 수 없음';
  const userCount = room?.users?.length || 0;
  const passwordEnabled = room?.password ? true : false;

  const handleJoinRoom = async (inputPassword = null) => {
    if (isJoining) return;
    
    setIsJoining(true);
    setError(null);
    sessionStorage.setItem('roomPassword', inputPassword);
  
    try {
      const response = await joinRoom(room.roomId, inputPassword);
      const openViduToken = response.data.token;
      sessionStorage.setItem('openViduToken', openViduToken);
      navigate(`/room/${room.roomId}`);
    } catch (error) {
      console.error('Join room error:', error.response?.data || error);
      const errorMessage = error.response?.data?.message || '방 참가에 실패했습니다';
      setError(errorMessage);
      setIsJoining(false);
    }
  };

  const handleJoinClick = () => {
    if (room?.password) {
      setShowPasswordModal(true);
    } else {
      handleJoinRoom();
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setShowPasswordModal(false);
    handleJoinRoom(password);
  };

  // room이 없는 경우 렌더링하지 않음
  if (!room) {
    return null;
  }

  return (
    <RoomCard>
      <RoomHeader>
        <RoomTitle>{room.title || '제목 없음'}</RoomTitle>
        {passwordEnabled ? '🔒' : '🔓'}
      </RoomHeader>
      <RoomInfo>
        <RoomDetails>
          <DetailItem>방장: {room.hostNickName}</DetailItem>
          <DetailItem>참가자: {room.currentParticipantCount}/6</DetailItem>
        </RoomDetails>
      </RoomInfo>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <JoinButton 
        onClick={handleJoinClick} 
        disabled={isJoining || userCount >= 6}
      >
        {isJoining ? '참가 중...' : userCount >= 6 ? '만석' : '참가하기'}
      </JoinButton>

      {showPasswordModal && (
        <ModalOverlay>
          <ModalContent>
            <form onSubmit={handlePasswordSubmit}>
              <h3>비밀번호 입력</h3>
              <PasswordInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="방 비밀번호를 입력하세요"
                required
              />
              <ModalButtonGroup>
                <ModalButton type="submit">확인</ModalButton>
                <ModalButton type="button" onClick={() => setShowPasswordModal(false)}>
                  취소
                </ModalButton>
              </ModalButtonGroup>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </RoomCard>
  );
};

const RoomCard = styled.div`
  background-color: rgba(45, 24, 16, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomTitle = styled.h3`
  color: white;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RoomDetails = styled.div`
  color: #ccc;
  font-size: 0.9rem;
`;

const DetailItem = styled.div`
  margin: 0.2rem 0;
`;

const JoinButton = styled.button`
  background-color: #90EE90;
  color: #2d1810;
  padding: 0.8rem;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #98FB98;
  }

  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
`;
const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ModalOverlay = styled.div`
  position: fixed;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: rgba(139, 69, 19, 0.95);
  padding: 1rem;
  border-radius: 10px;
  width: 192px;

  h3 {
    color: white;
    margin-bottom: 1rem;
    text-align: center;
  }
`;

const PasswordInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background-color: white;
  width: 166px;
`;

const ModalButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalButton = styled.button`
  background-color: #90EE90;
  color: #2d1810;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background-color: #98FB98;
  }

  &:last-child {
    background-color: #ff6b6b;
    color: white;

    &:hover {
      background-color: #ff8787;
    }
  }
`;
export default RoomListItem;
