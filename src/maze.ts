export const TILE_SIZE = 24;

export const MAZE_MAP = [
  "###################",
  "#........#........#",
  "#o##.###.#.###.##o#",
  "#.................#",
  "#.##.#.#####.#.##.#",
  "#....#...#...#....#",
  "####.###.#.###.####",
  "####.#.......#.####",
  "####.#.##=##.#.####",
  " ....#.#GGG#.#.... ",
  "####.#.#####.#.####",
  "####.#.......#.####",
  "####.#.#####.#.####",
  "#........#........#",
  "#.##.###.#.###.##.#",
  "#o.#.....P.....#.o#",
  "##.#.#.#####.#.#.##",
  "#....#...#...#....#",
  "#.######.#.######.#",
  "#.................#",
  "###################",
];

export const MAZE_COLS = MAZE_MAP[0].length;
export const MAZE_ROWS = MAZE_MAP.length;

export type TileType =
  "wall" | "dot" | "power" | "path" | "door" | "ghostHome" | "playerSpawn";

const TILE_BY_CHAR = new Map<string, TileType>([
  ["#", "wall"],
  [".", "dot"],
  ["o", "power"],
  [" ", "path"],
  ["=", "door"],
  ["G", "ghostHome"],
  ["P", "playerSpawn"],
]);

export interface TilePosition {
  col: number;
  row: number;
}

export function wrapCol(col: number): number {
  return ((col % MAZE_COLS) + MAZE_COLS) % MAZE_COLS;
}

export function tileAt(col: number, row: number): TileType {
  if (row < 0 || row >= MAZE_ROWS) {
    return "wall";
  }
  const char = MAZE_MAP[row][wrapCol(col)];
  const type = TILE_BY_CHAR.get(char);
  if (type === undefined) {
    throw new Error(`Unknown tile character: ${char}`);
  }
  return type;
}

export function isWalkable(col: number, row: number): boolean {
  const type = tileAt(col, row);
  return type !== "wall" && type !== "door";
}

export function findTiles(type: TileType): TilePosition[] {
  const positions: TilePosition[] = [];
  for (let row = 0; row < MAZE_ROWS; row++) {
    for (let col = 0; col < MAZE_COLS; col++) {
      if (tileAt(col, row) === type) {
        positions.push({ col, row });
      }
    }
  }
  return positions;
}
