/** Minimal React typings for editor IntelliSense (hover docs + autocomplete). Not used at runtime. */
export const REACT_TYPES = `
declare module 'react' {
  export type ReactNode = any;
  export type ReactElement = any;
  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prev: S) => S);
  export type FC<P = {}> = (props: P & { children?: ReactNode }) => ReactElement | null;
  export interface MutableRefObject<T> { current: T }

  /** Adds state to a component. Returns the current value and a function to update it. */
  export function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];
  /** Runs side effects (fetching, timers, subscriptions) after render. Return a cleanup function if needed. */
  export function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  /** Like useEffect, but runs before the browser paints. */
  export function useLayoutEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  /** Holds a value that survives re-renders without causing one. Often used for DOM elements. */
  export function useRef<T>(initialValue: T): MutableRefObject<T>;
  export function useRef<T>(initialValue: T | null): { current: T | null };
  /** Remembers a calculated value until a dependency changes. */
  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  /** Remembers a function until a dependency changes. */
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly unknown[]): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, Dispatch<A>];
  export function useContext<T>(context: Context<T>): T;
  export interface Context<T> { Provider: any; Consumer: any; _t?: T }
  export function createContext<T>(defaultValue: T): Context<T>;
  export function createElement(type: any, props?: any, ...children: any[]): ReactElement;
  /** Groups elements without adding an extra node to the page. */
  export const Fragment: any;
  export const StrictMode: any;
  export class Component<P = {}, S = {}> { props: P; state: S; setState(s: Partial<S>): void; render(): ReactNode }
  const React: {
    useState: typeof useState; useEffect: typeof useEffect; useRef: typeof useRef; useMemo: typeof useMemo;
    useCallback: typeof useCallback; useReducer: typeof useReducer; useContext: typeof useContext;
    createContext: typeof createContext; createElement: typeof createElement; Fragment: typeof Fragment;
    Component: typeof Component;
  };
  export default React;
}
declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): { render(node: any): void; unmount(): void };
}
declare module 'react-dom' {
  export function createPortal(children: any, container: Element): any;
}
declare namespace JSX {
  interface Element {}
  interface IntrinsicElements { [tag: string]: any }
  interface ElementChildrenAttribute { children: {} }
}
`;
