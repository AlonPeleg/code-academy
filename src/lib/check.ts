import type { Probes, RunSummary, SourceFile } from '../runners/types';
import type { Lesson } from './types';
import type { TFn } from './i18n';

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

const plain: TFn = (en, vars) => (vars ? en.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? '')) : en);

export function evaluateCheck(lesson: Lesson, files: SourceFile[], summary: RunSummary, tr: TFn = plain): CheckResult {
  const check = lesson.check;
  if (!check) return { passed: true, messages: [] };
  const messages: string[] = [];
  let expected: string | undefined;
  let actual: string | undefined;

  if (!summary.ok) {
    return { passed: false, messages: [tr('Your code has an error, so it could not finish. Read the red message in the output, fix it, then check again.')] };
  }

  if (check.output !== undefined) {
    expected = norm(check.output);
    actual = norm(summary.stdout);
    if (expected !== actual) messages.push(tr('The output is not what we expected yet.'));
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
    if (!ok) messages.push(spec.message ?? tr('Your code should contain something like: {pattern}', { pattern: spec.pattern }));
  }

  if (check.game) {
    if (!summary.game?.passed) messages.push(check.game.message ?? summary.game?.detail ?? tr('The game did not behave as expected yet.'));
  }

  const dom = check.dom;
  if (dom) {
    const report = summary.dom;
    if (!report) {
      messages.push(tr('The preview did not finish loading. Try running again.'));
    } else {
      for (const t of dom.text ?? []) if (!report.text.includes(t)) messages.push(tr('The page should show the text "{text}".', { text: t }));
      for (const sel of dom.selectors ?? []) if (!report.selectors[sel]) messages.push(tr('The page should contain an element matching "{selector}".', { selector: sel }));
      for (const s of dom.styles ?? []) {
        const got = report.styles[`${s.selector}|${s.property}`] ?? '';
        if (s.value !== undefined && got !== s.value) messages.push(tr('{selector} should have {property}: {value} (it is currently {current}).', { selector: s.selector, property: s.property, value: s.value, current: got || tr('not set') }));
        if (s.not !== undefined && got === s.not) messages.push(tr('{selector} still has the default {property}. Change it.', { selector: s.selector, property: s.property }));
      }
    }
  }

  return { passed: messages.length === 0, messages, expected, actual };
}
