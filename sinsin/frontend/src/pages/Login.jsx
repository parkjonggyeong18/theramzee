// pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// 배경 이미지 import 추가
import forestBg from '../assets/images/backgrounds/forest-bg.gif';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // API 연동 후 추가 예정
    navigate('/lobby');
  };

  return (
    <LoginContainer>
      <BackgroundImage />
      <Title>THE RAMZEE STORY</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text"
            placeholder="ID"
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
          />
          <Input 
            type="password"
            placeholder="PASSWORD"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          
          <ButtonGroup>
            <LoginButton type="submit">LOG IN</LoginButton>
            <ForgotButton onClick={(e) => {e.preventDefault(); navigate('/forgot-password')}}>
              FORGOT IT?
            </ForgotButton>
          </ButtonGroup>
          
          <RegisterButton onClick={(e) => {e.preventDefault(); navigate('/register')}}>
            REGISTER
          </RegisterButton>
        </form>
      </FormContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${forestBg}); // 배경 이미지
  background-size: cover;
  z-index: -1;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 
    0 0 10px #00ff00,
    0 0 20px #00ff00,
    0 0 30px #00ff00;
  z-index: 1;
`;

const FormContainer = styled.div`
  background-color: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
  z-index: 1;
`;

const Input = styled.input`
  width: 93.5%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 5px;
  background: white;
  font-size: 1rem;
  transition: transform 0.2s;

  &:focus {
    outline: none;
    transform: scale(1.02);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const LoginButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3d2218;
  }
`;

const ForgotButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #98FB98;
  }
`;

const RegisterButton = styled.button`
  width: 100%;
  background: none;
  border: none;
  color: white;
  padding: 0.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #90EE90;
  }
`;

export default Login;