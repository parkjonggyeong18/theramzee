import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useVolume } from '../../contexts/VolumeContext';
import { musicMap } from './musicMap';

const BackgroundMusic = () => {
  const { volume } = useVolume();
  const location = useLocation();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // 볼륨 설정
      audioRef.current.volume = volume;

      // 현재 경로에 맞는 음악 가져오기
      console.log("123"+location.pathname);
      const matchedKey = Object.keys(musicMap).find((key) => location.pathname.startsWith(key));
      const currentMusic = matchedKey ? musicMap[matchedKey] : null;

      // 음악이 변경되어야 할 경우만 src 업데이트 및 재생
      if (currentMusic && audioRef.current.src !== window.location.origin + currentMusic) {
        audioRef.current.src = currentMusic;
        audioRef.current.play().catch((error) => {
          console.error('오디오 재생 오류:', error);
        });
      }
    }
  }, [location.pathname, volume]);

  return <audio ref={audioRef} autoPlay loop />;
};

export default BackgroundMusic;
