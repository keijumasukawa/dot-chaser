import "./style.css";

import { getLocale, t, type TranslationKey } from "./i18n";
import { MAZE_COLS, MAZE_ROWS, TILE_SIZE, tileAt } from "./maze";

type ThemeMode = "dark" | "light";

interface ThemeTokens {
  bg: string;
  tile: string;
  tileTop: string;
  edge: string;
  dim: string;
  mid: string;
  hi: string;
  max: string;
}

const WALL_INSET = 4;
const WALL_RADIUS = 6;
const WALL_BRIDGE_INSET = 6;
const WALL_BRIDGE_RADIUS = 4;
const WALL_EDGE_OFFSET = 4.5;
const WALL_EDGE_MARGIN = 7;
const DOT_RADIUS = 2.2;
const DOT_ALPHA = 0.55;
const POWER_PELLET_RADIUS = 5;
const POWER_PULSE_BASE_ALPHA = 0.55;
const POWER_PULSE_RANGE = 0.45;
const POWER_PULSE_SPEED = 0.0018;
const DOOR_BAR_INSET = 4;
const DOOR_BAR_HEIGHT = 4;
const DOOR_ALPHA = 0.7;

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (element === null) {
    throw new Error(`Element not found: ${selector}`);
  }
  return element;
}

const canvas = requireElement<HTMLCanvasElement>("#game");
canvas.width = MAZE_COLS * TILE_SIZE;
canvas.height = MAZE_ROWS * TILE_SIZE;

const renderingContext = canvas.getContext("2d");
if (renderingContext === null) {
  throw new Error("Canvas 2D context is not available");
}
const ctx = renderingContext;

const darkButton = requireElement<HTMLButtonElement>("#theme-dark");
const lightButton = requireElement<HTMLButtonElement>("#theme-light");

const TEXT_BINDINGS: ReadonlyArray<readonly [string, TranslationKey]> = [
  ["#app-title", "app.title"],
  ["#label-score", "hud.score"],
  ["#label-high", "hud.high"],
  ["#label-lives", "hud.lives"],
  ["#help-text", "controls.help"],
  ["#theme-dark", "theme.dark"],
  ["#theme-light", "theme.light"],
];

function applyTranslations(): void {
  document.title = t("app.title");
  document.documentElement.lang = getLocale();
  requireElement<HTMLElement>("#theme-toggle").setAttribute(
    "aria-label",
    t("theme.label"),
  );
  for (const [selector, key] of TEXT_BINDINGS) {
    requireElement<HTMLElement>(selector).textContent = t(key);
  }
}

let currentTheme: ThemeMode = "dark";
let tokens: ThemeTokens = {
  bg: "",
  tile: "",
  tileTop: "",
  edge: "",
  dim: "",
  mid: "",
  hi: "",
  max: "",
};

