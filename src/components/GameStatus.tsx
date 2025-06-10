import React, { useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { useGame } from '../context/GameContext';

const slideIn = keyframes`
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const StatusContainer = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin: 20px 0;
  animation: ${slideIn} 0.3s ease-out;
  text-align: center;
  
  ${({ $type }) => {
    switch ($type) {
      case 'success':
        return `
          background-color: #E8F5E9;
          color: #2E7D32;
          border: 1px solid #A5D6A7;
        `;
      case 'error':
        return `
          background-color: #FFEBEE;
          color: #C62828;
          border: 1px solid #FFCDD2;
        `;
      case 'info':
      default:
        return `
          background-color: #E3F2FD;
          color: #1565C0;
          border: 1px solid #90CAF9;
        `;
    }
  }}
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
`;

const Button = styled.button<{ $variant: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $variant }) => 
    $variant === 'primary'
      ? `
        background-color: #A2D2FF;
        color: #333333;
        &:hover {
          background-color: #91c1ee;
        }
      `
      : `
        background-color: #E2E2E2;
        color: #333333;
        &:hover {
          background-color: #d1d1d1;
        }
      `
  }
`;

const GameStatus: React.FC = () => {
  const { state, dispatch } = useGame();

  const handleRetry = useCallback(() => {
    dispatch({ type: 'RETRY' });
  }, [dispatch]);

  const handleNewGame = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, [dispatch]);

  if (!state.message && !state.isGameOver) {
    return null;
  }

  let type: 'success' | 'error' | 'info' = 'info';
  if (state.isGameOver) {
    type = state.isSuccess ? 'success' : 'error';
  }

  return (
    <StatusContainer $type={type}>
      {state.message || (state.isGameOver && !state.isSuccess && '게임 오버!')}
      {state.isGameOver && (
        <ButtonContainer>
          <Button $variant="primary" onClick={handleRetry}>
            다시하기
          </Button>
          <Button $variant="secondary" onClick={handleNewGame}>
            새 게임
          </Button>
        </ButtonContainer>
      )}
    </StatusContainer>
  );
};

export default GameStatus; 