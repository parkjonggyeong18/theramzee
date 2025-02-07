// components/game/DeadOverlay.jsx
import styled, { keyframes } from 'styled-components';
import { Z_INDEX } from '../../constants/zIndex';

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
 background: rgba(0, 0, 0, 0.8);
 display: flex;
 justify-content: center;
 align-items: center;
 z-index: ${Z_INDEX.OVERLAY};  // z-index 추가
`;

const Content = styled.div`
 display: flex;
 flex-direction: column;
 align-items: center;
 animation: ${fadeIn} 0.5s ease-out forwards;
`;

const SkullIcon = styled.div`
 font-size: 3rem;
 margin-bottom: 10px;
`;

const DeadText = styled.div`
 color: #FF0000;
 font-size: 2rem;
 font-family: 'JejuHallasan';
 margin-bottom: 5px;
 text-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
`;

const PlayerName = styled.div`
 color: white;
 font-size: 1.5rem;
 font-family: 'JejuHallasan';
 margin-bottom: 10px;
`;

const DeadMessage = styled.div`
 color: #FF6666;
 font-size: 1.2rem;
 font-family: 'JejuHallasan';
 margin-bottom: 5px;
`;

const SpectatorMessage = styled.div`
 color: #90EE90;
 font-size: 1rem;
 font-family: 'JejuHallasan';
 opacity: 0.8;
`;

export default DeadOverlay;