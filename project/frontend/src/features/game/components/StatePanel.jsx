import { useGame } from '../../../contexts/GameContext';
import styled from 'styled-components';
// assets/images/object 폴더에서 도토리 이미지 import
import acornImage from '../../../assets/images/object/arcon.png'
import energyImage from'../../../assets/images/object/energy.png'

const StatePanel = () => {
  const { gameState } = useGame();
  const MAX_ACORNS = 10;

  return (
    <StatePanelContainer>
      {gameState.evilSquirrel === false && (
        <>
          <StateItem>
            <StateLabel>총 도토리:</StateLabel>
            <AcornBarContainer>
              <AcornProgressBar 
                $progress={(gameState.totalAcorns / MAX_ACORNS) * 100}
              />
              <AcornCount></AcornCount>
            </AcornBarContainer>
          </StateItem>
          <StateItem>
            <StateLabel>보유 도토리:</StateLabel>
            <AcornPointBar>
              {[...Array(3)].map((_, index) => (
                <AcornPoint 
                  key={index}
                  $isFilled={index < gameState.heldAcorns}
                  $acornImage={acornImage}
                />
              ))}
            </AcornPointBar>
          </StateItem>
        </>
      )}
      <StateItem>
        <StateLabel>피로도:</StateLabel>
        <FatigueBar>
          {[...Array(3)].map((_, index) => (
            <FatiguePoint 
              key={index}
              $isFilled={index < gameState.fatigue}
              $evilSquirrel={gameState.evilSquirrel}
            />
          ))}
        </FatigueBar>
      </StateItem>
      {gameState.evilSquirrel === true && gameState.fatigue >= 3 && (
        <KillModeText>킬 모드 활성화!</KillModeText>
      )}
    </StatePanelContainer>
  );
};

const StatePanelContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  min-width: 250px;
  color: white;
  font-family: 'JejuHallasan';
`;

const StateItem = styled.div`
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StateLabel = styled.span`
  font-size: 1rem;
  margin-right: 10px;
`;

const AcornBarContainer = styled.div`
  position: relative;
  width: 120px;
  height: 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

const AcornProgressBar = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: #90EE90;
  border-radius: 10px;
  transition: width 0.3s ease;
`;

const AcornCount = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 0.9rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const FatigueBar = styled.div`
  display: flex;
  gap: 5px;
`;

const FatiguePoint = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.$isFilled ? 
    `url(${energyImage})` : 
    'rgba(255, 255, 255, 0)'};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.3s;
  opacity: ${props => props.$isFilled ? 1 : 0.3};
  filter: ${props => props.$evilSquirrel ? 'hue-rotate(300deg)' : 'none'}; // 나쁜 다람쥐일 때 빨간색으로 변경
`;

const KillModeText = styled.div`
  color: #FF4444;
  font-size: 1.2rem;
  text-align: center;
  margin-top: 10px;
  animation: blink 1s infinite;

  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
const AcornPointBar = styled.div`
  display: flex;
  gap: 5px;
`;

const AcornPoint = styled.div`
  width: 20px;
  height: 20px;
  background: ${props => props.$isFilled ? 
    `url(${props.$acornImage})` : 
    'rgba(255, 255, 255, 0)'};
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  transition: opacity 0.3s;
  opacity: ${props => props.$isFilled ? 1 : 0.3};
`;
export default StatePanel;