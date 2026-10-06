// Validates Hebrew lesson overlays (src/content/<track>/NN-slug.he.md) against the English lesson.
// usage: node validate-he.mjs [filter]   (filter = substring of the path)
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { load } from 'js-yaml';
import { fileURLToPath } from 'node:url';
const ROOT = fileURLToPath(new URL('../src/content', import.meta.url));
const filter = process.argv[2];
const split = (t) => { const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(t.replace(/^﻿/, '')); return m ? { meta: load(m[1]), body: m[2].trim() } : null; };
const fences = (b) => [...b.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map((m) => m[1].trim());
const inlineCode = (b) => [...b.replace(/^```[^\n]*\n[\s\S]*?^```/gm, '').matchAll(/`([^`\n]+)`/g)].map((m) => m[1]).sort();
const count = (b, re) => (b.match(re) || []).length;
let n = 0, bad = 0, missing = 0;
for (const t of readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(`${ROOT}/${t.name}`).filter((f) => f.endsWith('.he.md')).sort()) {
    const path = `${t.name}/${f}`;
    if (filter && !path.includes(filter)) continue;
    n++;
    const problems = [];
    const enPath = `${ROOT}/${t.name}/${f.replace('.he.md', '.md')}`;
    if (!existsSync(enPath)) { problems.push('no English lesson'); }
    else {
      let en, he;
      try { en = split(readFileSync(enPath, 'utf8')); he = split(readFileSync(`${ROOT}/${path}`, 'utf8')); } catch (e) { problems.push('YAML: ' + e.message.split('\n')[0]); }
      if (en && he) {
        const hm = he.meta;
        if (typeof hm.title !== 'string' || !hm.title) problems.push('title missing');
        if (typeof hm.summary !== 'string' || !hm.summary) problems.push('summary missing');
        if ((hm.hints?.length ?? 0) !== (en.meta.hints?.length ?? 0)) problems.push(`hints: ${hm.hints?.length} vs ${en.meta.hints?.length}`);
        const eq = en.meta.quiz ?? [], hq = hm.quiz ?? [];
        if (eq.length !== hq.length) problems.push(`quiz length ${hq.length} vs ${eq.length}`);
        else eq.forEach((q, i) => {
          if ((hq[i].options?.length ?? 0) !== q.options.length) problems.push(`quiz ${i + 1}: options ${hq[i].options?.length} vs ${q.options.length}`);
          if (!!q.explain !== !!hq[i].explain) problems.push(`quiz ${i + 1}: explain ${q.explain ? 'missing' : 'unexpected'}`);
          if (typeof hq[i].q !== 'string') problems.push(`quiz ${i + 1}: q missing`);
        });
        const codeSpecs = (en.meta.check?.code ?? []);
        const withMsg = codeSpecs.filter((s) => typeof s === 'object' && s.message).length;
        if (withMsg && (!Array.isArray(hm.messages) || hm.messages.length !== codeSpecs.length)) problems.push(`messages: need an array of ${codeSpecs.length} (one per check.code item, null when the English item has no message)`);
        if (en.meta.check?.game?.message && !hm.gameMessage) problems.push('gameMessage missing');
        const ef = fences(en.body), hf = fences(he.body);
        if (ef.length !== hf.length) problems.push(`code blocks ${hf.length} vs ${ef.length}`);
        else ef.forEach((c, i) => { if (c !== hf[i]) problems.push(`code block ${i + 1} differs from English`); });
        const ei = inlineCode(en.body).join('\u0001'), hi = inlineCode(he.body).join('\u0001');
        if (ei !== hi) problems.push('inline `code` spans differ (they must be identical, only the text around them is translated)');
        for (const [name, re] of [['headings', /^#{1,6} /gm], ['blockquotes', /^> /gm], ['table rows', /^\|/gm], ['list items', /^\s*(?:[-*]|\d+\.) /gm]]) {
          const a = count(en.body, re), b = count(he.body, re);
          if (a !== b) problems.push(`${name}: ${b} vs ${a}`);
        }
        if (!/[֐-׿]/.test(he.body)) problems.push('body has no Hebrew');
      }
    }
    if (problems.length) { bad++; console.log(`PROBLEM ${path}\n   - ` + problems.join('\n   - ')); }
  }
}
// lessons that are still missing a translation (beginner only)
for (const t of readdirSync(ROOT, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  for (const f of readdirSync(`${ROOT}/${t.name}`).filter((f) => f.endsWith('.md') && !f.endsWith('.he.md'))) {
    if (filter && !`${t.name}/${f}`.includes(filter)) continue;
    const s = readFileSync(`${ROOT}/${t.name}/${f}`, 'utf8');
    if (/^level: beginner/m.test(s) && !existsSync(`${ROOT}/${t.name}/${f.replace('.md', '.he.md')}`)) missing++;
  }
}
console.log(`${n} Hebrew files checked, ${bad} with problems; ${missing} beginner lessons still without a translation`);
