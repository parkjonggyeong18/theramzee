// pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import forestBg from '../assets/images/backgrounds/forest-bg.gif';

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: '',
    username: '',
    nickname: '',
    email: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = '아이디를 입력해주세요';
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    if (!formData.username) newErrors.username = '이름을 입력해주세요';
    if (!formData.nickname) newErrors.nickname = '닉네임을 입력해주세요';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await handleRegister(formData.id, formData.password);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <RegisterContainer>
      <BackgroundImage src={forestBg} />
      <Title>회원가입</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text"
            name="id"
            placeholder="아이디"
            value={formData.id}
            onChange={handleChange}
          />
          {errors.id && <ErrorMessage>{errors.id}</ErrorMessage>}
          
          <Input 
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
          
          <Input 
            type="password"
            name="confirmPassword"
            placeholder="비밀번호 확인"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
          
          <Input 
            type="text"
            name="username"
            placeholder="이름"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
          
          <Input 
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
          />
          {errors.nickname && <ErrorMessage>{errors.nickname}</ErrorMessage>}
          
          <Input 
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
          
          <Button type="submit">회원가입</Button>
        </form>
      </FormContainer>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const Title = styled.h1`
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
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 10px;
`;

export default Register;