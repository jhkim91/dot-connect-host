import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useGame } from '../context/GameContext';

const ControlsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin: 20px 0;
  align-items: center;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'warning' | 'success' }>`
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
          background-color: #A2D2FF;
          color: #333333;
          &:hover {
            background-color: #91c1ee;
          }
        `;
      case 'secondary':
        return `
          background-color: #E2E2E2;
          color: #333333;
          &:hover {
            background-color: #d1d1d1;
          }
        `;
      case 'warning':
        return `
          background-color: #FFB5B5;
          color: #333333;
          &:hover {
            background-color: #eea4a4;
          }
        `;
      case 'success':
        return `
          background-color: #B5EAD7;
          color: #333333;
          &:hover {
            background-color: #a4d9c6;
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
        힌트
      </Button>
      <Button $variant="secondary" onClick={handleUndo}>
        되돌리기
      </Button>
      <Button $variant="warning" onClick={handleNewGame}>
        새 게임
      </Button>
      <Button $variant="success" onClick={handleRetry}>
        다시하기
      </Button>
      <HintCount>
        {state.hintCount}
      </HintCount>
    </ControlsContainer>
  );
};

export default Controls; 