import { createStore } from './store';

export interface LessonProgress {
  done?: boolean;
  quiz?: { best: number; total: number };
  /** Learner's draft code, keyed by file name */
  files?: Record<string, string>;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
  /** Sandbox drafts: key is the preset id, value maps file name -> code */
  sandbox: Record<string, Record<string, string>>;
}

export const progressStore = createStore<ProgressState>('codeacademy:progress', { lessons: {}, sandbox: {} });

export function updateLesson(id: string, patch: Partial<LessonProgress>) {
  progressStore.set((s) => ({ ...s, lessons: { ...s.lessons, [id]: { ...s.lessons[id], ...patch } } }));
}

export function updateSandbox(presetId: string, files: Record<string, string>) {
  progressStore.set((s) => ({ ...s, sandbox: { ...s.sandbox, [presetId]: files } }));
}

export function resetAllProgress() {
  progressStore.set(() => ({ lessons: {}, sandbox: {} }));
}
