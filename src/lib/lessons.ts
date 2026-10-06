import { load as loadYaml } from 'js-yaml';
import type { SourceFile } from '../runners/types';
import { TRACKS } from '../content/tracks';
import type { Lesson, LessonTranslation, Track } from './types';
import type { Lang } from './settings';
import { TRACKS_HE } from '../content/tracks.he';

const raw = import.meta.glob(['../content/*/*.md', '!../content/*/*.he.md'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const rawHe = import.meta.glob('../content/*/*.he.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const EXT_LANG: Record<string, string> = {
  html: 'html', css: 'css', js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
  py: 'python', sql: 'sql', c: 'c', h: 'c', cpp: 'cpp', cs: 'csharp', java: 'java', go: 'go', rs: 'rust', json: 'json', sh: 'shell', md: 'markdown',
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

function parseTranslation(path: string, text: string): LessonTranslation | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text.replace(/^\uFEFF/, ''));
  if (!match) return null;
  try {
    const meta = loadYaml(match[1]) as Record<string, any>;
    return {
      title: String(meta.title ?? ''),
      summary: String(meta.summary ?? ''),
      hints: Array.isArray(meta.hints) ? meta.hints.map(String) : [],
      quiz: Array.isArray(meta.quiz) ? meta.quiz.map((q: any) => ({ q: String(q.q ?? ''), options: (q.options ?? []).map(String), explain: q.explain ? String(q.explain) : undefined })) : [],
      messages: Array.isArray(meta.messages) ? meta.messages.map((m: unknown) => (m == null ? null : String(m))) : undefined,
      gameMessage: meta.gameMessage ? String(meta.gameMessage) : undefined,
      body: match[2].trim(),
    };
  } catch (e) {
    console.error(`[lessons] ${path}: invalid YAML in translation`, e);
    return null;
  }
}

const HE_BY_ID: Record<string, LessonTranslation> = {};
for (const [path, text] of Object.entries(rawHe)) {
  const parts = path.split('/');
  const trackId = parts[parts.length - 2];
  const name = parts[parts.length - 1].replace(/\.he\.md$/, '');
  const slug = /^\d+-(.*)$/.exec(name)?.[1] ?? name;
  const tr = parseTranslation(path, text);
  if (tr) HE_BY_ID[`${trackId}/${slug}`] = tr;
}

const ALL: Lesson[] = Object.entries(raw)
  .map(([path, text]) => parse(path, text))
  .filter((l): l is Lesson => !!l)
  .map((l) => ({ ...l, he: HE_BY_ID[l.id] }))
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

/** The lesson in the chosen language (falls back to English when there is no translation). */
export function localizeLesson(lesson: Lesson, lang: Lang): Lesson {
  const he = lesson.he;
  if (lang !== 'he' || !he) return lesson;
  const codeChecks = lesson.check?.code;
  const check = lesson.check
    ? {
        ...lesson.check,
        code: codeChecks?.map((c, i) => {
          const msg = he.messages?.[i];
          return msg && typeof c === 'object' ? { ...c, message: msg } : c;
        }),
        game: lesson.check.game && he.gameMessage ? { ...lesson.check.game, message: he.gameMessage } : lesson.check.game,
      }
    : undefined;
  return {
    ...lesson,
    title: he.title || lesson.title,
    summary: he.summary || lesson.summary,
    hints: he.hints.length === lesson.hints.length ? he.hints : lesson.hints,
    quiz: lesson.quiz.map((q, i) => {
      const h = he.quiz[i];
      return h && h.options.length === q.options.length ? { ...q, q: h.q || q.q, options: h.options, explain: q.explain ? h.explain ?? q.explain : q.explain } : q;
    }),
    check,
    body: he.body || lesson.body,
  };
}

/** True when the lesson has a Hebrew translation. */
export const hasTranslation = (lesson: Lesson) => !!lesson.he;

/** Track title / tagline / intro in the chosen language. */
export function localizeTrack(track: Track, lang: Lang): Track {
  if (lang !== 'he') return track;
  const he = TRACKS_HE[track.id];
  return he ? { ...track, ...he } : track;
}
