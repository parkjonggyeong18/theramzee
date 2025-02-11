import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { sendEmailVerification, verifyEmailCode } from '../../../api/email';

const RegisterForm = ({ onRegister, loading }) => {
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

    if (!formData.password || formData.password.length < 8)
      newErrors.password = '비밀번호는 8자 이상이어야 합니다';

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
      setErrors((prev) => ({ ...prev, email: '인증번호 전송 실패: ' + error.message }));
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

      {Object.values(errors).map((err, index) => (
        <ErrorText key={index}>{err}</ErrorText>
      ))}

      <Input name="username" placeholder="아이디" value={formData.username}
        onChange={handleInputChange} />
      
      <Input name="password" type="password" placeholder="비밀번호" value={formData.password}
        onChange={handleInputChange} />

      <Input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={formData.confirmPassword}
        onChange={handleInputChange} />

      <Input name="name" placeholder="이름" value={formData.name}
        onChange={handleInputChange} />

      <Input name="nickname" placeholder="닉네임" value={formData.nickname}
        onChange={handleInputChange} />

      <EmailContainer>
        <Input name="email" type="email" placeholder="이메일" value={formData.email} disabled={isEmailVerified}
          onChange={handleInputChange} />
        <EmailButton type="button" onClick={handleEmailSend} disabled={isEmailVerified || isEmailSent}>
          {isEmailSent ? '재전송' : '인증번호 전송'}
        </EmailButton>
      </EmailContainer>

      {isEmailSent && (
        <EmailContainer>
          <Input name="emailCode" placeholder="인증번호 6자리" value={formData.emailCode} disabled={isEmailVerified}
            onChange={handleInputChange} />
          <EmailButton type="button" onClick={handleEmailVerify} disabled={isEmailVerified}>
            확인
          </EmailButton>
          {emailTimer > 0 && <Timer>{emailTimer}s</Timer>}
        </EmailContainer>
      )}

      <Button type="submit" disabled={loading}>{loading ? '가입 중...' : '가입하기'}</Button>
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
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
`;

const EmailContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 0.5rem;
`;

const EmailButton = styled.button`
  background-color: #90EE90;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
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
  margin-bottom: 0.5rem;
`;

export default RegisterForm;
