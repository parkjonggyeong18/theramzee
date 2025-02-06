// components/game/KillAnimation.jsx
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const KillAnimation = ({ onAnimationEnd }) => {
  useEffect(() => {
    // 애니메이션 재생 시간(3초) 후 콜백 실행
    const timer = setTimeout(() => {
      onAnimationEnd?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onAnimationEnd]);

  return (
    <AnimationOverlay>
      <AnimationContainer>
        <KillEffect />
      </AnimationContainer>
    </AnimationOverlay>
  );
};

// 애니메이션 키프레임
const fadeInOut = keyframes`
  0% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
  10% { 
    opacity: 1; 
    transform: scale(1); 
  }
  90% { 
    opacity: 1; 
    transform: scale(1); 
  }
  100% { 
    opacity: 0; 
    transform: scale(0.8); 
  }
`;

const AnimationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`;

const AnimationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const KillEffect = styled.div`
  width: 200px;
  height: 200px;
  background: red;
  border-radius: 50%;
  animation: ${fadeInOut} 3s ease-in-out;
`;

export default KillAnimation;