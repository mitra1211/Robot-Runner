export enum Direction {
  North = 0,
  East = 1,
  South = 2,
  West = 3,
}

export type Point = {
  x: number;
  y: number;
};

export interface RobotState {
  position: Point;
  direction: Direction;
  crashed: boolean;
  finished: boolean;
  logs: string[];
}

export enum CellType {
  Empty = 0,
  Wall = 1,
  Start = 2,
  Goal = 3,
}

export type Grid = CellType[][];

export interface Level {
  id: string;
  name: string;
  grid: Grid;
  description: string;
}

// Interpreter Types
export enum TokenType {
  Keyword = 'KEYWORD',
  Identifier = 'IDENTIFIER',
  LBrace = 'LBRACE',
  RBrace = 'RBRACE',
  LParen = 'LPAREN',
  RParen = 'RPAREN',
  Semicolon = 'SEMICOLON',
  EOF = 'EOF',
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
}

export interface InterpreterResult {
  success: boolean;
  error?: string;
  steps?: RobotState[]; // Snapshot of state at each step
}
