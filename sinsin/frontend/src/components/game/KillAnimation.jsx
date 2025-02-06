// components/game/KillAnimation.jsx
import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const KillAnimation = ({ onAnimationEnd }) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
};

// 애니메이션 키프레임
const fadeInOut = keyframes`
<<<<<<< HEAD
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
 width: 100vw;
 height: 100vh;
 background: rgba(0, 0, 0, 0.8);
 z-index: 1000;
 display: flex;
 justify-content: center;
 align-items: center;
`;

const AnimationContainer = styled.div`
 width: 100%;
 height: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
`;

const KillEffect = styled.div`
 width: 100%;
 height: 100%;
 background-image: url('/assets/images/animations/kill-animation.gif');
 background-size: contain;
 background-position: center;
 background-repeat: no-repeat;
 animation: ${fadeInOut} 3s forwards;
=======
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
>>>>>>> 1a5ec4e9db4db0cb557aa52303ce34f475546c7d
`;

export default KillAnimation;