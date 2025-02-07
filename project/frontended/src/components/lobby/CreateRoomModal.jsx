import React, { useState } from 'react';
import styled from 'styled-components';

const CreateRoomModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    title: '',
    password: '',
    maxPlayers: 6
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({
      ...formData,
      password: formData.password || null // 비밀번호가 비어있으면 null로 설정
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h2>방 생성하기</h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>방 제목</Label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="방 제목을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>비밀번호 (선택)</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
            />
          </FormGroup>

          <ButtonGroup>
            <CreateButton type="submit">생성</CreateButton>
            <CancelButton type="button" onClick={onClose}>취소</CancelButton>
          </ButtonGroup>
        </form>
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
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  color: #666;

  &:hover {
    color: #000;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #90EE90;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
`;

const CreateButton = styled(Button)`
  background-color: #90EE90;
  color: black;

  &:hover {
    background-color: #98FB98;
  }
`;

const CancelButton = styled(Button)`
  background-color: #ff4444;
  color: white;

  &:hover {
    background-color: #ff6666;
  }
`;

export default CreateRoomModal;