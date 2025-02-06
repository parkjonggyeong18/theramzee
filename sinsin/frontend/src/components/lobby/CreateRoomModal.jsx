import { useState } from 'react';
import styled from 'styled-components';

const CreateRoomModal = ({ onClose, onCreate }) => {
  const [roomData, setRoomData] = useState({
    title: '',
    password: '',
    isPrivate: false,
    maxPlayers: 6
  });

<<<<<<< HEAD
=======
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
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
<<<<<<< HEAD
=======
    onClose();
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
<<<<<<< HEAD
            placeholder="방 제목"
            value={roomData.title}
            onChange={(e) => setRoomData({ ...roomData, title: e.target.value })}
          />
          
          <CheckboxGroup>
            <input
              type="checkbox"
              id="isPrivate"
              checked={roomData.isPrivate}
              onChange={(e) => setRoomData({ ...roomData, isPrivate: e.target.checked })}
            />
            <label htmlFor="isPrivate">비공개 방</label>
          </CheckboxGroup>

          {roomData.isPrivate && (
            <Input
              type="password"
              placeholder="비밀번호 (숫자 8자리)"
              maxLength={8}
              value={roomData.password}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setRoomData({ ...roomData, password: value });
              }}
            />
          )}

          <ButtonGroup>
            <SubmitButton type="submit">확인</SubmitButton>
            <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          </ButtonGroup>
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
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
<<<<<<< HEAD
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  gap: 1rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  background: #90EE90;
`;

const CancelButton = styled(Button)`
  background: #FF4444;
  color: white;
`;

export default CreateRoomModal;
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
