import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Cell from './Cell';
import { useGame } from '../context/GameContext';
import { Point } from '../types/game';

// 상수 정의
const LINE_THICKNESS = 3; // 선의 두께

const BoardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
`;

const Row = styled.div`
  display: flex;
  gap: 10px;
  position: relative;
  z-index: 1;
`;

const drawLine = keyframes`
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 0.8;
  }
`;

interface LinePoint {
  x: number;
  y: number;
}

const PathLine = styled.div<{
  $start: LinePoint;
  $end: LinePoint;
  $isLast?: boolean;
}>`
  position: absolute;
  background-color: #81D4FA;
  opacity: 0.8;
  transition: opacity 0.3s ease;
  box-shadow: 0 0 4px rgba(129, 212, 250, 0.5);
  z-index: 0;
  height: ${LINE_THICKNESS}px;
  transform-origin: left center;

  ${props => {
    const dx = props.$end.x - props.$start.x;
    const dy = props.$end.y - props.$start.y;
    const isHorizontal = Math.abs(dy) < Math.abs(dx);
    
    if (isHorizontal) {
      const width = Math.abs(dx);
      const left = Math.min(props.$start.x, props.$end.x);
      return css`
        width: ${width}px;
        left: ${left}px;
        top: ${props.$start.y}px;
        transform: translateY(-${LINE_THICKNESS / 2}px);
      `;
    } else {
      const height = Math.abs(dy);
      const top = Math.min(props.$start.y, props.$end.y);
      return css`
        width: ${LINE_THICKNESS}px;
        height: ${height}px;
        left: ${props.$start.x}px;
        top: ${top}px;
        transform: translateX(-${LINE_THICKNESS / 2}px);
      `;
    }
  }}

  ${props => props.$isLast && css`
    animation: ${drawLine} 0.3s ease-out forwards;
  `}

  &:hover {
    opacity: 1;
  }
`;

const Board: React.FC = () => {
  const { state, dispatch } = useGame();
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [pathPoints, setPathPoints] = useState<LinePoint[]>([]);
  const boardRef = useRef<HTMLDivElement>(null);

  const handleCellClick = useCallback((position: Point) => {
    // 메시지가 표시 중이면 클릭 무시
    if (state.message) {
      return;
    }
    dispatch({ type: 'VISIT_CELL', position });
  }, [dispatch, state.message]);

  // DOM 요소의 중심점 계산
  const calculateCenterPoint = useCallback((element: HTMLDivElement): LinePoint => {
    const rect = element.getBoundingClientRect();
    const boardRect = boardRef.current?.getBoundingClientRect();
    
    if (!boardRect) return { x: 0, y: 0 };

    return {
      x: rect.left - boardRect.left + rect.width / 2,
      y: rect.top - boardRect.top + rect.height / 2
    };
  }, []);

  // 경로 포인트 업데이트
  useEffect(() => {
    const points = state.path
      .map(point => {
        const key = `${point.x}-${point.y}`;
        const element = cellRefs.current.get(key);
        if (!element) return null;
        return calculateCenterPoint(element);
      })
      .filter((point): point is LinePoint => point !== null);

    setPathPoints(points);
  }, [state.path, calculateCenterPoint]);

  const pathLines = useMemo(() => {
    return pathPoints.map((point, index) => {
      if (index === pathPoints.length - 1) return null;
      const nextPoint = pathPoints[index + 1];
      
      return (
        <PathLine
          key={`path-${index}`}
          $start={point}
          $end={nextPoint}
          $isLast={index === pathPoints.length - 2}
        />
      );
    });
  }, [pathPoints]);

  return (
    <BoardContainer ref={boardRef}>
      {pathLines}
      {state.board.map((row, x) => (
        <Row key={x}>
          {row.map((cell, y) => (
            <Cell
              key={`${x}-${y}`}
              ref={element => {
                if (element) {
                  cellRefs.current.set(`${x}-${y}`, element);
                }
              }}
              cell={cell}
              disabled={!!state.message}
              onClick={() => handleCellClick({ x, y })}
            />
          ))}
        </Row>
      ))}
    </BoardContainer>
  );
};

export default Board; 