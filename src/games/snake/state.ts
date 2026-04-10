export const GRID_SIZE = 20;
export const INITIAL_LENGTH = 3;
export const BASE_TICK_MS = 160;
export const MIN_TICK_MS = 60;

export type Dir = 'up' | 'down' | 'left' | 'right';
export type Cell = { x: number; y: number };
export type Status = 'idle' | 'playing' | 'paused' | 'gameover';

export type State = {
  snake: Cell[]; // head at index 0
  dir: Dir;
  nextDir: Dir;
  food: Cell;
  score: number;
  status: Status;
};

export type Action =
  | { type: 'tick' }
  | { type: 'turn'; dir: Dir }
  | { type: 'start' }
  | { type: 'pause' }
  | { type: 'resume' }
  | { type: 'reset' };

const DIR_DELTAS: Record<Dir, Cell> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const OPPOSITE: Record<Dir, Dir> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function eq(a: Cell, b: Cell) {
  return a.x === b.x && a.y === b.y;
}

function cellOnSnake(cell: Cell, snake: Cell[]) {
  return snake.some((s) => eq(s, cell));
}

function randomEmptyCell(snake: Cell[], rng: () => number = Math.random): Cell {
  // Small grid — rejection sampling is fine.
  while (true) {
    const c = {
      x: Math.floor(rng() * GRID_SIZE),
      y: Math.floor(rng() * GRID_SIZE),
    };
    if (!cellOnSnake(c, snake)) return c;
  }
}

export function initialState(): State {
  const midY = Math.floor(GRID_SIZE / 2);
  const startX = Math.floor(GRID_SIZE / 2);
  const snake: Cell[] = [];
  for (let i = 0; i < INITIAL_LENGTH; i++) {
    snake.push({ x: startX - i, y: midY });
  }
  return {
    snake,
    dir: 'right',
    nextDir: 'right',
    food: randomEmptyCell(snake),
    score: 0,
    status: 'idle',
  };
}

export function tickMsForScore(score: number): number {
  const level = Math.floor(score / 5);
  return Math.max(MIN_TICK_MS, BASE_TICK_MS - level * 10);
}

export function levelForScore(score: number): number {
  return Math.floor(score / 5) + 1;
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start': {
      if (state.status === 'idle' || state.status === 'gameover') {
        const fresh = initialState();
        return { ...fresh, status: 'playing' };
      }
      return state;
    }

    case 'turn': {
      // Can't reverse into yourself. Buffer only if different from the
      // current direction to avoid wasted work.
      if (action.dir === OPPOSITE[state.dir]) return state;
      if (action.dir === state.dir) return state;
      return { ...state, nextDir: action.dir };
    }

    case 'pause': {
      if (state.status !== 'playing') return state;
      return { ...state, status: 'paused' };
    }

    case 'resume': {
      if (state.status !== 'paused') return state;
      return { ...state, status: 'playing' };
    }

    case 'reset':
      return initialState();

    case 'tick': {
      if (state.status !== 'playing') return state;

      const dir = state.nextDir;
      const delta = DIR_DELTAS[dir];
      const head = state.snake[0];
      const newHead: Cell = { x: head.x + delta.x, y: head.y + delta.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        return { ...state, status: 'gameover' };
      }

      const ate = eq(newHead, state.food);

      // Self collision. When not eating, the tail moves out of the way on
      // the same tick, so colliding with the current tail is fine.
      const bodyToCheck = ate ? state.snake : state.snake.slice(0, -1);
      if (cellOnSnake(newHead, bodyToCheck)) {
        return { ...state, status: 'gameover' };
      }

      const newSnake = [newHead, ...(ate ? state.snake : state.snake.slice(0, -1))];
      const score = ate ? state.score + 1 : state.score;
      const food = ate ? randomEmptyCell(newSnake) : state.food;

      return { ...state, snake: newSnake, dir, food, score };
    }

    default:
      return state;
  }
}
