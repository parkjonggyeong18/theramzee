import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { sendEmailVerification, verifyEmailCode } from '../../../api/email';

const RegisterForm = ({ onRegister, loading }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailCode: '',
  });

  const [errors, setErrors] = useState({});
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailTimer, setEmailTimer] = useState(0);

  // 이메일 인증 타이머 실행 (180초 유효)
  useEffect(() => {
    if (emailTimer > 0) {
      const interval = setInterval(() => {
        setEmailTimer((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [emailTimer]);

  // 입력값 변경 처리
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 4)
      newErrors.username = '아이디는 4자 이상이어야 합니다';

    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = '비밀번호는 8자 이상, 숫자, 대소문자, 특수문자를 포함해야 합니다';
    }
    
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = '올바른 이메일을 입력해주세요';

    if (!isEmailVerified) newErrors.emailCode = '이메일 인증이 필요합니다';

    if (!formData.name) newErrors.name = '이름을 입력해주세요';
    if (!formData.nickname) newErrors.nickname = '닉네임을 입력해주세요';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 이메일 인증번호 요청
  const handleEmailSend = async () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: '올바른 이메일을 입력해주세요' }));
      return;
    }
    try {
      await sendEmailVerification(formData.email);
      setIsEmailSent(true);
      setEmailTimer(180);
      setErrors((prev) => ({ ...prev, email: '' }));
    } catch (error) {
      setIsEmailSent(false);
      if (error.response?.status === 400) {
        setErrors((prev) => ({ ...prev, email: '이미 가입된 이메일입니다' }));
      } else {
        setErrors((prev) => ({ ...prev, email: '인증번호 전송 실패: ' + error.message }));
      }
    }
  };

  // 이메일 인증 확인
  const handleEmailVerify = async () => {
    if (!formData.emailCode.trim()) {
      setErrors((prev) => ({ ...prev, emailCode: '인증번호를 입력해주세요' }));
      return;
    }
  
    try {
      console.log("📤 이메일 인증 요청: ", {
        email: formData.email,
        emailCode: formData.emailCode,
      });
  
      const response = await verifyEmailCode(formData.email, formData.emailCode);
  
      console.log("📥 서버 응답: ", response);
  
      setIsEmailVerified(true);
      setEmailTimer(0);
      setErrors((prev) => ({ ...prev, emailCode: '' }));
    } catch (error) {
      console.error("❌ 이메일 인증 오류:", error.response?.data || error.message);
      setErrors((prev) => ({ ...prev, emailCode: '인증번호가 일치하지 않습니다' }));
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📤 서버로 보낼 회원가입 요청 데이터:", {
        username: formData.username,
        name: formData.name,
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password
    });

    if (!validateForm()) return;

    // 백엔드 요구사항에 맞게 불필요한 필드 제거
    onRegister({
        username: formData.username,
        name: formData.name,
        nickname: formData.nickname,
        email: formData.email,
        password: formData.password,
    });
};

  return (
    <FormContainer onSubmit={handleSubmit}>
  <Title>회원가입</Title>

  {/* 아이디 입력 */}
  <InputWrapper>
    <Input
      name="username"
      placeholder="아이디"
      value={formData.username}
      onChange={handleInputChange}
      hasError={!!errors.username} // 오류 여부 전달
    />
    {errors.username && <ErrorText>{errors.username}</ErrorText>}
  </InputWrapper>

  {/* 비밀번호 입력 */}
  <InputWrapper>
    <Input
      name="password"
      type="password"
      placeholder="비밀번호"
      value={formData.password}
      onChange={handleInputChange}
      hasError={!!errors.password} // 오류 여부 전달
    />
    {errors.password && <ErrorText>{errors.password}</ErrorText>}
  </InputWrapper>

  {/* 비밀번호 확인 */}
  <InputWrapper>
    <Input
      name="confirmPassword"
      type="password"
      placeholder="비밀번호 확인"
      value={formData.confirmPassword}
      onChange={handleInputChange}
      hasError={!!errors.confirmPassword} // 오류 여부 전달
    />
    {errors.confirmPassword && <ErrorText>{errors.confirmPassword}</ErrorText>}
  </InputWrapper>

  {/* 이름 입력 */}
  <InputWrapper>
    <Input
      name="name"
      placeholder="이름"
      value={formData.name}
      onChange={handleInputChange}
      hasError={!!errors.name} // 오류 여부 전달
    />
    {errors.name && <ErrorText>{errors.name}</ErrorText>}
  </InputWrapper>

  {/* 닉네임 입력 */}
  <InputWrapper>
    <Input
      name="nickname"
      placeholder="닉네임"
      value={formData.nickname}
      onChange={handleInputChange}
      hasError={!!errors.nickname} // 오류 여부 전달
    />
    {errors.nickname && <ErrorText>{errors.nickname}</ErrorText>}
  </InputWrapper>

  {/* 이메일 입력 */}
  <EmailContainer>
    <Input
      name="email"
      type="email"
      placeholder="이메일"
      value={formData.email}
      disabled={isEmailVerified}
      onChange={handleInputChange}
      hasError={!!errors.email} // 오류 여부 전달
    />
    <EmailButton type="button" onClick={handleEmailSend} disabled={isEmailVerified || isEmailSent}>
      {isEmailSent ? '재전송' : '인증번호 전송'}
    </EmailButton>
  </EmailContainer>
  {errors.email && <ErrorText>{errors.email}</ErrorText>}

  {/* 이메일 인증번호 입력 */}
  {isEmailSent && (
    <>
      <EmailContainer>
        <Input
          name="emailCode"
          placeholder="인증번호 입력"
          value={formData.emailCode}
          disabled={isEmailVerified}
          onChange={handleInputChange}
          hasError={!!errors.emailCode} // 오류 여부 전달
        />
        <EmailButton type="button" onClick={handleEmailVerify} disabled={isEmailVerified}>
          확인
        </EmailButton>
        {emailTimer > 0 && <Timer>{emailTimer}s</Timer>}
      </EmailContainer>
      {errors.emailCode && <ErrorText>{errors.emailCode}</ErrorText>}
    </>
  )}

  {/* 버튼 그룹 */}
  <ButtonGroup>
    <Button type="submit" disabled={loading}>{loading ? '가입 중...' : '가입하기'}</Button>
    <LoginButton type="button" onClick={() => navigate('/')}>뒤로가기</LoginButton>
  </ButtonGroup>
</FormContainer>
  );
};

