import { load as loadYaml } from 'js-yaml';
import type { SourceFile } from '../runners/types';
import { TRACKS } from '../content/tracks';
import type { Lesson, Track } from './types';

const raw = import.meta.glob('../content/*/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const EXT_LANG: Record<string, string> = {
  html: 'html', css: 'css', js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', sql: 'sql', c: 'c', h: 'c', cpp: 'cpp', cs: 'csharp', java: 'java', go: 'go', rs: 'rust', json: 'json',
};

export const languageOf = (fileName: string) => EXT_LANG[fileName.split('.').pop()?.toLowerCase() ?? ''] ?? 'plaintext';

interface RawFile { name: string; language?: string; code: string }

function normalizeFiles(list: RawFile[] | undefined, fallback?: SourceFile[]): SourceFile[] {
  if (!list) return [];
  return list.map((f, i) => {
    const name = f.name ?? fallback?.[i]?.name ?? `file${i + 1}`;
    return { name, language: f.language ?? languageOf(name), code: String(f.code ?? '').replace(/\n$/, '') };
  });
}

function parse(path: string, text: string): Lesson | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text.replace(/^﻿/, ''));
  if (!match) {
    console.warn(`[lessons] ${path}: missing front matter`);
    return null;
  }
  let meta: Record<string, any>;
  try {
    meta = loadYaml(match[1]) as Record<string, any>;
  } catch (e) {
    console.error(`[lessons] ${path}: invalid YAML`, e);
    return null;
  }
  const parts = path.split('/');
  const trackId = parts[parts.length - 2];
  const fileName = parts[parts.length - 1].replace(/\.md$/, '');
  const num = /^(\d+)-(.*)$/.exec(fileName);
  const slug = num ? num[2] : fileName;
  const files = normalizeFiles(meta.files);
  return {
    id: `${trackId}/${slug}`,
    trackId,
    slug,
    order: num ? parseInt(num[1], 10) : 0,
    title: meta.title ?? slug,
    summary: meta.summary ?? '',
    runner: meta.runner,
    remoteLang: meta.remote ?? (meta.runner === 'remote' ? trackId.replace(/^game-/, '') : undefined),
    game: !!meta.game,
    files,
    stdin: meta.stdin,
    seed: meta.seed,
    check: meta.check,
    hints: Array.isArray(meta.hints) ? meta.hints.map(String) : meta.hint ? [String(meta.hint)] : [],
    solution: meta.solution ? normalizeFiles(meta.solution, files) : undefined,
    export: meta.export && typeof meta.export === 'object' ? { kind: meta.export.kind ?? 'plain', name: String(meta.export.name ?? trackId), note: meta.export.note } : undefined,
    level: ['beginner', 'intermediate', 'advanced'].includes(meta.level) ? meta.level : undefined,
    quiz: meta.quiz ?? [],
    body: match[2].trim(),
  };
}

const ALL: Lesson[] = Object.entries(raw)
  .map(([path, text]) => parse(path, text))
  .filter((l): l is Lesson => !!l)
  .sort((a, b) => a.trackId.localeCompare(b.trackId) || a.order - b.order);

export const tracks: Track[] = TRACKS;
export const allLessons = ALL;
export const lessonsOf = (trackId: string) => ALL.filter((l) => l.trackId === trackId);
export const getTrack = (id: string) => TRACKS.find((t) => t.id === id);
export const getLesson = (trackId: string, slug: string) => ALL.find((l) => l.trackId === trackId && l.slug === slug);

export function neighbours(lesson: Lesson) {
  const list = lessonsOf(lesson.trackId);
  const i = list.findIndex((l) => l.id === lesson.id);
  return { prev: list[i - 1], next: list[i + 1], index: i, total: list.length };
}
