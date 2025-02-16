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
          <div>
            <SectionTitle>착한 다람쥐</SectionTitle>
            <Description>
              착한 다람쥐는 팀을 도와 임무를 완수해야 합니다. 협력하여 목표를 달성하세요!
              <br />미니게임을 통해 도토리를 획득하고 창고에 채워 승리를 이끌어 주세요.
              <br />투표를 통해 나쁜 다람쥐를 색출해 승리를 이끌어 주세요.
            </Description>
          </div>
        </Section>

        {/* 나쁜 다람쥐 */}
        <Section>
          <Image src="/cursors/evil-squirrel.png" alt="나쁜 다람쥐" />
          <div>
            <SectionTitle>나쁜 다람쥐</SectionTitle>
            <Description>
              나쁜 다람쥐는 착한 다람쥐를 방해하며 승리를 쟁취해야 합니다.
              <br />에너지를 3 채워 킬을 통해 착한 다람쥐를 모두 제거하세요.
              <br />두 번의 투표에서 모두 지목되지 않고 살아남아야 승리합니다.
            </Description>
          </div>
        </Section>

        {/* 투표 */}
        <Section>
          <Image src="/information/vote.png" alt="투표 아이콘" />
          <div>
            <SectionTitle>투표</SectionTitle>
            <Description>
              중간 투표와 최종 투표를 통해 나쁜 다람쥐를 색출하세요.
              <br />최종 투표에서 나쁜 다람쥐를 찾지 못하면 착한 다람쥐는 패배합니다.
            </Description>
          </div>
        </Section>

        {/* 미니게임 */}
        <Section>
          <Image src="/information/mini-game.png" alt="미니게임 아이콘" />
          <div>
            <SectionTitle>미니게임</SectionTitle>
            <Description>
              미니게임은 임무를 완수하고 도토리를 획득할 수 있는 기회를 제공합니다.
              <br />획득한 도토리를 창고에 채워 승리를 이끌어 주세요.   
            </Description>
          </div>
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
  padding: 30px;
  border-radius: 10px;
  text-align: center; /* 텍스트 정렬 왼쪽으로 */
  position: relative; /* 닫기 버튼 위치를 위한 설정 */
`;

const Section = styled.div`
  display: flex;
  align-items: flex-start; /* 이미지와 텍스트 상단 정렬 */
  gap: 15px; /* 이미지와 텍스트 간격 */
  margin-bottom: 20px;
  text-align: left; /* 텍스트 정렬 왼쪽으로 */

  &:last-child {
    margin-bottom: 0; /* 마지막 섹션 간격 제거 */
  }
`;

const Image = styled.img`
  width: 60px; /* 이미지 크기 조정 */
  height: auto;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 5px;
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
