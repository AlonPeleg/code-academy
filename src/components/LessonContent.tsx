import { useEffect, useMemo, useRef } from 'react';
import { marked } from 'marked';
import { monaco } from '../monaco/setup';

const LANG_ALIAS: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript', py: 'python', cs: 'csharp', 'c++': 'cpp', html: 'html', css: 'css', sql: 'sql', c: 'c', cpp: 'cpp', csharp: 'csharp', python: 'python', javascript: 'javascript', typescript: 'typescript', java: 'java', go: 'go', rust: 'rust', json: 'json',
};

/** Renders a lesson's markdown with the same syntax colours as the editor. */
export default function LessonContent({ body }: { body: string }) {
  const html = useMemo(() => marked.parse(body, { async: false, gfm: true }) as string, [body]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>('pre code').forEach((el) => {
      const cls = Array.from(el.classList).find((c) => c.startsWith('language-'));
      const lang = cls ? LANG_ALIAS[cls.replace('language-', '')] : undefined;
      if (!lang) return;
      monaco.editor.colorize(el.textContent ?? '', lang, { tabSize: 2 }).then((colored) => {
        el.innerHTML = colored;
      });
    });
    root.querySelectorAll('a').forEach((a) => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noreferrer');
    });
  }, [html]);

  return <div ref={ref} className="prose" dangerouslySetInnerHTML={{ __html: html }} />;
}
