import { Grid, Level } from './types';

// 0 = Empty, 1 = Wall, 2 = Start, 3 = Goal

// Level 1: The Basics (Simple turn)
const LEVEL_1_GRID: Grid = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

// Level 2: Long Road (Teaches Loops)
const LEVEL_2_GRID: Grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Level 3: The Zig Zag (Repeated patterns)
const LEVEL_3_GRID: Grid = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 1, 0, 0, 1, 1],
  [1, 1, 0, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 0, 1, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

// Level 4: The Decisions (Teaches Conditionals)
const LEVEL_4_GRID: Grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 0, 1, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 0, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 0, 3, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Level 5: The Labyrinth (Complex)
const LEVEL_5_GRID: Grid = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 3, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const LEVELS: Level[] = [
  {
    id: 'lvl1',
    name: 'Level 1: First Steps',
    description: 'A simple path. Move forward and turn to reach the goal.',
    grid: LEVEL_1_GRID
  },
  {
    id: 'lvl2',
    name: 'Level 2: The Long Haul',
    description: 'That is a long way! Try using a "while" loop to check if the path is ahead.',
    grid: LEVEL_2_GRID
  },
  {
    id: 'lvl3',
    name: 'Level 3: Zig Zag',
    description: 'Left, right, left, right. Can you automate this?',
    grid: LEVEL_3_GRID
  },
  {
    id: 'lvl4',
    name: 'Level 4: Smart Moves',
    description: 'Walls might appear anywhere. Use "if (wall_ahead)" to decide when to turn.',
    grid: LEVEL_4_GRID
  },
  {
    id: 'lvl5',
    name: 'Level 5: The Maze',
    description: 'Put it all together to escape the labyrinth.',
    grid: LEVEL_5_GRID
  }
];
