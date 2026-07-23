import { describe, expect, it } from "vitest";

import {
  MAZE_COLS,
  MAZE_MAP,
  MAZE_ROWS,
  findTiles,
  isWalkable,
  tileAt,
  wrapCol,
} from "./maze";

describe("迷路マップの整合性", () => {
  it("すべての行が同じ幅である", () => {
    for (const row of MAZE_MAP) {
      expect(row).toHaveLength(MAZE_COLS);
    }
  });

  it("定義済みの文字だけで構成されている", () => {
    for (let row = 0; row < MAZE_ROWS; row++) {
      for (let col = 0; col < MAZE_COLS; col++) {
        expect(() => tileAt(col, row)).not.toThrow();
      }
    }
  });

  it("上端と下端の行はすべて壁である", () => {
    for (let col = 0; col < MAZE_COLS; col++) {
      expect(tileAt(col, 0)).toBe("wall");
      expect(tileAt(col, MAZE_ROWS - 1)).toBe("wall");
    }
  });

  it("プレイヤーの初期位置が 1 箇所ある", () => {
    expect(findTiles("playerSpawn")).toHaveLength(1);
  });

  it("ゴーストの初期位置が 3 箇所ある", () => {
    expect(findTiles("ghostHome")).toHaveLength(3);
  });

  it("ゴーストの巣の扉が 1 箇所ある", () => {
    expect(findTiles("door")).toHaveLength(1);
  });

  it("パワーエサが 4 箇所ある", () => {
    expect(findTiles("power")).toHaveLength(4);
  });
});

describe("通行判定", () => {
  it("壁は通行できない", () => {
    expect(isWalkable(0, 0)).toBe(false);
  });

  it("ドットのタイルは通行できる", () => {
    expect(isWalkable(1, 1)).toBe(true);
  });

  it("ゴーストの巣の扉は通行できない", () => {
    const [door] = findTiles("door");
    expect(isWalkable(door.col, door.row)).toBe(false);
  });

  it("迷路の外(上下)は壁として扱う", () => {
    expect(tileAt(1, -1)).toBe("wall");
    expect(tileAt(1, MAZE_ROWS)).toBe("wall");
  });
});

describe("トンネルの列ラップ", () => {
  it("範囲外の列を反対側に折り返す", () => {
    expect(wrapCol(-1)).toBe(MAZE_COLS - 1);
    expect(wrapCol(MAZE_COLS)).toBe(0);
  });

  it("トンネル行では左端の外が右端につながる", () => {
    const tunnelRow = 9;
    expect(tileAt(-1, tunnelRow)).toBe(tileAt(MAZE_COLS - 1, tunnelRow));
    expect(isWalkable(-1, tunnelRow)).toBe(true);
  });
});
