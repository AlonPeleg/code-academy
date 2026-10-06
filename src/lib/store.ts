import { useSyncExternalStore } from 'react';

/** Tiny persisted store (localStorage) usable from React via a hook. */
export function createStore<T extends object>(key: string, initial: T) {
  let state: T = initial;
  try {
    const raw = localStorage.getItem(key);
    if (raw) state = { ...initial, ...(JSON.parse(raw) as Partial<T>) };
  } catch {
    /* storage unavailable: keep in-memory state */
  }
  const listeners = new Set<() => void>();

  const persist = () => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  };

  return {
    get: () => state,
    set(updater: (prev: T) => T) {
      state = updater(state);
      persist();
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    use(): T {
      return useSyncExternalStore(
        (l) => {
          listeners.add(l);
          return () => listeners.delete(l);
        },
        () => state,
      );
    },
  };
}
