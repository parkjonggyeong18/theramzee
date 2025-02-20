// import React, { useEffect } from 'react';
// import styled from 'styled-components';

// const SplashScreen = ({ onComplete }) => {
//   useEffect(() => {
//     // 입장 음악 재생
//     const audio = new Audio('/audio/entrance.mp3');
//     audio.play().catch((error) => console.error('음악 재생 오류:', error));

//     // GIF 종료 후 콜백 호출
//     const timer = setTimeout(() => {
//       audio.pause(); // 음악 정지
//     }, 3000);

//     return () => {
//       clearTimeout(timer); // 타이머 정리
//       audio.pause(); // 컴포넌트 언마운트 시 음악 정지
//     };
//   }, [onComplete]);

//   return (
//     <SplashContainer>
//       <SplashImage src={'/start/img.gif'} alt="스플래시 화면" />
//     </SplashContainer>
//   );
// };

// const SplashContainer = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100vw;
//   height: 100vh;
//   background-color: black; /* 배경색 */
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// const SplashImage = styled.img`
//   width: auto;
// `;

// export default SplashScreen;


import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const SplashScreen = ({ onComplete }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // intro-music.mp3 오디오 객체 생성 및 볼륨 50% 설정
    audioRef.current = new Audio('/audio/intro-music.mp3');
    audioRef.current.volume = 0.5;

    // 4.5초 후에 오디오 재생 시도
    const timer = setTimeout(() => {
      audioRef.current.play().catch((error) =>
        console.error('Audio play error:', error)
      );
    }, 4500);

    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <SplashContainer>
      <SplashVideo
        ref={videoRef}
        autoPlay
        muted
        onEnded={() => onComplete && onComplete()}
      >
        <source src="/start/video.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </SplashVideo>
    </SplashContainer>
  );
};

const SplashContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SplashVideo = styled.video`
  width: auto;
  max-width: 100%;
  max-height: 100%;
`;

export default SplashScreen;
