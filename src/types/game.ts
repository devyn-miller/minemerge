export type Theme = {
  name: string;
  background: string;
  gridBackground: string;
  tileColors: Record<number, { background: string; text: string }>;
  isCustom?: boolean;
};

export type Position = {
  row: number;
  col: number;
};

export type Tile = {
  id: string;
  value: number;
  position: Position;
  mergedFrom?: Tile[];
};

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface GameConfig {
  gridSize: number;
  winningTile: number;
  theme: 'mountainCaverns' | 'junglewood' | 'mobsMines' | 'sunsetSanctuary';
}