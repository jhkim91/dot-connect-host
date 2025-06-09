import React from 'react';

export const BOARD_SIZE = 6;
export const TRAP_COUNT = 2;

export type Point = {
  x: number;
  y: number;
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export type CellType = {
  type: 'normal' | 'start' | 'end' | 'trap';
  visited: boolean;
  position: Point;
  isHint?: boolean;
};

export type GameBoard = CellType[][];

export interface CellProps {
  cell: CellType;
  onClick: () => void;
}

export type GameState = {
  board: GameBoard;
  path: Point[];
  hintCount: number;
  isGameOver: boolean;
  isSuccess: boolean;
  message: string;
};

export type GameAction =
  | { type: 'VISIT_CELL'; position: Point }
  | { type: 'UNDO' }
  | { type: 'RESET' }
  | { type: 'RETRY' }
  | { type: 'SHOW_HINT' }
  | { type: 'SET_MESSAGE'; message: string }
  | { type: 'SET_GAME_OVER'; isSuccess: boolean };

export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}; 