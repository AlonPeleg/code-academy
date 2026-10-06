import type { Probes, RunSummary, SourceFile } from '../runners/types';
import type { Lesson } from './types';

export interface CheckResult {
  passed: boolean;
  messages: string[];
  expected?: string;
  actual?: string;
}

const norm = (s: string) =>
  s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .join('\n')
    .trim();

export const hasCheck = (lesson: Lesson) => !!lesson.check && Object.keys(lesson.check).length > 0;

/** What the preview iframe should measure for this lesson. */
export function buildProbes(lesson: Lesson): Probes {
  const dom = lesson.check?.dom;
  return {
    selectors: dom?.selectors,
    styles: dom?.styles?.map((s) => ({ selector: s.selector, property: s.property })),
  };
}

export function evaluateCheck(lesson: Lesson, files: SourceFile[], summary: RunSummary): CheckResult {
  const check = lesson.check;
  if (!check) return { passed: true, messages: [] };
  const messages: string[] = [];
  let expected: string | undefined;
  let actual: string | undefined;

  if (!summary.ok) {
    return { passed: false, messages: ['Your code has an error, so it could not finish. Read the red message in the output, fix it, then check again.'] };
  }

  if (check.output !== undefined) {
    expected = norm(check.output);
    actual = norm(summary.stdout);
    if (expected !== actual) messages.push('The output is not what we expected yet.');
  }

  for (const rule of check.code ?? []) {
    const spec = typeof rule === 'string' ? { pattern: rule } : rule;
    const target = spec.file ? files.filter((f) => f.name === spec.file) : files;
    const text = target.map((f) => f.code).join('\n');
    let ok = false;
    try {
      ok = new RegExp(spec.pattern, 'i').test(text);
    } catch {
      ok = false;
    }
    if (!ok) messages.push(spec.message ?? `Your code should contain something like: ${spec.pattern}`);
  }

  if (check.game) {
    if (!summary.game?.passed) messages.push(check.game.message ?? summary.game?.detail ?? 'The game did not behave as expected yet.');
  }

  const dom = check.dom;
  if (dom) {
    const report = summary.dom;
    if (!report) {
      messages.push('The preview did not finish loading. Try running again.');
    } else {
      for (const t of dom.text ?? []) if (!report.text.includes(t)) messages.push(`The page should show the text "${t}".`);
      for (const sel of dom.selectors ?? []) if (!report.selectors[sel]) messages.push(`The page should contain an element matching "${sel}".`);
      for (const s of dom.styles ?? []) {
        const got = report.styles[`${s.selector}|${s.property}`] ?? '';
        if (s.value !== undefined && got !== s.value) messages.push(`${s.selector} should have ${s.property}: ${s.value} (it is currently ${got || 'not set'}).`);
        if (s.not !== undefined && got === s.not) messages.push(`${s.selector} still has the default ${s.property}. Change it.`);
      }
    }
  }

  return { passed: messages.length === 0, messages, expected, actual };
}
