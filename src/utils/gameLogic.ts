import { Point, GameBoard, Direction } from '../types/game';

const BOARD_SIZE = 6;
const TRAP_COUNT = 2;

// 상하좌우 이동을 위한 방향 배열
const DIRECTIONS: { [key in Direction]: Point } = {
  up: { x: -1, y: 0 },
  down: { x: 1, y: 0 },
  left: { x: 0, y: -1 },
  right: { x: 0, y: 1 },
};

// 주어진 위치가 게임판 내에 있는지 확인
export const isValidPosition = (position: Point): boolean => {
  return position.x >= 0 && position.x < BOARD_SIZE && 
         position.y >= 0 && position.y < BOARD_SIZE;
};

// 두 점이 인접해있는지 확인
export const isAdjacent = (p1: Point, p2: Point): boolean => {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y) === 1;
};

// DFS를 사용하여 정답 경로 생성
export const generateSolutionPath = (start: Point): Point[] => {
  const visited = Array(BOARD_SIZE).fill(false)
    .map(() => Array(BOARD_SIZE).fill(false));
  const path: Point[] = [];
  
  const dfs = (current: Point): boolean => {
    visited[current.x][current.y] = true;
    path.push(current);

    if (path.length === BOARD_SIZE * BOARD_SIZE - TRAP_COUNT) {
      return true;
    }

    // 방향을 무작위로 섞어서 다양한 경로 생성
    const directions = Object.values(DIRECTIONS);
    for (let i = directions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    for (const dir of directions) {
      const next: Point = {
        x: current.x + dir.x,
        y: current.y + dir.y,
      };

      if (isValidPosition(next) && !visited[next.x][next.y]) {
        if (dfs(next)) {
          return true;
        }
      }
    }

    visited[current.x][current.y] = false;
    path.pop();
    return false;
  };

  dfs(start);
  return path;
};

// 트랩 위치 선정
export const selectTrapPositions = (path: Point[]): Point[] => {
  const pathSet = new Set(path.map(p => `${p.x},${p.y}`));
  const candidates: Point[] = [];

  // 경로 주변의 점들을 후보로 추가
  for (let x = 0; x < BOARD_SIZE; x++) {
    for (let y = 0; y < BOARD_SIZE; y++) {
      const point = { x, y };
      const key = `${x},${y}`;
      if (!pathSet.has(key)) {
        // 경로와 인접한 점에 가중치 부여
        const isNearPath = path.some(p => isAdjacent(p, point));
        if (isNearPath) {
          candidates.push(point);
          candidates.push(point); // 가중치를 위해 두 번 추가
        } else {
          candidates.push(point);
        }
      }
    }
  }

  const traps: Point[] = [];
  for (let i = 0; i < TRAP_COUNT; i++) {
    if (candidates.length === 0) break;
    const index = Math.floor(Math.random() * candidates.length);
    traps.push(candidates[index]);
    // 선택된 트랩과 같은 위치의 모든 후보 제거
    const key = `${candidates[index].x},${candidates[index].y}`;
    candidates.splice(0, candidates.length, ...candidates.filter(
      p => `${p.x},${p.y}` !== key
    ));
  }

  return traps;
};

// 새로운 게임 보드 생성
export const createBoard = (): GameBoard => {
  // 시작점 무작위 선택
  const start: Point = {
    x: Math.floor(Math.random() * BOARD_SIZE),
    y: Math.floor(Math.random() * BOARD_SIZE),
  };

  // 정답 경로 생성
  const path = generateSolutionPath(start);
  if (!path.length) throw new Error("Failed to generate solution path");

  // 트랩 위치 선정
  const traps = selectTrapPositions(path);

  // 보드 초기화
  const board: GameBoard = Array(BOARD_SIZE).fill(null)
    .map((_, x) => Array(BOARD_SIZE).fill(null)
      .map((_, y) => ({
        type: 'normal',
        visited: false,
        position: { x, y },
        isHint: false,
      })));

  // 시작점, 도착점, 트랩 설정
  board[start.x][start.y].type = 'start';
  board[start.x][start.y].visited = false;
  
  const end = path[path.length - 1];
  board[end.x][end.y].type = 'end';

  traps.forEach(trap => {
    board[trap.x][trap.y].type = 'trap';
  });

  return board;
};

// 도달 가능성 검사
export const checkReachability = (
  board: GameBoard,
  current: Point,
  target: Point,
  visited: Set<string>
): boolean => {
  if (current.x === target.x && current.y === target.y) {
    return true;
  }

  visited.add(`${current.x},${current.y}`);

  for (const dir of Object.values(DIRECTIONS)) {
    const next: Point = {
      x: current.x + dir.x,
      y: current.y + dir.y,
    };

    if (
      isValidPosition(next) &&
      !visited.has(`${next.x},${next.y}`) &&
      board[next.x][next.y].type !== 'trap' &&
      !board[next.x][next.y].visited
    ) {
      if (checkReachability(board, next, target, visited)) {
        return true;
      }
    }
  }

  return false;
};

// 현재 위치에서 도착점까지의 경로 찾기 (모든 남은 일반점 방문)
export const findPathToEnd = (
  board: GameBoard,
  currentPosition: Point
): Point[] => {
  const endPoint = board.flat().find(cell => cell.type === 'end')?.position;
  if (!endPoint) return [];

  // 방문해야 할 남은 일반점들
  const remainingNormalPoints = board.flat().filter(
    cell => cell.type === 'normal' && !cell.visited
  ).map(cell => cell.position);

  const visited = new Set<string>();
  const path: Point[] = [];

  const dfs = (current: Point, remaining: Point[]): boolean => {
    const key = `${current.x},${current.y}`;
    if (visited.has(key)) return false;

    visited.add(key);
      path.push(current);

    // 모든 일반점을 방문했고 현재 위치가 도착점인 경우
    if (remaining.length === 0 && current.x === endPoint.x && current.y === endPoint.y) {
      return true;
    }

    // 현재 위치가 남은 일반점 중 하나인 경우, 해당 점을 remaining에서 제거
    const remainingWithoutCurrent = remaining.filter(
      p => !(p.x === current.x && p.y === current.y)
    );

    for (const dir of Object.values(DIRECTIONS)) {
      const next: Point = {
        x: current.x + dir.x,
        y: current.y + dir.y,
      };

      if (
        isValidPosition(next) &&
        !visited.has(`${next.x},${next.y}`) &&
        board[next.x][next.y].type !== 'trap' &&
        !board[next.x][next.y].visited
      ) {
        if (dfs(next, remainingWithoutCurrent)) {
          return true;
        }
      }
    }

    visited.delete(key);
    path.pop();
    return false;
  };

  dfs(currentPosition, remainingNormalPoints);
  return path;
};

// 다음 힌트 찾기
export const findNextHint = (
  board: GameBoard,
  currentPosition: Point
): Point | null => {
  const path = findPathToEnd(board, currentPosition);
  
  // 경로가 없거나 현재 위치만 있는 경우
  if (path.length <= 1) {
    return null;
  }

  // 현재 위치 다음의 점을 힌트로 반환
  return path[1];
}; 