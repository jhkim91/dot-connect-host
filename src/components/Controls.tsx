import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  align-items: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'warning' }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return `
          background-color: #2196F3;
          color: white;
          &:hover {
            background-color: #1976D2;
          }
        `;
      case 'secondary':
        return `
          background-color: #9E9E9E;
          color: white;
          &:hover {
            background-color: #757575;
          }
        `;
      case 'warning':
        return `
          background-color: #F44336;
          color: white;
          &:hover {
            background-color: #D32F2F;
          }
        `;
      default:
        return '';
    }
  }}

  &:disabled {
    background-color: #E0E0E0;
    color: #9E9E9E;
    cursor: not-allowed;
    &:hover {
      background-color: #E0E0E0;
    }
  }
`;

const HintCount = styled.div`
  font-size: 16px;
  color: #757575;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '💡';
  }
`;

const Controls: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleHint = useCallback(() => {
    dispatch({ type: 'SHOW_HINT' });
  }, [dispatch]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch({ type: 'RETRY' });
  }, [dispatch]);

  return (
    <ControlsContainer>
      <Button onClick={handleHint}>
        힌트 💡
      </Button>
      <Button $variant="secondary" onClick={handleUndo}>
        되돌리기 ↩️
      </Button>
      <Button $variant="warning" onClick={handleNewGame}>
        새 게임 🔄
      </Button>
      <Button $variant="secondary" onClick={handleRetry}>
        다시하기 🎮
      </Button>
      <HintCount>
        {state.hintCount}
      </HintCount>
    </ControlsContainer>
  );
};

export default Controls; 