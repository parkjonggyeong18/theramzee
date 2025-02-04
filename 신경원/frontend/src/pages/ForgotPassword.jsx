import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { backgroundImages } from '../assets/images';

const ForgotPassword = () => {
 const navigate = useNavigate();
 const [mode, setMode] = useState('id');
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
       // 아이디 찾기 API 호출
       // const response = await findId(formData.username, formData.email);
       // alert(`회원님의 아이디는 ${response.id} 입니다.`);
     } else {
       if (!formData.id || !formData.email) {
         alert('아이디와 이메일을 입력해주세요.');
         return;
       }
       // 비밀번호 찾기 API 호출
       // const response = await resetPassword(formData.id, formData.email);
       // alert('임시 비밀번호가 이메일로 발송되었습니다.');
     }
     navigate('/');
   } catch (error) {
     alert('처리 중 오류가 발생했습니다.');
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
               onChange={e => setFormData({...formData, username: e.target.value})}
             />
             <Input
               type="email"
               placeholder="E-MAIL"
               value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
             />
           </>
         ) : (
           <>
             <Input
               type="text"
               placeholder="ID"
               value={formData.id}
               onChange={e => setFormData({...formData, id: e.target.value})}
             />
             <Input
               type="email"
               placeholder="E-MAIL"
               value={formData.email}
               onChange={e => setFormData({...formData, email: e.target.value})}
             />
           </>
         )}
         <ButtonGroup>
           <SubmitButton type="submit">SUBMIT</SubmitButton>
           <LoginButton type="button" onClick={() => navigate('/')}>LOG IN</LoginButton>
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