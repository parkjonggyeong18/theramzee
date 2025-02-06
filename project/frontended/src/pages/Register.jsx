import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { backgroundImages } from '../assets/images';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    nickname: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (emailTimer > 0) {
      interval = setInterval(() => {
        setEmailTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsEmailSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailTimer]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.id) newErrors.id = '아이디를 입력해주세요';
    else if (formData.id.length < 4) newErrors.id = '아이디는 4자 이상이어야 합니다';
    
    if (!formData.password) newErrors.password = '비밀번호를 입력해주세요';
    else if (formData.password.length < 8) newErrors.password = '비밀번호는 8자 이상이어야 합니다';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    if (!formData.email) newErrors.email = '이메일을 입력해주세요';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = '올바른 이메일 형식이 아닙니다';
    
    if (!isEmailVerified) newErrors.email = '이메일 인증이 필요합니다';
    
    if (!formData.username) newErrors.username = '이름을 입력해주세요';
    if (!formData.nickname) newErrors.nickname = '닉네임을 입력해주세요';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSend = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({...prev, email: '올바른 이메일을 입력해주세요'}));
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8080/api/v1/email/email-send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.username,  // 이름 필드 추가
          type: "register"         // 인증 타입 추가
        })
      });
  
      const data = await response.json();
      console.log('Response:', data);  // 응답 데이터 확인
  
      if (data.success) {  // success 필드로 확인
        setIsEmailSent(true);
        setEmailTimer(180);
        alert('인증번호가 발송되었습니다.');
      } else {
        throw new Error(data.message || '이메일 발송 실패');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors(prev => ({...prev, email: error.message || '인증번호 발송에 실패했습니다'}));
    }
  };
  
  const handleEmailVerify = async () => {
    if (!formData.emailCode) {
      setErrors(prev => ({...prev, emailCode: '인증번호를 입력해주세요'}));
      return;
    }
  
    try {
      // 백엔드에서 받은 인증번호와 입력한 인증번호 비교
      const response = await fetch('http://localhost:8080/api/v1/email/email-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          authNum: formData.emailCode       // 사용자가 입력한 인증번호
        })
      });
  
      if (response.ok) {
        setIsEmailVerified(true);       // 인증 성공 상태로 변경
        setEmailTimer(0);               // 타이머 종료
        alert('이메일이 인증되었습니다.');
      } else {
        throw new Error('인증번호가 일치하지 않습니다');
      }
    } catch (error) {
      setErrors(prev => ({...prev, emailCode: '인증번호가 일치하지 않습니다'}));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await register(formData);
      navigate('/');
    } catch (error) {
      console.error('회원가입 오류:', error);
    }
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
              placeholder="아이디"
              value={formData.id}
              onChange={(e) => setFormData({...formData, id: e.target.value})}
              disabled={loading}
            />
            {errors.id && <ErrorText>{errors.id}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="password"
              type="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={loading}
            />
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              disabled={loading}
            />
            {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="username"
              type="text"
              placeholder="이름"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              disabled={loading}
            />
            {errors.username && <ErrorText>{errors.username}</ErrorText>}
          </InputGroup>

          <InputGroup>
            <Input
              name="nickname"
              type="text"
              placeholder="닉네임"
              value={formData.nickname}
              onChange={(e) => setFormData({...formData, nickname: e.target.value})}
              disabled={loading}
            />
            {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
          </InputGroup>

          <InputGroup>
  <EmailContainer>
    <EmailInput
      name="email"
      type="email"
      placeholder="이메일"
      value={formData.email}
      onChange={(e) => setFormData({...formData, email: e.target.value})}
      disabled={loading || isEmailVerified}
    />
    <EmailButton
      type="button"
      onClick={handleEmailSend}
      disabled={loading || isEmailVerified || isEmailSent}
    >
      {isEmailSent ? '재전송' : '인증번호 전송'}
    </EmailButton>
  </EmailContainer>
  {errors.email && <ErrorText>{errors.email}</ErrorText>}
</InputGroup>

{/* 인증번호 입력 폼 - 인증번호 전송 후에만 표시 */}
{isEmailSent && (
  <InputGroup>
    <EmailContainer>
      <EmailInput
        name="emailCode"
        type="text"
        placeholder="인증번호 6자리"
        value={formData.emailCode}
        onChange={(e) => setFormData({...formData, emailCode: e.target.value})}
        disabled={loading || isEmailVerified}
        maxLength={6}
      />
      <EmailButton
        type="button"
        onClick={handleEmailVerify}
        disabled={loading || isEmailVerified}
      >
        확인
      </EmailButton>
      {emailTimer > 0 && <Timer>{formatTime(emailTimer)}</Timer>}
    </EmailContainer>
    {errors.emailCode && <ErrorText>{errors.emailCode}</ErrorText>}
    {isEmailVerified && <SuccessText>✓ 이메일이 인증되었습니다</SuccessText>}
  </InputGroup>
)}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonGroup>
            <RegisterButton type="submit" disabled={loading}>
              {loading ? '가입 중...' : '가입하기'}
            </RegisterButton>
            <LoginButton 
              type="button" 
              onClick={() => navigate('/')}
              disabled={loading}
            >
              로그인
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
const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
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
`;

const EmailContainer = styled.div`
  display: flex;
  gap: 8px;
  position: relative;
`;

const EmailInput = styled(Input)`
  width: 70%;
`;

const EmailButton = styled.button`
  background-color: ${props => props.disabled ? '#ccc' : '#90EE90'};
  color: ${props => props.disabled ? '#666' : 'black'};
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  white-space: nowrap;
  flex: 1;

  &:hover:not(:disabled) {
    background-color: #98FB98;
  }
`;

const Timer = styled.span`
  position: absolute;
  right: 120px;
  top: 50%;
  transform: translateY(-50%);
  color: #ff6b6b;
  font-size: 0.9rem;
`;

const SuccessText = styled.span`
  color: #40c057;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  display: block;
`;

export default Register;