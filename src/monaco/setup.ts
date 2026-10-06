/* Monaco editor setup: bundled locally (no CDN), web workers, theme, TypeScript options and IntelliSense extras. */
import * as monaco from 'monaco-editor';
import { loader } from '@monaco-editor/react';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { registerIntellisense } from './intellisense';
import { REACT_TYPES } from './reactTypes';

(self as unknown as { MonacoEnvironment: monaco.Environment }).MonacoEnvironment = {
  getWorker(_: unknown, label: string) {
    if (label === 'json') return new jsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new cssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new htmlWorker();
    if (label === 'typescript' || label === 'javascript') return new tsWorker();
    return new editorWorker();
  },
};

loader.config({ monaco });

monaco.editor.defineTheme('academy-dark', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#0f1220',
    'editor.lineHighlightBackground': '#171b30',
    'editorGutter.background': '#0f1220',
    'editorLineNumber.foreground': '#4b5278',
    'editorLineNumber.activeForeground': '#9aa3d1',
  },
});
monaco.editor.setTheme('academy-dark');

const ts = monaco.languages.typescript;
const common = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  allowNonTsExtensions: true,
  jsx: ts.JsxEmit.React,
  allowJs: true,
  esModuleInterop: true,
  // every file is its own module, so two lessons can both declare `const name`
  moduleDetection: 3,
} as monaco.languages.typescript.CompilerOptions;

ts.typescriptDefaults.setCompilerOptions({ ...common, strict: true });
ts.javascriptDefaults.setCompilerOptions({ ...common, checkJs: false });
ts.typescriptDefaults.setEagerModelSync(true);
ts.javascriptDefaults.setEagerModelSync(true);

// Type information for React so hooks autocomplete and show docs inside the React sandbox.
const ACADEMY_API_TYPES = `
/** A very small XML tree, made by parseXML(). Tag names are matched without their prefix (soap:Body -> "Body"). */
interface XmlNode {
  name: string;
  local: string;
  attrs: Record<string, string>;
  children: XmlNode[];
  text: string;
  /** First descendant with this tag name, or null */
  find(tag: string): XmlNode | null;
  /** Every descendant with this tag name */
  findAll(tag: string): XmlNode[];
  /** Text of the first descendant with this tag name ('' if there is none) */
  get(tag: string): string;
}
/** Turn XML text into an XmlNode tree (the browser has no DOMParser inside the code runner). */
declare function parseXML(source: string): XmlNode;
`;
ts.typescriptDefaults.addExtraLib(ACADEMY_API_TYPES, 'file:///academy-api.d.ts');
ts.javascriptDefaults.addExtraLib(ACADEMY_API_TYPES, 'file:///academy-api.d.ts');
const GAME_TYPES = `
type GameColor = [number, number, number];
/** The tiny game engine (JavaScript Games track and sandbox). The screen is 320 x 240. */
declare const game: {
  WIDTH: number; HEIGHT: number;
  BLACK: GameColor; WHITE: GameColor; GRAY: GameColor; DARK: GameColor; RED: GameColor; ORANGE: GameColor;
  YELLOW: GameColor; GREEN: GameColor; CYAN: GameColor; BLUE: GameColor; PURPLE: GameColor; PINK: GameColor;
  /** Fill the whole screen with one color */
  clear(color?: GameColor): void;
  /** Filled rectangle; (x, y) is the top-left corner */
  rect(x: number, y: number, w: number, h: number, color?: GameColor): void;
  /** Filled circle; (x, y) is the center */
  circle(x: number, y: number, radius: number, color?: GameColor): void;
  line(x1: number, y1: number, x2: number, y2: number, color?: GameColor, width?: number): void;
  text(x: number, y: number, message: unknown, color?: GameColor, size?: number): void;
  /** True every frame while the key is held. Names: left right up down space a d w s z x enter */
  keyDown(name: string): boolean;
  /** True only on the frame the key goes down */
  keyPressed(name: string): boolean;
  mouse(): { x: number; y: number };
  mouseDown(): boolean;
  mousePressed(): boolean;
  /** Seconds since the game started */
  time(): number;
  stop(): void;
  /** Start the game loop: update(dt) runs every frame (dt = seconds since the last frame), then draw() */
  run(update?: (dt: number) => void, draw?: () => void): void;
};
`;
ts.javascriptDefaults.addExtraLib(GAME_TYPES, 'file:///academy-game.d.ts');
const NODE_TYPES = `
declare function require(name: string): any;
declare const module: { exports: any };
declare const exports: any;
declare const __dirname: string;
declare const __filename: string;
declare const process: { argv: string[]; env: Record<string, string | undefined>; exit(code?: number): never; cwd(): string; platform: string; uptime(): number; hrtime: { bigint(): bigint }; nextTick(fn: (...args: any[]) => void, ...args: any[]): void; stdout: { write(text: string): boolean }; memoryUsage(): Record<string, number> };
declare const Buffer: { from(data: string | number[], encoding?: string): any; alloc(size: number): any; isBuffer(x: unknown): boolean; concat(list: any[]): any };
/** Jest-style tests: group tests with describe, write each one with it or test, check values with expect. */
declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => unknown): void;
declare function test(name: string, fn: () => unknown): void;
declare function beforeEach(fn: () => unknown): void;
declare function afterEach(fn: () => unknown): void;
declare function beforeAll(fn: () => unknown): void;
declare function afterAll(fn: () => unknown): void;
interface Matchers {
  not: Matchers;
  resolves: Matchers;
  rejects: Matchers;
  toBe(expected: unknown): void;
  toEqual(expected: unknown): void;
  toStrictEqual(expected: unknown): void;
  toBeTruthy(): void;
  toBeFalsy(): void;
  toBeNull(): void;
  toBeUndefined(): void;
  toBeDefined(): void;
  toBeNaN(): void;
  toBeGreaterThan(n: number): void;
  toBeGreaterThanOrEqual(n: number): void;
  toBeLessThan(n: number): void;
  toBeLessThanOrEqual(n: number): void;
  toBeCloseTo(n: number, digits?: number): void;
  toContain(item: unknown): void;
  toContainEqual(item: unknown): void;
  toHaveLength(n: number): void;
  toHaveProperty(path: string, value?: unknown): void;
  toMatch(pattern: string | RegExp): void;
  toMatchObject(obj: object): void;
  toThrow(expected?: string | RegExp | Error): void;
  toBeInstanceOf(cls: Function): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(n: number): void;
  toHaveBeenCalledWith(...args: unknown[]): void;
  toHaveBeenLastCalledWith(...args: unknown[]): void;
  toHaveReturnedWith(value: unknown): void;
}
declare function expect(actual: unknown): Matchers;
declare const jest: {
  fn(impl?: (...args: any[]) => any): any;
  spyOn(obj: object, method: string): any;
  clearAllMocks(): void;
  restoreAllMocks(): void;
};
`;
ts.javascriptDefaults.addExtraLib(NODE_TYPES, 'file:///academy-node.d.ts');
ts.typescriptDefaults.addExtraLib(REACT_TYPES, 'file:///node_modules/@types/react/index.d.ts');
ts.javascriptDefaults.addExtraLib(REACT_TYPES, 'file:///node_modules/@types/react/index.d.ts');

/** React files use JSX with partial types, so only show syntax errors (but keep all autocomplete). */
export function setReactMode(on: boolean) {
  ts.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: on, noSyntaxValidation: false });
}

registerIntellisense(monaco);

export { monaco };
