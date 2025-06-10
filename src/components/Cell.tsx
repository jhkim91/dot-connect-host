import React, { forwardRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { CellType, CellProps } from '../types/game';

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const CellContainer = styled.div<{
  $cellType: CellType['type'];
  $visited: boolean;
  $isHint: boolean;
}>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;

  ${({ $cellType, $visited }) => {
    switch ($cellType) {
      case 'start':
        return css`
          background-color: #A8E6CF;
          border: 2px solid #97d4be;
        `;
      case 'end':
        return css`
          background-color: #FF8B94;
          border: 2px solid #ed7a83;
        `;
      case 'trap':
        return css`
          background-color: #B0BEC5;
          border: 2px solid #9eb1b9;
          cursor: not-allowed;
          opacity: 0.7;
        `;
      default:
        return css`
          background-color: ${$visited ? '#81D4FA' : '#ffffff'};
          border: 2px solid ${$visited ? '#6ec3e9' : '#e0e0e0'};
          &:hover {
            transform: ${!$visited ? 'scale(1.1)' : 'none'};
          }
        `;
    }
  }}

  ${({ $isHint }) =>
    $isHint &&
    css`
      animation: ${pulse} 1s infinite;
      border: 3px solid #81D4FA;
    `}

  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Cell = React.memo(forwardRef<HTMLDivElement, CellProps>((props, ref) => {
  const { cell, onClick } = props;
  
  return (
    <CellContainer
      ref={ref}
      $cellType={cell.type}
      $visited={cell.visited}
      $isHint={cell.isHint || false}
      onClick={onClick}
    />
  );
}));

Cell.displayName = 'Cell';

export default Cell; 