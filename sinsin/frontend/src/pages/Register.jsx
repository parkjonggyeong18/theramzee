// pages/Register.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
<<<<<<< HEAD
import forestBg from '../assets/images/backgrounds/forest-bg.gif';

const Register = () => {
 const navigate = useNavigate();
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

 const handleSubmit = (e) => {
   e.preventDefault();
   if (validateForm()) {
     // API 연동 후 추가 예정
     navigate('/');
   }
 };

 const handleChange = (e) => {
   const { name, value } = e.target;
   setFormData(prev => ({
     ...prev,
     [name]: value
   }));
 };

 return (
   <RegisterContainer>
     <BackgroundImage />
     <Title>THE RAMZEE STORY</Title>
     
     <FormContainer>
       <form onSubmit={handleSubmit}>
         <InputGroup>
           <Input
             name="id"
             type="text"
             placeholder="ID"
             value={formData.id}
             onChange={handleChange}
           />
           {errors.id && <ErrorText>{errors.id}</ErrorText>}
         </InputGroup>

         <InputGroup>
           <Input
             name="password"
             type="password"
             placeholder="PASSWORD"
             value={formData.password}
             onChange={handleChange}
           />
           {errors.password && <ErrorText>{errors.password}</ErrorText>}
         </InputGroup>

         <InputGroup>
           <Input
             name="confirmPassword"
             type="password"
             placeholder="CONFIRM PASSWORD"
             value={formData.confirmPassword}
             onChange={handleChange}
           />
           {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
         </InputGroup>

         <InputGroup>
           <Input
             name="username"
             type="text"
             placeholder="USERNAME"
             value={formData.username}
             onChange={handleChange}
           />
           {errors.username && <ErrorText>{errors.username}</ErrorText>}
         </InputGroup>

         <InputGroup>
           <Input
             name="nickname"
             type="text"
             placeholder="NICKNAME"
             value={formData.nickname}
             onChange={handleChange}
           />
           {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
         </InputGroup>

         <InputGroup>
           <Input
             name="email"
             type="email"
             placeholder="E-MAIL"
             value={formData.email}
             onChange={handleChange}
           />
           {errors.email && <ErrorText>{errors.email}</ErrorText>}
         </InputGroup>

         <ButtonGroup>
           <RegisterButton type="submit">REGISTER</RegisterButton>
           <LoginButton type="button" onClick={() => navigate('/')}>
             LOG IN
           </LoginButton>
         </ButtonGroup>
       </form>
     </FormContainer>
   </RegisterContainer>
 );
};

const RegisterContainer = styled.div`
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
 background-image: url(${forestBg});
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

const InputGroup = styled.div`
 margin-bottom: 1rem;
`;

const Input = styled.input`
 width: 93.5%;
 padding: 0.75rem;
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

const ErrorText = styled.span`
 color: #ff0000;
 font-size: 0.8rem;
 margin-top: 0.2rem;
 display: block;
`;

const ButtonGroup = styled.div`
 display: flex;
 justify-content: space-between;
 margin-top: 1rem;
`;

const RegisterButton = styled.button`
 background-color: #90EE90;
 color: black;
 padding: 0.5rem 1.5rem;
 border: none;
 border-radius: 5px;
 cursor: pointer;
 transition: background-color 0.2s;

 &:hover {
   background-color: #98FB98;
 }
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
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default Register;