function readToken(name: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function readTokens(): ThemeTokens {
  return {
    bg: readToken("--bg"),
    tile: readToken("--tile"),
    tileTop: readToken("--tile-top"),
    edge: readToken("--edge"),
    dim: readToken("--t-dim"),
    mid: readToken("--t-mid"),
    hi: readToken("--t-hi"),
    max: readToken("--t-max"),
  };
}

function drawWall(col: number, row: number): void {
  const x = col * TILE_SIZE;
  const y = row * TILE_SIZE;
  const gradient = ctx.createLinearGradient(0, y, 0, y + TILE_SIZE);
  gradient.addColorStop(0, tokens.tileTop);
  gradient.addColorStop(1, tokens.tile);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(
    x + WALL_INSET,
    y + WALL_INSET,
    TILE_SIZE - WALL_INSET * 2,
    TILE_SIZE - WALL_INSET * 2,
    WALL_RADIUS,
  );
  ctx.fill();
  if (tileAt(col + 1, row) === "wall") {
    ctx.beginPath();
    ctx.roundRect(
      x + TILE_SIZE / 2,
      y + WALL_BRIDGE_INSET,
      TILE_SIZE,
      TILE_SIZE - WALL_BRIDGE_INSET * 2,
      WALL_BRIDGE_RADIUS,
    );
    ctx.fill();
  }
  if (tileAt(col, row + 1) === "wall") {
    ctx.beginPath();
    ctx.roundRect(
      x + WALL_BRIDGE_INSET,
      y + TILE_SIZE / 2,
      TILE_SIZE - WALL_BRIDGE_INSET * 2,
      TILE_SIZE,
      WALL_BRIDGE_RADIUS,
    );
    ctx.fill();
  }
  ctx.strokeStyle = tokens.edge;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const edgeY =
    currentTheme === "light"
      ? y + TILE_SIZE - WALL_EDGE_OFFSET
      : y + WALL_EDGE_OFFSET;
  ctx.moveTo(x + WALL_EDGE_MARGIN, edgeY);
  ctx.lineTo(x + TILE_SIZE - WALL_EDGE_MARGIN, edgeY);
  ctx.stroke();
}

function drawDot(col: number, row: number): void {
  const centerX = col * TILE_SIZE + TILE_SIZE / 2;
  const centerY = row * TILE_SIZE + TILE_SIZE / 2;
  ctx.globalAlpha = DOT_ALPHA;
  ctx.fillStyle = tokens.mid;
  ctx.beginPath();
  ctx.arc(centerX, centerY, DOT_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawPowerPellet(col: number, row: number, elapsedMs: number): void {
  const centerX = col * TILE_SIZE + TILE_SIZE / 2;
  const centerY = row * TILE_SIZE + TILE_SIZE / 2;
  const pulse = Math.abs(Math.sin(elapsedMs * POWER_PULSE_SPEED));
  ctx.globalAlpha = POWER_PULSE_BASE_ALPHA + pulse * POWER_PULSE_RANGE;
  ctx.fillStyle = tokens.hi;
  ctx.beginPath();
  ctx.arc(centerX, centerY, POWER_PELLET_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawDoor(col: number, row: number): void {
  const x = col * TILE_SIZE;
  const centerY = row * TILE_SIZE + TILE_SIZE / 2;
  ctx.globalAlpha = DOOR_ALPHA;
  ctx.fillStyle = tokens.dim;
  ctx.fillRect(
    x + DOOR_BAR_INSET,
    centerY - DOOR_BAR_HEIGHT / 2,
    TILE_SIZE - DOOR_BAR_INSET * 2,
    DOOR_BAR_HEIGHT,
  );
  ctx.globalAlpha = 1;
}

function drawMaze(elapsedMs: number): void {
  ctx.fillStyle = tokens.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let row = 0; row < MAZE_ROWS; row++) {
    for (let col = 0; col < MAZE_COLS; col++) {
      switch (tileAt(col, row)) {
        case "wall":
          drawWall(col, row);
          break;
        case "dot":
          drawDot(col, row);
          break;
        case "power":
          drawPowerPellet(col, row, elapsedMs);
          break;
        case "door":
          drawDoor(col, row);
          break;
        case "path":
        case "ghostHome":
        case "playerSpawn":
          break;
      }
    }
  }
}

const prefersReducedMotion = matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

function applyTheme(mode: ThemeMode): void {
  currentTheme = mode;
  document.documentElement.dataset.theme = mode;
  tokens = readTokens();
  darkButton.classList.toggle("active", mode === "dark");
  lightButton.classList.toggle("active", mode === "light");
  if (prefersReducedMotion) {
    drawMaze(0);
  }
}

darkButton.addEventListener("click", () => applyTheme("dark"));
lightButton.addEventListener("click", () => applyTheme("light"));

applyTranslations();
applyTheme(
  matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark",
);

if (prefersReducedMotion) {
  drawMaze(0);
} else {
  const renderFrame = (elapsedMs: number): void => {
    drawMaze(elapsedMs);
    requestAnimationFrame(renderFrame);
  };
  requestAnimationFrame(renderFrame);
}
