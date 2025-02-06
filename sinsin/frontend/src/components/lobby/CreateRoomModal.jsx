import { useState } from 'react';
import styled from 'styled-components';

const CreateRoomModal = ({ onClose, onCreate }) => {
  const [roomData, setRoomData] = useState({
    title: '',
    password: '',
    isPrivate: false,
    maxPlayers: 6
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomData.title) {
      alert('방 제목을 입력해주세요.');
      return;
    }
    if (roomData.isPrivate && !roomData.password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    onCreate(roomData);
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="title"
            value={roomData.title}
            onChange={handleChange}
            placeholder="방 제목"
          />
          <CheckboxContainer>
            <label>
              <input
                type="checkbox"
                name="isPrivate"
                checked={roomData.isPrivate}
                onChange={handleChange}
              />
              비공개 방
            </label>
          </CheckboxContainer>
          {roomData.isPrivate && (
            <Input
              type="password"
              name="password"
              value={roomData.password}
              onChange={handleChange}
              placeholder="비밀번호"
            />
          )}
          <Input
            type="number"
            name="maxPlayers"
            value={roomData.maxPlayers}
            onChange={handleChange}
            placeholder="최대 인원 수"
            min="2"
            max="10"
          />
          <Button type="submit">방 생성</Button>
          <Button type="button" onClick={onClose}>취소</Button>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:nth-child(2) {
    background: red;
  }
`;

export default CreateRoomModal;
