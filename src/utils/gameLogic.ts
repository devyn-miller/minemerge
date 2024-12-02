import { Direction, Position, Tile, GameConfig } from '../types/game';

export function createInitialGrid(size: number): Tile[][] {
  const grid: Tile[][] = Array(size).fill(null).map(() => Array(size).fill(null));
  return addRandomTile(addRandomTile(grid));
}

export function addRandomTile(grid: Tile[][]): Tile[][] {
  const availablePositions = getAvailablePositions(grid);
  if (availablePositions.length === 0) return grid;

  const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  
  const newGrid = [...grid];
  newGrid[randomPosition.row][randomPosition.col] = {
    id: `${Date.now()}-${Math.random()}`,
    value,
    position: randomPosition,
  };
  
  return newGrid;
}

function getAvailablePositions(grid: Tile[][]): Position[] {
  const positions: Position[] = [];
  grid.forEach((row, rowIndex) => {
    row.forEach((tile, colIndex) => {
      if (!tile) {
        positions.push({ row: rowIndex, col: colIndex });
      }
    });
  });
  return positions;
}

export function move(grid: Tile[][], direction: Direction): { grid: Tile[][], moved: boolean, score: number } {
  let score = 0;
  let moved = false;
  const size = grid.length;
  const newGrid = [...grid.map(row => [...row])];
  const vectors = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 }
  };
  
  const vector = vectors[direction];
  const traversals = buildTraversals(vector, size);
  
  traversals.row.forEach(row => {
    traversals.col.forEach(col => {
      const tile = grid[row][col];
      if (tile) {
        const { newPosition, merged } = findFarthestPosition(newGrid, { row, col }, vector, size);
        
        if (merged) {
          const mergedTile = {
            ...tile,
            value: tile.value * 2,
            position: newPosition,
            mergedFrom: [tile, merged]
          };
          newGrid[newPosition.row][newPosition.col] = mergedTile;
          newGrid[row][col] = null;
          score += mergedTile.value;
          moved = true;
        } else if (newPosition.row !== row || newPosition.col !== col) {
          newGrid[newPosition.row][newPosition.col] = {
            ...tile,
            position: newPosition
          };
          newGrid[row][col] = null;
          moved = true;
        }
      }
    });
  });
  
  return { grid: newGrid, moved, score };
}

function buildTraversals(vector: { x: number; y: number }, size: number) {
  const traversals = { row: [] as number[], col: [] as number[] };
  
  for (let i = 0; i < size; i++) {
    traversals.row.push(i);
    traversals.col.push(i);
  }
  
  if (vector.x === 1) traversals.row.reverse();
  if (vector.y === 1) traversals.col.reverse();
  
  return traversals;
}

function findFarthestPosition(grid: Tile[][], position: Position, vector: { x: number; y: number }, size: number) {
  let previous: Position;
  let cell = { row: position.row + vector.x, col: position.col + vector.y };
  
  while (isWithinBounds(cell, size) && !grid[cell.row][cell.col]) {
    previous = cell;
    cell = { row: cell.row + vector.x, col: cell.col + vector.y };
  }
  
  if (isWithinBounds(cell, size) && grid[cell.row][cell.col]?.value === grid[position.row][position.col].value) {
    return { newPosition: cell, merged: grid[cell.row][cell.col] };
  }
  
  return { newPosition: previous || position, merged: null };
}

function isWithinBounds(position: Position, size: number): boolean {
  return position.row >= 0 && position.row < size && position.col >= 0 && position.col < size;
}

export function isGameOver(grid: Tile[][]): boolean {
  if (getAvailablePositions(grid).length > 0) return false;
  
  const size = grid.length;
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const tile = grid[row][col];
      if (tile) {
        const adjacent = [
          { row: row - 1, col },
          { row: row + 1, col },
          { row, col: col - 1 },
          { row, col: col + 1 }
        ];
        
        for (const pos of adjacent) {
          if (isWithinBounds(pos, size) && grid[pos.row][pos.col]?.value === tile.value) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

export function hasWon(grid: Tile[][], winningTile: number): boolean {
  return grid.some(row => row.some(tile => tile?.value === winningTile));
}