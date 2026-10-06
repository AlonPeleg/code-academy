import { readFileSync, readdirSync } from 'node:fs';
import { load } from 'js-yaml';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../src/content', import.meta.url));
let bad = 0, n = 0;
for (const t of readdirSync(root, { withFileTypes: true }).filter(d => d.isDirectory())) {
  for (const f of readdirSync(`${root}/${t.name}`).filter(f => f.endsWith('.md') && !f.endsWith('.he.md'))) {
    n++;
    const text = readFileSync(`${root}/${t.name}/${f}`, 'utf8');
    const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
    const id = `${t.name}/${f}`;
    if (!m) { console.log('NO FRONTMATTER', id); bad++; continue; }
    let meta;
    try { meta = load(m[1]); } catch (e) { console.log('YAML ERROR', id, e.message.split('\n')[0]); bad++; continue; }
    const errs = [];
    if (!meta.title) errs.push('title');
    if (meta.level && !['beginner','intermediate','advanced'].includes(meta.level)) errs.push('level');
    if (!['web','js','ts','react','python','pygame','jsgame','sql','remote','git'].includes(meta.runner)) errs.push('runner');
    if (!meta.files?.length) errs.push('files');
    if (!meta.solution?.length) errs.push('solution');
    if (!meta.check) errs.push('check');
    for (const q of meta.quiz ?? []) {
      if (typeof q.q !== 'string' || !Array.isArray(q.options) || q.options.some(o => typeof o !== 'string') || !(q.answer >= 0 && q.answer < q.options.length)) errs.push('quiz:' + JSON.stringify(q).slice(0, 80));
    }
    if ((meta.quiz ?? []).length < 3) errs.push('quiz<3');
    if (errs.length) { console.log('PROBLEM', id, errs.join('; ')); bad++; }
  }
}
console.log(`${n} lessons checked, ${bad} with problems`);
