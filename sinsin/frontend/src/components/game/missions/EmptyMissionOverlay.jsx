// components/game/missions/EmptyMissionOverlay.jsx
import styled from 'styled-components';

const EmptyMissionOverlay = ({ onClose }) => {
  return (
    <OverlayContainer>
      <Message>미션 준비중입니다...</Message>
      <CloseButton onClick={onClose}>나가기</CloseButton>
    </OverlayContainer>
  );
};

const OverlayContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
`;

const Message = styled.div`
  color: white;
  font-size: 2rem;
  font-family: 'JejuHallasan';
`;

const CloseButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background: red;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

export default EmptyMissionOverlay;