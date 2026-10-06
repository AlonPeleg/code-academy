import type { GameTest, RunnerId, SourceFile } from '../runners/types';

export interface QuizQuestion {
  q: string;
  options: string[];
  /** Index of the correct option (0-based) */
  answer: number;
  explain?: string;
}

export interface StyleExpectation {
  selector: string;
  property: string;
  /** Exact computed value, e.g. "rgb(255, 0, 0)" */
  value?: string;
  /** If set, the computed value must NOT be this */
  not?: string;
}

export interface LessonCheck {
  /** Program output (console / print / query result) must equal this, ignoring trailing whitespace */
  output?: string;
  /** Regex patterns that must match the learner's code (optionally limited to one file) */
  code?: (string | { file?: string; pattern: string; message?: string })[];
  /** Web lessons with several pages: which html page the checks look at (default index.html) */
  page?: string;
  /** Python game lessons: run N frames headlessly with simulated keys, then test an expression */
  game?: GameTest & { message?: string };
  /** Checks run against the rendered page (HTML / CSS / React lessons) */
  dom?: {
    text?: string[];
    selectors?: string[];
    styles?: StyleExpectation[];
  };
}

/** Final step of a guided project: lets the learner download it as a ready-to-publish folder */
export interface ProjectExport {
  kind: 'static' | 'vite-react' | 'python' | 'node' | 'sql' | 'plain';
  /** folder / package name, lowercase with dashes */
  name: string;
  /** short extra sentence for the README (optional) */
  note?: string;
}

export interface Lesson {
  /** `${trackId}/${slug}` */
  id: string;
  trackId: string;
  slug: string;
  order: number;
  title: string;
  summary: string;
  runner: RunnerId;
  remoteLang?: string;
  /** Compiled game lesson: output is recorded frames that are replayed in the browser */
  game?: boolean;
  files: SourceFile[];
  stdin?: string;
  seed?: string;
  check?: LessonCheck;
  /** Progressive hints, revealed one at a time (gentle nudge first, near-answer last) */
  hints: string[];
  solution?: SourceFile[];
  quiz: QuizQuestion[];
  /** Present on the last step of a guided project */
  export?: ProjectExport;
  /** Difficulty label shown next to the lesson */
  level?: 'beginner' | 'intermediate' | 'advanced';
  /** Lesson text (markdown) */
  body: string;
}

export interface Track {
  id: string;
  title: string;
  tagline: string;
  color: string;
  icon: string;
  /** Sandbox preset to open for "Practice" */
  sandbox: string;
  /** Which section of the home page the track appears in */
  group?: 'learn' | 'data' | 'games' | 'projects';
  /** Longer description shown at the top of the track page (plain paragraphs, blank line between them) */
  intro?: string;
}
