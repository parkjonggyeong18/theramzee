// components/game/DeadOverlay.jsx
import styled, { keyframes } from 'styled-components';

const DeadOverlay = ({ playerName }) => {
  return (
    <OverlayContainer>
      <Content>
        <SkullIcon>💀</SkullIcon>
        <DeadText>사망</DeadText>
        <PlayerName>{playerName}</PlayerName>
        <DeadMessage>킬러에게 살해당했습니다.</DeadMessage>
        <SpectatorMessage>관전 모드로 전환됩니다.</SpectatorMessage>
      </Content>
    </OverlayContainer>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Content = styled.div`
  text-align: center;
  color: white;
`;

const SkullIcon = styled.div`
  font-size: 4rem;
`;

const DeadText = styled.div`
  font-size: 3rem;
  margin-top: 10px;
`;

const PlayerName = styled.div`
  font-size: 2rem;
  margin-top: 10px;
`;

const DeadMessage = styled.div`
  font-size: 1.5rem;
  margin-top: 10px;
`;

const SpectatorMessage = styled.div`
  font-size: 1rem;
  margin-top: 10px;
  color: #ccc;
`;

export default DeadOverlay;