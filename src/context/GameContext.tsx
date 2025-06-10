import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameAction, GameContextType } from '../types/game';
import { createBoard, checkReachability, findNextHint } from '../utils/gameLogic';

const initialState: GameState = {
  board: createBoard(),
  path: [],
  hintCount: 0,
  isGameOver: false,
  isSuccess: false,
  message: '',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'VISIT_CELL': {
      const { position } = action;
      const cell = state.board[position.x][position.y];

      // 이미 방문했거나 트랩인 경우 무시
      if (cell.visited || cell.type === 'trap') {
        return state;
      }

      // 마지막 방문 위치와 인접하지 않은 경우 무시
      const lastPosition = state.path[state.path.length - 1];
      if (lastPosition) {
        const dx = Math.abs(position.x - lastPosition.x);
        const dy = Math.abs(position.y - lastPosition.y);
        if (dx + dy !== 1) {
          return state;
        }
      }

      // 보드 업데이트
      const newBoard = state.board.map(row =>
        row.map(cell => ({
          ...cell,
          visited: cell.visited || (cell.position.x === position.x && cell.position.y === position.y),
          isHint: false,
        }))
      );

      // 경로 업데이트
      const newPath = [...state.path, position];

      // 도착점 도달 시 게임 종료 체크
      if (cell.type === 'end') {
        const unvisitedNormalCells = state.board.flat().filter(
          c => c.type === 'normal' && !c.visited
        );
        
        if (unvisitedNormalCells.length === 0) {
          return {
            ...state,
            board: newBoard,
            path: newPath,
            isGameOver: true,
            isSuccess: true,
            message: '축하합니다! 퍼즐을 성공적으로 해결했습니다!',
          };
        } else {
          return {
            ...state,
            board: newBoard,
            path: newPath,
            message: '모든 일반 점을 방문해야 합니다.',
          };
        }
      }

      // 도달 가능성 검사
      const endPoint = state.board.flat().find(cell => cell.type === 'end')?.position;
      if (endPoint) {
        const visited = new Set<string>();
        const canReachEnd = checkReachability(newBoard, position, endPoint, visited);
        if (!canReachEnd) {
          return {
            ...state,
            board: newBoard,
            path: newPath,
            isGameOver: true,
            isSuccess: false,
            message: '더 이상 도착점에 도달할 수 없습니다.',
          };
        }
      }

      return {
        ...state,
        board: newBoard,
        path: newPath,
        message: '',
      };
    }

    case 'UNDO': {
      if (state.path.length <= 1) {
        return state;
      }

      const newPath = state.path.slice(0, -1);
      const lastPosition = state.path[state.path.length - 1];
      
      const newBoard = state.board.map(row =>
        row.map(cell => ({
          ...cell,
          visited: cell.visited && !(cell.position.x === lastPosition.x && cell.position.y === lastPosition.y),
          isHint: false,
        }))
      );

      return {
        ...state,
        board: newBoard,
        path: newPath,
        message: '',
      };
    }

    case 'RETRY': {
      const startCell = state.board.flat().find(cell => cell.type === 'start');
      const updatedBoard = state.board.map(row =>
        row.map(cell => ({
          ...cell,
          visited: cell.type === 'start',
          isHint: false,
        }))
      );
      return {
        ...state,
        board: updatedBoard,
        path: startCell ? [startCell.position] : [],
        hintCount: 0,
        isGameOver: false,
        isSuccess: false,
        message: '',
      };
    }

    case 'RESET': {
      const newBoard = createBoard();
      const startCell = newBoard.flat().find(cell => cell.type === 'start');
      return {
        ...initialState,
        board: newBoard,
        path: startCell ? [startCell.position] : [],
      };
    }

    case 'SHOW_HINT': {
      const currentPosition = state.path[state.path.length - 1];
      if (!currentPosition) return state;

      // 현재 위치에서 도착점까지의 경로 찾기 (모든 남은 일반점 방문)
      const hintPosition = findNextHint(state.board, currentPosition);
      
      // 경로가 없거나 도달 불가능한 경우 힌트를 표시하지 않음
      if (!hintPosition) {
        return {
          ...state,
          message: '현재 상태에서 모든 일반점을 방문하여 도착점에 도달할 수 있는 경로가 없습니다.',
        };
      }

      const newBoard = state.board.map(row =>
        row.map(cell => ({
          ...cell,
          isHint: cell.position.x === hintPosition.x && cell.position.y === hintPosition.y,
        }))
      );

      return {
        ...state,
        board: newBoard,
        hintCount: state.hintCount + 1,
        message: '',
      };
    }

    case 'SET_MESSAGE': {
      return {
        ...state,
        message: action.message,
      };
    }

    case 'SET_GAME_OVER': {
      return {
        ...state,
        isGameOver: true,
        isSuccess: action.isSuccess,
      };
    }

    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 게임 최초 시작 시에만 시작점 자동 선택
  useEffect(() => {
    const startCell = state.board.flat().find(cell => cell.type === 'start');
    if (startCell && state.path.length === 0 && !startCell.visited) {
      dispatch({
        type: 'VISIT_CELL',
        position: startCell.position,
      });
    }
  }, [state.board, state.path.length, dispatch]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 