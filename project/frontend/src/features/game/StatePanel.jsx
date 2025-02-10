import React from 'react';
import styled from 'styled-components';
import { useGame } from '../../contexts/GameContext';

const StatePanel = () => {
  const { gameState } = useGame();

  return (
    <PanelContainer>
      <StatusItem>
        <Label>Role:</Label>
        <Value>{gameState.role || 'Unknown'}</Value>
      </StatusItem>
      <StatusItem>
        <Label>Total Acorns:</Label>
        <Value>{gameState.totalAcorns}</Value>
      </StatusItem>
      <StatusItem>
        <Label>Held Acorns:</Label>
        <Value>{gameState.heldAcorns}</Value>
      </StatusItem>
      <StatusItem>
        <Label>Fatigue:</Label>
        <Value>{gameState.fatigue}%</Value>
      </StatusItem>
    </PanelContainer>
  );
};

const PanelContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 10px;
  min-width: 200px;
`;

const StatusItem = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  color: #90EE90;
  font-weight: bold;
`;

const Value = styled.span`
  color: white;
`;

export default StatePanel;