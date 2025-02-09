// components/game/common/GameLayout.jsx
import styled from 'styled-components';
import { Z_INDEX } from '../../../constants/zIndex';

const GameLayout = ({
  // 기본 구성요소
  leftVideoGrid,
  rightVideoGrid,
  gameTimer,
  statePanel,
  buttonContainer,
  myVideo,
  miniMap,
  
  // 게임 상태
  isGameStarted,
  background,
  
  // 숲별 특수 기능
  mainForestButtons,    // 메인 숲 버튼
  missionButtons,       // 미션 숲 버튼
  miniGameOverlay,      // 미니게임 오버레이
  voteScreen,          // 투표 화면
}) => {
  return (
    <LayoutContainer>
      <BackgroundImage $background={background} />
      
      <TopSection>
        <LeftVideoGridArea>
          {leftVideoGrid}
        </LeftVideoGridArea>
        
        <GameTimerArea>
          {gameTimer}
        </GameTimerArea>
        
        <RightVideoGridArea>
          {rightVideoGrid}
        </RightVideoGridArea>
        
        {isGameStarted ? (
          <StatePanelArea>
            {statePanel}
          </StatePanelArea>
        ) : (
          <ButtonContainerArea>
            {buttonContainer}
          </ButtonContainerArea>
        )}
      </TopSection>

      {/* 미션 버튼 영역 */}
      {isGameStarted && missionButtons && (
        <MissionSection>
          {missionButtons}
        </MissionSection>
      )}

      <BottomSection>
        <MyVideoArea>
          {myVideo}
        </MyVideoArea>
        
        {isGameStarted && mainForestButtons && (
          <MainForestButtonsArea>
            {mainForestButtons}
          </MainForestButtonsArea>
        )}
        
        <MiniMapArea>
          {miniMap}
        </MiniMapArea>
      </BottomSection>

      {/* 오버레이 영역 */}
      {miniGameOverlay}
      {voteScreen}
    </LayoutContainer>
  );
};

const LayoutContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: ${props => `url(${props.$background})`};
  background-size: cover;
  background-position: center;
  z-index: ${Z_INDEX.BACKGROUND};
`;

const TopSection = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  z-index: ${Z_INDEX.MAIN_CONTENT};
`;

const LeftVideoGridArea = styled.div`
  flex: 3;
  margin-right: 20px;
`;

const GameTimerArea = styled.div`
  // position: absolute;
  top: 20px;
  left: 50%;
  // transform: translateX(-50%);
  margin-right: 20px;
`;

const RightVideoGridArea = styled.div`
  flex: 2;
  margin-right: 20px;
`;

const StatePanelArea = styled.div`
  flex: 1;
`;

const ButtonContainerArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
`;

const MissionSection = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: ${Z_INDEX.MISSION_BUTTONS};
`;

const BottomSection = styled.div`
  position: fixed;
  bottom: 20px;
  width: 100%;
  // padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: ${Z_INDEX.MAIN_CONTENT};
`;

const MyVideoArea = styled.div`
  margin-left: 20px;
  margin-right: auto;
`;

const MainForestButtonsArea = styled.div`
  // position: absolute;
  left: 50%;
  // transform: translateX(-50%);
`;

const MiniMapArea = styled.div`
  margin-left: auto;
  margin-right: 20px;
`;

export default GameLayout;