// **스타일 구성**
const FormContainer = styled.form`
  background: rgba(139, 69, 19, 0.9);
  padding: 2rem;
  border-radius: 15px;
  width: 400px;
`;

const Title = styled.h2`
  color: white;
  text-align: center;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  width: 94%; /* 모든 입력창의 너비를 100%로 통일 */
  padding: 0.75rem;
  margin-bottom: ${(props) => (props.hasError ? '0.25rem' : '0.5rem')}; /* 에러 메시지 공간 확보 */
  border: ${(props) => (props.hasError ? '2px solid red' : '1px solid #ccc')}; /* 에러 시 빨간 테두리 */
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${(props) => (props.hasError ? 'red' : '#90ee90')}; /* 포커스 시 색상 변경 */
  }
`;

const EmailContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center; /* 수직 중앙 정렬 */
`;

const EmailButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.3rem 1rem ;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #98FB98;
  }
`;

const Timer = styled.span`
  color: #ff6b6b;
  font-size: 0.9rem;
`;

const Button = styled.button`
  width: 100%;
  background-color: #2d1810;
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.8rem;
  margin-top: -0.25rem;
`;
const ButtonGroup=styled.div`
display
:flex;
justify-content:flex-end;
  margin-top: 0.5rem;
gap:.5rem;`;

const LoginButton = styled.button`
  background-color: #2d1810;
  color: white;
  padding: 0.5rem;
  width: 100px; /* 버튼 너비 고정 */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.8rem;
  text-align: center; /* 텍스트 가운데 정렬 */
  
  white-space: nowrap;

  &:hover {
    background-color: #3d2218;
  }

  &:active {
    background-color: #1e0f08;
  }
`;


const InputWrapper = styled.div`
  margin-bottom: ${(props) => (props.hasError ? '1rem' : '0.5rem')};
`;
export default RegisterForm;
