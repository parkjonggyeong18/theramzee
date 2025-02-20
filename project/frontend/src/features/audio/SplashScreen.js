import React, { useEffect } from 'react';
import styled from 'styled-components';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // 입장 음악 재생
    const audio = new Audio('/audio/entrance.mp3');

    // GIF 종료 후 콜백 호출
    const timer = setTimeout(() => {
      audio.pause(); // 음악 정지
    }, 3000);

    return () => {
      clearTimeout(timer); // 타이머 정리
      audio.pause(); // 컴포넌트 언마운트 시 음악 정지
    };
  }, [onComplete]);

  return (
    <SplashContainer>
      <SplashImage src={'/start/img.gif'} alt="스플래시 화면" />
    </SplashContainer>
  );
};

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black; /* 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SplashImage = styled.img`
  width: auto;
`;

export default SplashScreen;
