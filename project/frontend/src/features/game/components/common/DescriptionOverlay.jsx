import React from 'react';
import styled from 'styled-components';

const DescriptionOverlay = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <Overlay>
      <Content>
        {/* 닫기 버튼 (오른쪽 위 X 버튼) */}
        <CloseButton onClick={onClose}>×</CloseButton>

        <h2>게임 설명</h2>

        {/* 착한 다람쥐 */}
        <Section>
          <Image src="/cursors/good-squirrel.png" alt="착한 다람쥐" />
          <Description>
            착한 다람쥐는 팀을 도와 임무를 완수해야 합니다. 협력하여 목표를 달성하세요!
          </Description>
        </Section>

        {/* 나쁜 다람쥐 */}
        <Section>
          <Image src="/cursors/evil-squirrel.png" alt="나쁜 다람쥐" />
          <Description>
            나쁜 다람쥐는 착한 다람쥐를 방해하고 자신의 목표를 달성해야 합니다.
          </Description>
        </Section>

        {/* 투표 */}
        <Section>
          <Image src="/information/vote.png" alt="투표 아이콘" />
          <Description>
            투표는 게임의 중요한 부분입니다. 팀원들과 논의하여 올바른 결정을 내리세요.
          </Description>
        </Section>

        {/* 미니게임 */}
        <Section>
          <Image src="/information/mini-game.png" alt="미니게임 아이콘" />
          <Description>
            미니게임은 임무를 완수하거나 특별한 보상을 받을 수 있는 기회를 제공합니다.
          </Description>
        </Section>
      </Content>
    </Overlay>
  );
};

export default DescriptionOverlay;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  position: relative; /* 닫기 버튼 위치를 위한 설정 */
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: auto;
  margin-right: 10px;
`;

const Description = styled.p`
  font-size: 16px;
`;

const CloseButton = styled.button`
  position: absolute; /* 오른쪽 위에 배치 */
  top: 10px; /* 상단 여백 */
  right: 10px; /* 오른쪽 여백 */
  background-color: transparent; /* 배경 투명 */
  color: #000; /* 텍스트 색상 */
  border: none; /* 테두리 없음 */
  font-size: 24px; /* X 크기 */
  font-weight: bold; /* X 굵게 */
  cursor: pointer;

  &:hover {
    color: #ff4444; /* 호버 시 빨간색으로 변경 */
  }
`;
