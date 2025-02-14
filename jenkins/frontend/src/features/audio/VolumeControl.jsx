import React, { useState } from 'react';
import { useVolume } from '../../contexts/VolumeContext'; // 전역 볼륨 상태 사용
import styled from 'styled-components';

const VolumeControl = () => {
  const { volume, setVolume } = useVolume();
  const [isMuted, setIsMuted] = useState(false); // 음소거 상태 관리
  const [previousVolume, setPreviousVolume] = useState(volume); // 음소거 전 볼륨 저장
  const [showVolume, setShowVolume] = useState(false); // 숫자 표시 상태

  const toggleMute = () => {
    if (isMuted) {
      // 음소거 해제: 이전 볼륨 복원
      setVolume(previousVolume);
      setIsMuted(false);
    } else {
      // 음소거: 현재 볼륨 저장 후 0으로 설정
      setPreviousVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  return (
    <VolumeContainer>
      <MuteButton onClick={toggleMute}>
        {isMuted ? '🔇' : '🔊'} {/* 음소거 상태에 따라 이모티콘 변경 */}
      </MuteButton>
      <SliderWrapper
        onMouseEnter={() => setShowVolume(true)} // 호버 시 숫자 표시
        onMouseLeave={() => setShowVolume(false)} // 호버 해제 시 숫자 숨김
      >
        <StyledSlider
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (newVolume > 0 && isMuted) {
              // 슬라이더 조작 시 음소거 해제
              setIsMuted(false);
            }
          }}
        />
        {showVolume && (
          <VolumeLabel style={{ left: `${volume * 100}%` }}>
            {Math.round(volume * 100)}
          </VolumeLabel>
        )}
      </SliderWrapper>
    </VolumeContainer>
  );
};

// 스타일 컴포넌트로 고정된 위치 설정
const VolumeContainer = styled.div`
  position: fixed;
  bottom: 10px; /* 화면 하단에서 10px */
  left: 10px; /* 화면 왼쪽에서 10px */
  display: flex; /* 수평 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
  background-color: rgba(0, 0, 0, 0); /* 반투명 검은 배경 */
  color: white;
  padding: 5px; /* 패딩 축소 */
  border-radius: 5px; /* 둥근 모서리 축소 */
  z-index: 1000; /* 다른 요소 위에 표시 */
`;

const MuteButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem; /* 버튼 크기 축소 */
  cursor: pointer;
  margin-right: 10px; /* 슬라이더와 간격 추가 */

  &:hover {
    color: coral; /* 호버 시 색상 변경 */
  }
`;

const SliderWrapper = styled.div`
  position: relative;
`;

const StyledSlider = styled.input`
  width: 150px; /* 슬라이더 너비 축소 */
  height: 8px; /* 슬라이더 높이 축소 */
  accent-color: coral; /* 슬라이더 색상 변경 */
`;

const VolumeLabel = styled.div`
  position: absolute;
  top: -25px; /* 슬라이더 위에 표시 */
  transform: translateX(-50%); /* 중앙 정렬 보정 */
  background-color: rgba(0, 0, 0, 0.8); /* 어두운 배경 */
  color: white;
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.8rem; /* 텍스트 크기 축소 */
`;

export default VolumeControl;
