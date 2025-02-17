import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { resetPassword, findUsername } from '../../../api/email'; // API 호출 함수 가져오기

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('id'); // 'id' or 'password'
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: ''
  });
  const [message, setMessage] = useState(''); // 결과 메시지 표시용 상태

  // Form 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'id') {
        // 아이디 찾기 API 호출
        await findUsername(formData.username, formData.email); // 이름과 이메일 전달
        setMessage('Your username has been sent to your email.');
      } else if (mode === 'password') {
        // 비밀번호 초기화 API 호출
        await resetPassword(formData.username, formData.email); // 아이디와 이메일 전달
        setMessage('A temporary password has been sent to your email.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <Title>THE RAMZEE STORY</Title>

      <FormContainer>
        <TabButtons>
          <TabButton 
            active={mode === 'id'} 
            onClick={() => setMode('id')}
          >
            ID
          </TabButton>
          <TabButton 
            active={mode === 'password'} 
            onClick={() => setMode('password')}
          >
            PASSWORD
          </TabButton>
        </TabButtons>

        <form onSubmit={handleSubmit}>
          {mode === 'id' ? (
            <>
              <Input
                type="text"
                placeholder="USERNAME"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-MAIL"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="ID"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-MAIL"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </>
          )}
          <ButtonGroup>
            <SubmitButton type="submit">SUBMIT</SubmitButton>
            <LoginButton onClick={() => navigate('/')}>LOG IN</LoginButton>
          </ButtonGroup>
        </form>

        {message && <Message>{message}</Message>} {/* 결과 메시지 표시 */}
      </FormContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/forest-bg.gif');
  background-size: cover;
  z-index: -1;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
`;

const FormContainer = styled.div`
  background-color: rgba(139,69,19,0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
`;

const TabButtons = styled.div`
 display:flex;`;

const TabButton=styled.button`
flex:1;padding:.5rem;background:${props=>props.active?'#2d1810':'transparent'};
color:${props=>props.active?'white':'#2d1810'};border:none;cursor:pointer;`;

const Input=styled.input`
width:93.5%;padding:.75rem;margin-bottom:.75rem;border:none;border-radius:.5rem;font-size:.875rem;`;

const ButtonGroup=styled.div`display:flex;justify-content:flex-end;gap:.5rem;`;

const SubmitButton=styled.button`background:#90EE90;color:black;padding:.5rem;border-radius:.5rem;cursor:pointer;`;
const LoginButton=styled.button`background:black;color:white;padding:.5rem;border-radius:.5rem;cursor:pointer;`;
const Message=styled.p`color:white;margin-top:.75rem;text-align:center;`;

export default ForgotPassword;

