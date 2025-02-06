import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { backgroundImages } from '../assets/images';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loginData = {
        username: formData.id,        // ✅ 서버가 username 필드를 요구하는지 확인
        password: formData.password
      };
      
      const response = await login(loginData);  // ✅ 이 부분에서 실제로 토큰을 반환하는지 확인 필요
      console.log('로그인 성공:', response);
  
      // 로그인 성공 시 토큰 저장
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);  // ✅ 토큰 저장
      }
      navigate('/lobby');
    } catch (error) {
      console.error('로그인 오류:', error);
    }
  };

  return (
    <LoginContainer>
      <BackgroundImage />
      <Title>THE RAMZEE STORY</Title>
      
      <FormContainer>
        <form onSubmit={handleSubmit}>
          <Input 
            type="text"
            placeholder="아이디"
            value={formData.id}
            onChange={(e) => setFormData({...formData, id: e.target.value})}
            disabled={loading}
          />
          <Input 
            type="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            disabled={loading}
          />
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonGroup>
            <LoginButton type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </LoginButton>
            <ForgotButton 
              type="button" 
              onClick={() => navigate('/forgot-password')}
              disabled={loading}
            >
              비밀번호 찾기
            </ForgotButton>
          </ButtonGroup>
          
          <RegisterButton 
            type="button"
            onClick={() => navigate('/register')}
            disabled={loading}
          >
            회원가입
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
 background-image: url(${backgroundImages.forest});
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
const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
`;
export default Login;