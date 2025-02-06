// pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
<<<<<<< HEAD
// 배경 이미지 import 추가
=======
import { useAuth } from '../hooks/useAuth';
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
import forestBg from '../assets/images/backgrounds/forest-bg.gif';

const Login = () => {
  const navigate = useNavigate();
<<<<<<< HEAD
=======
  const { handleLogin } = useAuth();
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

<<<<<<< HEAD
  const handleSubmit = (e) => {
    e.preventDefault();
    // API 연동 후 추가 예정
    navigate('/lobby');
=======
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleLogin(formData.id, formData.password);
      navigate('/lobby');
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 다시 시도해주세요.');
    }
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  };

  return (
    <LoginContainer>
<<<<<<< HEAD
      <BackgroundImage />
=======
      <BackgroundImage src={forestBg} />
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
      <Title>THE RAMZEE STORY</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text"
<<<<<<< HEAD
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
=======
            name="id"
            placeholder="ID"
            value={formData.id}
            onChange={handleChange}
          />
          <Input 
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          <Button type="submit">로그인</Button>
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
        </form>
      </FormContainer>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
<<<<<<< HEAD
  height: 100vh;
  width: 100vw;
=======
  position: relative;
  width: 100%;
  height: 100%;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
<<<<<<< HEAD
  position: relative;
`;

const BackgroundImage = styled.div`
=======
`;

const BackgroundImage = styled.img`
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
<<<<<<< HEAD
  background-image: url(${forestBg}); // 배경 이미지
  background-size: cover;
=======
  object-fit: cover;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  z-index: -1;
`;

const Title = styled.h1`
<<<<<<< HEAD
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
=======
  color: white;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: darkblue;
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
  }
`;

export default Login;