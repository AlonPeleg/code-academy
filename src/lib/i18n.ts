import { useCallback } from 'react';
import { settingsStore, type Lang } from './settings';
import { HE } from './he';

export type { Lang };
export type Vars = Record<string, string | number>;
export type TFn = (en: string, vars?: Vars) => string;

/** Translate an English UI string. Unknown strings stay in English. `{name}` placeholders are filled from `vars`. */
export function translate(lang: Lang, en: string, vars?: Vars): string {
  let out = lang === 'he' ? HE[en] ?? en : en;
  if (vars) out = out.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
  return out;
}

export const getLang = (): Lang => settingsStore.get().lang ?? 'en';
export const isRtl = (lang: Lang) => lang === 'he';

/** Hook: returns `tr`, a translate function that re-renders the component when the language changes. */
export function useT(): TFn {
  const lang = settingsStore.use().lang ?? 'en';
  return useCallback((en: string, vars?: Vars) => translate(lang, en, vars), [lang]);
}

export function useLang(): Lang {
  return settingsStore.use().lang ?? 'en';
}

export const setLang = (lang: Lang) => settingsStore.set((s) => ({ ...s, lang }));
