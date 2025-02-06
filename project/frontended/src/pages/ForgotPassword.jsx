// pages/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { backgroundImages } from '../assets/images';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { resetPassword, findUsername, loading, error } = useAuth();
  const [mode, setMode] = useState('id'); // 'id' or 'password'
  const [formData, setFormData] = useState({
    id: '',
    username: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'id') {
        if (!formData.username || !formData.email) {
          alert('이름과 이메일을 입력해주세요.');
          return;
        }
        await findUsername({
          username: formData.username,
          email: formData.email
        });
      } else {
        if (!formData.id || !formData.email) {
          alert('아이디와 이메일을 입력해주세요.');
          return;
        }
        await resetPassword({
          username: formData.id,
          email: formData.email
        });
      }
      navigate('/');
    } catch (error) {
      console.error('처리 중 오류:', error);
    }
  };

  return (
    <Container>
      <BackgroundImage />
      <Title>THE RAMZEE STORY</Title>
      
      <FormContainer>
        <TabButtons>
          <TabButton 
            $active={mode === 'id'} 
            onClick={() => setMode('id')}
          >
            아이디 찾기
          </TabButton>
          <TabButton 
            $active={mode === 'password'} 
            onClick={() => setMode('password')}
          >
            비밀번호 찾기
          </TabButton>
        </TabButtons>

        <form onSubmit={handleSubmit}>
          {mode === 'id' ? (
            <>
              <Input
                type="text"
                placeholder="이름"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                disabled={loading}
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={loading}
              />
            </>
          ) : (
            <>
              <Input
                type="text"
                placeholder="아이디"
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
                disabled={loading}
              />
              <Input
                type="email"
                placeholder="이메일"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={loading}
              />
            </>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <ButtonGroup>
            <SubmitButton type="submit" disabled={loading}>
              {loading ? '처리 중...' : '확인'}
            </SubmitButton>
            <LoginButton type="button" onClick={() => navigate('/')}>
              로그인으로
            </LoginButton>
          </ButtonGroup>
        </form>
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
 background-image: url(${backgroundImages.forest});
 background-size: cover;
 z-index: -1;
`;

const Title = styled.h1`
 font-size: 4rem;
 font-weight: bold;
 color: white;
 margin-bottom: 2rem;
 text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
 z-index: 1;
`;

const FormContainer = styled.div`
 background-color: rgba(139, 69, 19, 0.9);
 padding: 2rem;
 border-radius: 15px;
 width: 400px;
 z-index: 1;
`;

const TabButtons = styled.div`
 display: flex;
 margin-bottom: 1rem;
`;

const TabButton = styled.button`
 flex: 1;
 padding: 0.5rem;
 background: ${props => props.active ? '#2d1810' : 'transparent'};
 color: ${props => props.active ? 'white' : '#2d1810'};
 border: none;
 cursor: pointer;
`;

const Input = styled.input`
 width: 93.5%;
 padding: 0.75rem;
 margin-bottom: 1rem;
 border: none;
 border-radius: 5px;
 font-size: 1rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
`;

const ButtonGroup = styled.div`
 display: flex;
 justify-content: space-between;
`;

const SubmitButton = styled.button`
 background-color: #90EE90;
 color: black;
 padding: 0.5rem 1.5rem;
 border: none;
 border-radius: 5px;
 cursor: pointer;
`;

const LoginButton = styled.button`
 background-color: #2d1810;
 color: white;
 padding: 0.5rem 1.5rem;
 border: none;
 border-radius: 5px;
 cursor: pointer;
`;

export default ForgotPassword;

// // pages/ForgotPassword.js
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';

// const ForgotPassword = () => {
//  const navigate = useNavigate();
//  const [mode, setMode] = useState('id'); // 'id' or 'password'
//  const [formData, setFormData] = useState({
//    id: '',
//    username: '',
//    email: ''
//  });

//  return (
//    <Container>
//      <BackgroundImage />
//      <Title>THE RAMZEE STORY</Title>
     
//      <FormContainer>
//        <TabButtons>
//          <TabButton 
//            active={mode === 'id'} 
//            onClick={() => setMode('id')}
//          >
//            ID
//          </TabButton>
//          <TabButton 
//            active={mode === 'password'} 
//            onClick={() => setMode('password')}
//          >
//            PASSWORD
//          </TabButton>
//        </TabButtons>

//        <form>
//          {mode === 'id' ? (
//            <>
//              <Input
//                type="text"
//                placeholder="USERNAME"
//                value={formData.username}
//                onChange={e => setFormData({...formData, username: e.target.value})}
//              />
//              <Input
//                type="email"
//                placeholder="E-MAIL"
//                value={formData.email}
//                onChange={e => setFormData({...formData, email: e.target.value})}
//              />
//            </>
//          ) : (
//            <>
//              <Input
//                type="text"
//                placeholder="ID"
//                value={formData.id}
//                onChange={e => setFormData({...formData, id: e.target.value})}
//              />
//              <Input
//                type="email"
//                placeholder="E-MAIL"
//                value={formData.email}
//                onChange={e => setFormData({...formData, email: e.target.value})}
//              />
//            </>
//          )}
//          <ButtonGroup>
//            <SubmitButton>SUBMIT</SubmitButton>
//            <LoginButton onClick={() => navigate('/')}>LOG IN</LoginButton>
//          </ButtonGroup>
//        </form>
//      </FormContainer>
//    </Container>
//  );
// };

// const Container = styled.div`
//  height: 100vh;
//  width: 100vw;
//  display: flex;
//  flex-direction: column;
//  align-items: center;
//  justify-content: center;
// `;

// const BackgroundImage = styled.div`
//  position: absolute;
//  top: 0;
//  left: 0;
//  width: 100%;
//  height: 100%;
//  background-image: url('/forest-bg.gif');
//  background-size: cover;
//  z-index: -1;
// `;

// const Title = styled.h1`
//  font-size: 4rem;
//  font-weight: bold;
//  color: white;
//  margin-bottom: 2rem;
//  text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00;
//  z-index: 1;
// `;

// const FormContainer = styled.div`
//  background-color: rgba(139, 69, 19, 0.9);
//  padding: 2rem;
//  border-radius: 15px;
//  width: 400px;
//  z-index: 1;
// `;

// const TabButtons = styled.div`
//  display: flex;
//  margin-bottom: 1rem;
// `;

// const TabButton = styled.button`
//  flex: 1;
//  padding: 0.5rem;
//  background: ${props => props.active ? '#2d1810' : 'transparent'};
//  color: ${props => props.active ? 'white' : '#2d1810'};
//  border: none;
//  cursor: pointer;
// `;

// const Input = styled.input`
//  width: 93.5%;
//  padding: 0.75rem;
//  margin-bottom: 1rem;
//  border: none;
//  border-radius: 5px;
//  font-size: 1rem;
// `;

// const ButtonGroup = styled.div`
//  display: flex;
//  justify-content: space-between;
// `;

// const SubmitButton = styled.button`
//  background-color: #90EE90;
//  color: black;
//  padding: 0.5rem 1.5rem;
//  border: none;
//  border-radius: 5px;
//  cursor: pointer;
// `;

// const LoginButton = styled.button`
//  background-color: #2d1810;
//  color: white;
//  padding: 0.5rem 1.5rem;
//  border: none;
//  border-radius: 5px;
//  cursor: pointer;
// `;

// export default ForgotPassword;


