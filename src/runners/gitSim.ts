/**
 * A tiny, deterministic Git + shell simulator for the practice terminal.
 * The learner writes a script (one command per line); every command is echoed after "$ " followed by its output.
 * It supports the everyday Git commands with output close to real Git (hashes and dates are fake but stable).
 * Pure TypeScript, no DOM: it also runs under Node for testing.
 */

type Tree = Record<string, string>;

interface Commit {
  id: string;
  parents: string[];
  message: string;
  tree: Tree;
  author: string;
  email: string;
  n: number; // creation order (also used for the fake date)
}

interface Repo {
  commits: Record<string, Commit>;
  branches: Record<string, string>; // name -> tip id
  head: { branch?: string; detached?: string };
  index: Tree;
  work: Tree;
  config: Record<string, string>;
  remotes: Record<string, string>;
  /** commits that exist on the (pretend) remote: branch -> tip id */
  remoteHeads: Record<string, Record<string, string>>;
  /** local remote-tracking refs: "origin/main" -> id */
  tracking: Record<string, string>;
  upstream: Record<string, string>; // local branch -> "origin/main"
  tags: Record<string, string>;
  stash: { work: Tree; index: Tree; base: string; branch: string; message: string }[];
  merge?: { head: string; name: string; conflicts: string[]; message: string };
  counter: number;
}

export interface GitRunResult {
  lines: string[];
}

const BASE_TIME = Date.UTC(2024, 0, 15, 10, 0, 0);
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function hash40(text: string): string {
  // four rounds of FNV-1a with different seeds, formatted as 40 hex chars
  let out = '';
  for (let r = 0; r < 5; r++) {
    let h = 0x811c9dc5 ^ (r * 0x9e3779b1);
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    h ^= h >>> 15;
    h = Math.imul(h, 0x2c1b3c6d);
    h ^= h >>> 12;
    out += (h >>> 0).toString(16).padStart(8, '0');
  }
  return out;
}
const short = (id: string) => id.slice(0, 7);

function fmtDate(n: number): string {
  const d = new Date(BASE_TIME + n * 3600_000);
  const p = (x: number) => String(x).padStart(2, '0');
  return `${DAYS[d.getUTCDay()]} ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())} ${d.getUTCFullYear()} +0000`;
}

/* ---------------------------------------------------------------- line diff helpers */

function splitLines(s: string): string[] {
  if (s === '') return [];
  const t = s.endsWith('\n') ? s.slice(0, -1) : s;
  return t.split('\n');
}

/** Longest common subsequence: returns pairs of matching indices. */
function lcs(a: string[], b: string[]): [number, number][] {
  const n = a.length, m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: [number, number][] = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { out.push([i, j]); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return out;
}

interface Op { t: ' ' | '+' | '-'; line: string }
function diffOps(a: string[], b: string[]): Op[] {
  const ops: Op[] = [];
  let i = 0, j = 0;
  for (const [x, y] of lcs(a, b)) {
    while (i < x) ops.push({ t: '-', line: a[i++] });
    while (j < y) ops.push({ t: '+', line: b[j++] });
    ops.push({ t: ' ', line: a[i] });
    i++; j++;
  }
  while (i < a.length) ops.push({ t: '-', line: a[i++] });
  while (j < b.length) ops.push({ t: '+', line: b[j++] });
  return ops;
}

function stat(a: string, b: string): { add: number; del: number } {
  const ops = diffOps(splitLines(a), splitLines(b));
  return { add: ops.filter((o) => o.t === '+').length, del: ops.filter((o) => o.t === '-').length };
}

function unifiedHunks(a: string[], b: string[], ctx = 3): string[] {
  const ops = diffOps(a, b);
  const out: string[] = [];
  const changed = ops.map((o, i) => (o.t !== ' ' ? i : -1)).filter((i) => i >= 0);
  if (!changed.length) return out;
  // group changes whose gap is small
  const groups: [number, number][] = [];
  let start = changed[0], end = changed[0];
  for (const c of changed.slice(1)) {
    if (c - end <= ctx * 2 + 1) end = c;
    else { groups.push([start, end]); start = end = c; }
  }
  groups.push([start, end]);
  // line numbers before each op
  const aLine: number[] = [], bLine: number[] = [];
  let ai = 0, bi = 0;
  ops.forEach((o, k) => { aLine[k] = ai; bLine[k] = bi; if (o.t !== '+') ai++; if (o.t !== '-') bi++; });
  for (const [g0, g1] of groups) {
    const from = Math.max(0, g0 - ctx), to = Math.min(ops.length - 1, g1 + ctx);
    const slice = ops.slice(from, to + 1);
    const aCount = slice.filter((o) => o.t !== '+').length, bCount = slice.filter((o) => o.t !== '-').length;
    const aStart = aCount === 0 ? aLine[from] : aLine[from] + 1, bStart = bCount === 0 ? bLine[from] : bLine[from] + 1;
    const range = (s: number, c: number) => (c === 1 ? `${s}` : `${s},${c}`);
    out.push(`@@ -${range(aStart, aCount)} +${range(bStart, bCount)} @@`);
    for (const o of slice) out.push(o.t + o.line);
  }
  return out;
}

/** three-way line merge. Returns merged text and whether there were conflicts. */
function merge3(base: string, ours: string, theirs: string, oursName: string, theirsName: string): { text: string; conflict: boolean } {
  const o = splitLines(base), a = splitLines(ours), b = splitLines(theirs);
  const ma = new Array(o.length).fill(-1), mb = new Array(o.length).fill(-1);
  for (const [i, j] of lcs(o, a)) ma[i] = j;
  for (const [i, j] of lcs(o, b)) mb[i] = j;
  const out: string[] = [];
  let conflict = false;
  let io = 0, ia = 0, ib = 0;
  const flush = (eo: number, ea: number, eb: number) => {
    const so = o.slice(io, eo), sa = a.slice(ia, ea), sb = b.slice(ib, eb);
    const same = (x: string[], y: string[]) => x.length === y.length && x.every((v, k) => v === y[k]);
    if (same(sa, so)) out.push(...sb);
    else if (same(sb, so) || same(sa, sb)) out.push(...sa);
    else {
      conflict = true;
      out.push(`<<<<<<< ${oursName}`, ...sa, '=======', ...sb, `>>>>>>> ${theirsName}`);
    }
    io = eo; ia = ea; ib = eb;
  };
  for (let i = 0; i < o.length; i++) {
    if (ma[i] !== -1 && mb[i] !== -1) {
      flush(i, ma[i], mb[i]);
      out.push(o[i]);
      io = i + 1; ia = ma[i] + 1; ib = mb[i] + 1;
    }
  }
  flush(o.length, a.length, b.length);
  return { text: out.length ? out.join('\n') + '\n' : '', conflict };
}

/* ---------------------------------------------------------------- shell-ish tokenizer */

function tokenize(line: string): { tokens: string[]; error?: string; redirect?: { op: '>' | '>>'; file: string } } {
  const tokens: string[] = [];
  let cur = '', has = false, quote: string | null = null;
  const raw: { text: string; quoted: boolean }[] = [];
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && i + 1 < line.length && '"\\$'.includes(line[i + 1])) cur += line[++i];
      else cur += ch;
    } else if (ch === '"' || ch === "'") { quote = ch; has = true; }
    else if (ch === ' ' || ch === '\t') { if (has) { raw.push({ text: cur, quoted: false }); cur = ''; has = false; } }
    else if (ch === '>' ) {
      if (has) { raw.push({ text: cur, quoted: false }); cur = ''; has = false; }
      if (line[i + 1] === '>') { raw.push({ text: '>>', quoted: false }); i++; } else raw.push({ text: '>', quoted: false });
    } else { cur += ch; has = true; }
  }
  if (quote) return { tokens: [], error: 'unterminated quote' };
  if (has) raw.push({ text: cur, quoted: false });
  let redirect: { op: '>' | '>>'; file: string } | undefined;
  for (let i = 0; i < raw.length; i++) {
    if (raw[i].text === '>' || raw[i].text === '>>') {
      const f = raw[i + 1]?.text;
      if (!f) return { tokens: [], error: "syntax error near unexpected token `newline'" };
      redirect = { op: raw[i].text as '>' | '>>', file: f };
      i++;
    } else tokens.push(raw[i].text);
  }
  tokens.length; // keep
  return { tokens, redirect };
}

/* ---------------------------------------------------------------- the simulator */

const CWD = '/home/learner/project';

export function runGitScript(script: string): GitRunResult {
  const out: string[] = [];
  let repo = null as Repo | null;
  const files: Tree = {}; // the working directory before `git init` / always the same object after init (repo.work)
  let work: Tree = files;

  const say = (s = '') => { for (const l of s.split('\n')) out.push(l); };
  const need = (): Repo | null => {
    if (!repo) { say('fatal: not a git repository (or any of the parent directories): .git'); return null; }
    return repo;
  };

  /* ---- repo helpers ---- */
  const tipOf = (r: Repo): string | undefined => (r.head.branch ? r.branches[r.head.branch] : r.head.detached);
  const treeOf = (r: Repo, id?: string): Tree => (id ? r.commits[id].tree : {});
  const headTree = (r: Repo) => treeOf(r, tipOf(r));

  const newCommit = (r: Repo, parents: string[], message: string, tree: Tree): Commit => {
    r.counter++;
    const id = hash40(JSON.stringify([parents, tree, message, r.counter]));
    const c: Commit = { id, parents, message, tree: { ...tree }, author: r.config['user.name'] ?? 'Learner', email: r.config['user.email'] ?? 'learner@example.com', n: r.counter };
    r.commits[id] = c;
    return c;
  };

  const ancestors = (r: Repo, id: string): Set<string> => {
    const seen = new Set<string>();
    const stack = [id];
    while (stack.length) {
      const x = stack.pop()!;
      if (seen.has(x)) continue;
      seen.add(x);
      stack.push(...r.commits[x].parents);
    }
    return seen;
  };

  const mergeBase = (r: Repo, a: string, b: string): string | undefined => {
    const A = ancestors(r, a);
    const cands = [...ancestors(r, b)].filter((x) => A.has(x));
    // best common ancestor = the newest one
    return cands.sort((x, y) => r.commits[y].n - r.commits[x].n)[0];
  };

  const resolveRev = (r: Repo, spec: string): string | undefined => {
    const m = /^(.*?)((?:[~^]\d*)*)$/.exec(spec);
    const baseName = m ? m[1] : spec;
    let suffix = m ? m[2] : '';
    let id: string | undefined;
    if (baseName === 'HEAD' || baseName === '@') id = tipOf(r);
    else if (r.branches[baseName]) id = r.branches[baseName];
    else if (r.tags[baseName]) id = r.tags[baseName];
    else if (r.tracking[baseName]) id = r.tracking[baseName];
    else if (baseName.length >= 4) id = Object.keys(r.commits).find((k) => k.startsWith(baseName));
    if (!id) return undefined;
    const re = /([~^])(\d*)/g;
    let mm: RegExpExecArray | null;
    while ((mm = re.exec(suffix))) {
      const count = mm[2] === '' ? 1 : parseInt(mm[2], 10);
      if (mm[1] === '~') { for (let i = 0; i < count; i++) { const p: string | undefined = r.commits[id!].parents[0]; if (!p) return undefined; id = p; } }
      else { const p: string | undefined = r.commits[id!].parents[count - 1]; if (!p) return undefined; id = p; }
    }
    return id;
  };

  const decorations = (r: Repo, id: string): string => {
    const parts: string[] = [];
    const t = tipOf(r);
    if (t === id) parts.push(r.head.branch ? `HEAD -> ${r.head.branch}` : 'HEAD');
    for (const [b, tip] of Object.entries(r.branches).sort()) if (tip === id && b !== r.head.branch) parts.push(b);
    for (const [tg, tip] of Object.entries(r.tags).sort()) if (tip === id) parts.push(`tag: ${tg}`);
    for (const [tb, tip] of Object.entries(r.tracking).sort()) if (tip === id) parts.push(tb);
    return parts.length ? ` (${parts.join(', ')})` : '';
  };

  const ignored = (path: string): boolean => {
    const ig = work['.gitignore'];
    if (!ig) return false;
    return ig.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#')).some((pat) => {
      if (pat.endsWith('/')) return path.startsWith(pat) || path.includes('/' + pat);
      const re = new RegExp('^(?:.*/)?' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*').replace(/\?/g, '[^/]') + '$');
      return re.test(path) || path.startsWith(pat + '/');
    });
  };

  const trackedChanges = (r: Repo) => {
    const head = headTree(r);
    const staged: { path: string; kind: 'new file' | 'modified' | 'deleted' }[] = [];
    for (const p of Object.keys(r.index).sort()) {
      if (r.merge?.conflicts.includes(p)) continue;
      if (!(p in head)) staged.push({ path: p, kind: 'new file' });
      else if (head[p] !== r.index[p]) staged.push({ path: p, kind: 'modified' });
    }
    for (const p of Object.keys(head).sort()) if (!(p in r.index) && !r.merge?.conflicts.includes(p)) staged.push({ path: p, kind: 'deleted' });
    const unstaged: { path: string; kind: 'modified' | 'deleted' }[] = [];
    for (const p of Object.keys(r.index).sort()) {
      if (r.merge?.conflicts.includes(p)) continue;
      if (!(p in work)) unstaged.push({ path: p, kind: 'deleted' });
      else if (work[p] !== r.index[p]) unstaged.push({ path: p, kind: 'modified' });
    }
    const untracked = Object.keys(work).filter((p) => !(p in r.index) && !ignored(p)).sort();
    return { staged, unstaged, untracked };
  };

  const statusText = (r: Repo, short = false): string => {
    const { staged, unstaged, untracked } = trackedChanges(r);
    const conflicts = r.merge?.conflicts ?? [];
    if (short) {
      const rows: string[] = [];
      const all = new Set<string>([...staged.map((s) => s.path), ...unstaged.map((s) => s.path), ...conflicts]);
      for (const p of [...all].sort()) {
        if (conflicts.includes(p)) { rows.push(`UU ${p}`); continue; }
        const s = staged.find((x) => x.path === p), u = unstaged.find((x) => x.path === p);
        const sc = s ? (s.kind === 'new file' ? 'A' : s.kind === 'deleted' ? 'D' : 'M') : ' ';
        const uc = u ? (u.kind === 'deleted' ? 'D' : 'M') : ' ';
        rows.push(`${sc}${uc} ${p}`);
      }
      for (const p of untracked) rows.push(`?? ${p}`);
      return rows.join('\n');
    }
    const lines: string[] = [];
    lines.push(r.head.branch ? `On branch ${r.head.branch}` : `HEAD detached at ${short_(tipOf(r)!)}`);
    const up = r.head.branch ? r.upstream[r.head.branch] : undefined;
    if (up && r.tracking[up]) {
      const local = tipOf(r)!, remote = r.tracking[up];
      if (local === remote) lines.push(`Your branch is up to date with '${up}'.`);
      else {
        const lAnc = ancestors(r, local), rAnc = ancestors(r, remote);
        const ahead = [...lAnc].filter((x) => !rAnc.has(x)).length, behind = [...rAnc].filter((x) => !lAnc.has(x)).length;
        if (ahead && !behind) lines.push(`Your branch is ahead of '${up}' by ${ahead} commit${ahead > 1 ? 's' : ''}.`, '  (use "git push" to publish your local commits)');
        else if (behind && !ahead) lines.push(`Your branch is behind '${up}' by ${behind} commit${behind > 1 ? 's' : ''}, and can be fast-forwarded.`, '  (use "git pull" to update your local branch)');
        else lines.push(`Your branch and '${up}' have diverged,`, `and have ${ahead} and ${behind} different commits each, respectively.`, '  (use "git pull" if you want to integrate the remote branch with yours)');
      }
    }
    if (!tipOf(r)) lines.push('', 'No commits yet');
    if (r.merge) {
      if (conflicts.length) lines.push('You have unmerged paths.', '  (fix conflicts and run "git commit")', '  (use "git merge --abort" to abort the merge)');
      else lines.push('All conflicts fixed but you are still merging.', '  (use "git commit" to conclude merge)');
    }
    lines.push('');
    if (staged.length) {
      lines.push('Changes to be committed:', tipOf(r) ? '  (use "git restore --staged <file>..." to unstage)' : '  (use "git rm --cached <file>..." to unstage)');
      for (const s of staged) lines.push(`\t${(s.kind + ':').padEnd(12)}${s.path}`);
      lines.push('');
    }
    if (conflicts.length) {
      lines.push('Unmerged paths:', '  (use "git add <file>..." to mark resolution)');
      for (const p of conflicts) lines.push(`\tboth modified:   ${p}`);
      lines.push('');
    }
    if (unstaged.length) {
      lines.push('Changes not staged for commit:', '  (use "git add <file>..." to update what will be committed)', '  (use "git restore <file>..." to discard changes in working directory)');
      for (const u of unstaged) lines.push(`\t${(u.kind + ':').padEnd(12)}${u.path}`);
      lines.push('');
    }
    if (untracked.length) {
      lines.push('Untracked files:', '  (use "git add <file>..." to include in what will be committed)');
      for (const p of untracked) lines.push(`\t${p}`);
      lines.push('');
    }
    if (!staged.length && !unstaged.length && !conflicts.length) {
      if (untracked.length) lines.push('nothing added to commit but untracked files present (use "git add" to track)');
      else lines.push(tipOf(r) ? 'nothing to commit, working tree clean' : 'nothing to commit (create/copy files and use "git add" to track)');
    } else if (!staged.length) lines.push('no changes added to commit (use "git add" and/or "git commit -a")');
    while (lines[lines.length - 1] === '') lines.pop();
    return lines.join('\n');
  };
  const short_ = short;

  const statLines = (before: Tree, after: Tree): { text: string; summary: string; modes: string[] } => {
    const paths = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().filter((p) => before[p] !== after[p]);
    const rows = paths.map((p) => {
      const s = stat(before[p] ?? '', after[p] ?? '');
      return { p, ...s };
    });
    const width = Math.max(0, ...rows.map((x) => x.p.length));
    const numW = Math.max(1, ...rows.map((x) => String(x.add + x.del).length));
    const text = rows.map((x) => ` ${x.p.padEnd(width)} | ${String(x.add + x.del).padStart(numW)} ${'+'.repeat(Math.min(x.add, 40))}${'-'.repeat(Math.min(x.del, 40))}`.replace(/ +$/, '')).join('\n');
    const add = rows.reduce((a, x) => a + x.add, 0), del = rows.reduce((a, x) => a + x.del, 0);
    let summary = ` ${rows.length} file${rows.length === 1 ? '' : 's'} changed`;
    if (add) summary += `, ${add} insertion${add === 1 ? '' : 's'}(+)`;
    if (del) summary += `, ${del} deletion${del === 1 ? '' : 's'}(-)`;
    if (!add && !del) summary += '';
    const modes: string[] = [];
    for (const p of paths) {
      if (!(p in before)) modes.push(` create mode 100644 ${p}`);
      else if (!(p in after)) modes.push(` delete mode 100644 ${p}`);
    }
    return { text, summary, modes };
  };

  const checkoutTree = (r: Repo, target: Tree): void => {
    // replace tracked files with the target tree; untracked files stay
    for (const p of Object.keys(r.index)) delete work[p];
    for (const [p, c] of Object.entries(target)) work[p] = c;
    r.index = { ...target };
  };

  const blockingChanges = (r: Repo, target: Tree): string[] => {
    const head = headTree(r);
    const bad: string[] = [];
    for (const p of new Set([...Object.keys(r.index), ...Object.keys(work)])) {
      const dirty = (r.index[p] !== work[p] && p in r.index) || r.index[p] !== head[p];
      if (dirty && head[p] !== target[p] ) bad.push(p);
    }
    return bad.sort();
  };

  const switchTo = (r: Repo, name: string, create: boolean, startAt?: string): void => {
    if (create) {
      if (r.branches[name]) return say(`fatal: a branch named '${name}' already exists`);
      const base = startAt ?? tipOf(r);
      if (!base) return say(`fatal: cannot create branch '${name}' without any commit yet`);
      r.branches[name] = base;
      r.head = { branch: name };
      return say(`Switched to a new branch '${name}'`);
    }
    if (r.head.branch === name) return say(`Already on '${name}'`);
    const id = r.branches[name];
    if (!id) {
      const asRev = resolveRev(r, name);
      if (asRev) return detach(r, asRev);
      return say(`fatal: invalid reference: ${name}`);
    }
    const target = treeOf(r, id);
    const bad = blockingChanges(r, target);
    if (bad.length) return say(`error: Your local changes to the following files would be overwritten by checkout:\n${bad.map((b) => '\t' + b).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`);
    checkoutTree(r, target);
    r.head = { branch: name };
    say(`Switched to branch '${name}'`);
    const up = r.upstream[name];
    if (up && r.tracking[up]) {
      if (r.tracking[up] === id) say(`Your branch is up to date with '${up}'.`);
    }
  };

  const detach = (r: Repo, id: string): void => {
    const bad = blockingChanges(r, treeOf(r, id));
    if (bad.length) return say(`error: Your local changes to the following files would be overwritten by checkout:\n${bad.map((b) => '\t' + b).join('\n')}\nPlease commit your changes or stash them before you switch branches.\nAborting`);
    checkoutTree(r, treeOf(r, id));
    r.head = { detached: id };
    say(`Note: switching to '${short(id)}'.

You are in 'detached HEAD' state. You can look around, make experimental
changes and commit them, and you can discard any commits you make in this
state without impacting any branches by switching back to a branch.

If you want to create a new branch to retain commits you create, you may
do so (now or later) by using -c with the switch command. Example:

  git switch -c <new-branch-name>

Or undo this operation with:

  git switch -

Turn off this advice by setting config variable advice.detachedHead to false

HEAD is now at ${short(id)} ${r.commits[id].message}`);
  };

  const moveHead = (r: Repo, id: string): void => {
    if (r.head.branch) r.branches[r.head.branch] = id;
    else r.head = { detached: id };
  };

  const logOrder = (r: Repo, starts: string[]): Commit[] => {
    const seen = new Set<string>();
    const list: Commit[] = [];
    const stack = [...starts];
    while (stack.length) {
      const x = stack.pop()!;
      if (seen.has(x)) continue;
      seen.add(x);
      list.push(r.commits[x]);
      stack.push(...r.commits[x].parents);
    }
    return list.sort((a, b) => b.n - a.n);
  };

  const formatCommit = (r: Repo, c: Commit, fmt: string): string =>
    fmt
      .replace(/%H/g, c.id).replace(/%h/g, short(c.id)).replace(/%s/g, c.message).replace(/%an/g, c.author).replace(/%ae/g, c.email)
      .replace(/%ad/g, fmtDate(c.n)).replace(/%d/g, decorations(r, c.id)).replace(/%n/g, '\n').replace(/%%/g, '%');

  /** ASCII commit graph (like `git log --graph`): each branch lane takes two characters. */
  const graphLines = (commits: Commit[], render: (c: Commit) => string): string[] => {
    const lines: string[] = [];
    let cols: string[] = [];
    for (const c of commits) {
      let idx = cols.indexOf(c.id);
      if (idx === -1) { cols.push(c.id); idx = cols.length - 1; }
      const [p1, p2] = c.parents;
      const newLane = !!p2 && !cols.includes(p2);
      // the commit line
      let line = '';
      cols.forEach((_, i) => { line += i === idx ? '* ' : '| '; if (i === idx && newLane) line += '  '; });
      lines.push(line + render(c));
      // lanes after this commit
      const next = cols.map((x) => (x === c.id ? p1 ?? '' : x));
      if (newLane) {
        next.splice(idx + 1, 0, p2);
        let l2 = '';
        cols.forEach((_, i) => { l2 += i < idx ? '| ' : i === idx ? '|\\' : '\\ '; });
        lines.push(l2.padEnd(2 * next.length, ' '));
      }
      // lanes that ended (root commits)
      for (let i = next.length - 1; i >= 0; i--) if (next[i] === '') next.splice(i, 1);
      // two lanes waiting for the same commit join into one
      for (let i = 1; i < next.length; i++) {
        const first = next.indexOf(next[i]);
        if (first !== i) {
          let l3 = '';
          next.forEach((_, k) => { l3 += k < i - 1 ? '| ' : k === i - 1 ? '|/' : k > i ? '| ' : ''; });
          lines.push(l3.padEnd(2 * next.length, ' '));
          next.splice(i, 1);
          i--;
        }
      }
      cols = next;
    }
    return lines;
  };

  const commitCmd = (r: Repo, args: string[]): void => {
    let msg: string | undefined, all = false, amend = false, noEdit = false;
    for (let i = 0; i < args.length; i++) {
      const a = args[i];
      if (a === '-m') msg = args[++i];
      else if (a.startsWith('-m') && a.length > 2 && !a.startsWith('--')) msg = a.slice(2);
      else if (a === '-am' || a === '-ma') { all = true; msg = args[++i]; }
      else if (a === '-a' || a === '--all') all = true;
      else if (a === '--amend') amend = true;
      else if (a === '--no-edit') noEdit = true;
      else if (a === '--allow-empty') { /* ok */ }
      else if (a.startsWith('--message=')) msg = a.slice(10);
    }
    if (all) {
      for (const p of Object.keys(r.index)) {
        if (r.merge?.conflicts.includes(p)) continue;
        if (!(p in work)) delete r.index[p];
        else r.index[p] = work[p];
      }
    }
    if (r.merge?.conflicts.length) {
      return say(`error: Committing is not possible because you have unmerged files.\nhint: Fix them up in the work tree, and then use 'git add/rm <file>'\nhint: as appropriate to mark resolution and make a commit.\nfatal: Exiting because of an unresolved conflict.`);
    }
    const head = headTree(r);
    const same = JSON.stringify(head) === JSON.stringify(r.index);
    if (r.merge) {
      const tip = tipOf(r)!;
      const c = newCommit(r, [tip, r.merge.head], msg ?? r.merge.message, r.index);
      moveHead(r, c.id);
      r.merge = undefined;
      return say(`[${r.head.branch ?? 'detached HEAD'} ${short(c.id)}] ${c.message}`);
    }
    if (amend) {
      const tip = tipOf(r);
      if (!tip) return say('fatal: You have nothing to amend.');
      const old = r.commits[tip];
      const c = newCommit(r, old.parents, msg ?? (noEdit || !msg ? old.message : msg), r.index);
      moveHead(r, c.id);
      const st = statLines(treeOf(r, old.parents[0]), r.index);
      say(`[${r.head.branch ?? 'detached HEAD'} ${short(c.id)}] ${c.message}\n Date: ${fmtDate(c.n)}\n${st.summary}${st.modes.length ? '\n' + st.modes.join('\n') : ''}`);
      return;
    }
    if (same && !args.includes('--allow-empty')) return say(statusText(r));
    if (msg === undefined || msg === '') return say('Aborting commit due to empty commit message.');
    const parent = tipOf(r);
    const c = newCommit(r, parent ? [parent] : [], msg, r.index);
    const st = statLines(head, r.index);
    moveHead(r, c.id);
    say(`[${r.head.branch ?? 'detached HEAD'} ${parent ? '' : '(root-commit) '}${short(c.id)}] ${msg}\n${st.summary}${st.modes.length ? '\n' + st.modes.join('\n') : ''}`);
  };

  const pathArgs = (args: string[]) => args.filter((a) => !a.startsWith('-'));

  const expandPaths = (r: Repo, specs: string[], universe: string[]): string[] => {
    const res = new Set<string>();
    for (const s of specs) {
      if (s === '.' || s === './') universe.forEach((p) => res.add(p));
      else if (s.endsWith('/')) universe.filter((p) => p.startsWith(s)).forEach((p) => res.add(p));
      else if (s.includes('*')) {
        const re = new RegExp('^' + s.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
        universe.filter((p) => re.test(p)).forEach((p) => res.add(p));
      } else if (universe.includes(s)) res.add(s);
      else if (universe.some((p) => p.startsWith(s + '/'))) universe.filter((p) => p.startsWith(s + '/')).forEach((p) => res.add(p));
    }
    void r;
    return [...res].sort();
  };

  const diffText = (before: Tree, after: Tree, only?: string[]): string => {
    const lines: string[] = [];
    const paths = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort().filter((p) => before[p] !== after[p] && (!only?.length || only.includes(p)));
    for (const p of paths) {
      const a = before[p], b = after[p];
      lines.push(`diff --git a/${p} b/${p}`);
      if (a === undefined) lines.push('new file mode 100644', `index 0000000..${hash40(b).slice(0, 7)}`, '--- /dev/null', `+++ b/${p}`);
      else if (b === undefined) lines.push('deleted file mode 100644', `index ${hash40(a).slice(0, 7)}..0000000`, `--- a/${p}`, '+++ /dev/null');
      else lines.push(`index ${hash40(a).slice(0, 7)}..${hash40(b).slice(0, 7)} 100644`, `--- a/${p}`, `+++ b/${p}`);
      lines.push(...unifiedHunks(splitLines(a ?? ''), splitLines(b ?? '')));
    }
    return lines.join('\n');
  };

  const doMerge = (r: Repo, args: string[]): void => {
    if (args.includes('--abort')) {
      if (!r.merge) return say('fatal: There is no merge to abort (MERGE_HEAD missing).');
      const tree = headTree(r);
      for (const p of Object.keys(work)) if (p in r.index || p in tree) delete work[p];
      for (const [p, c] of Object.entries(tree)) work[p] = c;
      r.index = { ...tree };
      r.merge = undefined;
      return;
    }
    const name = pathArgs(args)[0];
    const noFf = args.includes('--no-ff');
    if (!name) return say('fatal: No remote for the current branch.');
    const theirs = resolveRev(r, name);
    if (!theirs) return say(`merge: ${name} - not something we can merge`);
    const ours = tipOf(r);
    if (!ours) return say('fatal: cannot merge into an unborn branch');
    if (r.merge) return say('error: You have not concluded your merge (MERGE_HEAD exists).\nfatal: Exiting because of unfinished merge.');
    if (ancestors(r, ours).has(theirs)) return say('Already up to date.');
    const trackedDirty = trackedChanges(r);
    if (trackedDirty.staged.length || trackedDirty.unstaged.length) {
      const paths = [...new Set([...trackedDirty.staged, ...trackedDirty.unstaged].map((x) => x.path))];
      const incoming = Object.keys(treeOf(r, theirs)).filter((p) => treeOf(r, theirs)[p] !== treeOf(r, ours)[p]);
      const clash = paths.filter((p) => incoming.includes(p));
      if (clash.length) return say(`error: Your local changes to the following files would be overwritten by merge:\n${clash.map((p) => '\t' + p).join('\n')}\nPlease commit your changes or stash them before you merge.\nAborting`);
    }
    const label = r.branches[name] || r.tracking[name] ? (r.tracking[name] ? `remote-tracking branch '${name}'` : `branch '${name}'`) : `commit '${name}'`;
    const into = r.head.branch && r.head.branch !== 'main' && r.head.branch !== 'master' ? ` into ${r.head.branch}` : '';
    const message = `Merge ${label}${into}`;
    if (ancestors(r, theirs).has(ours) && !noFf) {
      const st = statLines(treeOf(r, ours), treeOf(r, theirs));
      say(`Updating ${short(ours)}..${short(theirs)}\nFast-forward${st.text ? '\n' + st.text : ''}\n${st.summary}${st.modes.length ? '\n' + st.modes.join('\n') : ''}`);
      checkoutTree(r, treeOf(r, theirs));
      moveHead(r, theirs);
      return;
    }
    const base = mergeBase(r, ours, theirs);
    const bt = treeOf(r, base), ot = treeOf(r, ours), tt = treeOf(r, theirs);
    const result: Tree = {};
    const conflicts: string[] = [];
    const logs: string[] = [];
    const oursName = r.head.branch ?? 'HEAD';
    for (const p of [...new Set([...Object.keys(bt), ...Object.keys(ot), ...Object.keys(tt)])].sort()) {
      const b = bt[p], o = ot[p], t = tt[p];
      if (o === t) { if (o !== undefined) result[p] = o; continue; }
      if (o === b) { if (t !== undefined) result[p] = t; continue; }
      if (t === b) { if (o !== undefined) result[p] = o; continue; }
      if (o === undefined || t === undefined) { conflicts.push(p); result[p] = (o ?? t)!; logs.push(`CONFLICT (modify/delete): ${p} deleted in ${o === undefined ? oursName : name} and modified in ${o === undefined ? name : oursName}.  Version ${o === undefined ? name : oursName} of ${p} left in tree.`); continue; }
      logs.push(`Auto-merging ${p}`);
      const m = merge3(b ?? '', o, t, oursName, name);
      result[p] = m.text;
      if (m.conflict) { conflicts.push(p); logs.push(`CONFLICT (${b === undefined ? 'add/add' : 'content'}): Merge conflict in ${p}`); }
    }
    if (conflicts.length) {
      for (const p of Object.keys(result)) work[p] = result[p];
      for (const p of Object.keys(ot)) if (!(p in result)) delete work[p];
      r.index = { ...ot, ...Object.fromEntries(Object.entries(result).filter(([p]) => !conflicts.includes(p))) };
      for (const p of conflicts) r.index[p] = ot[p] ?? '';
      r.merge = { head: theirs, name, conflicts, message };
      return say(`${logs.join('\n')}\nAutomatic merge failed; fix conflicts and then commit the result.`);
    }
    const c = newCommit(r, [ours, theirs], message, result);
    const st = statLines(ot, result);
    checkoutTree(r, result);
    moveHead(r, c.id);
    say(`${logs.join('\n')}${logs.length ? '\n' : ''}Merge made by the 'ort' strategy.${st.text ? '\n' + st.text : ''}\n${st.summary}${st.modes.length ? '\n' + st.modes.join('\n') : ''}`);
  };

  /* ---- the git command ---- */
  const git = (args: string[]): void => {
    const cmd = args[0];
    const rest = args.slice(1);
    if (cmd === undefined || cmd === '--help' || cmd === 'help') return say('usage: git [-v | --version] [-h | --help] <command> [<args>]\n\nCommon commands: init, status, add, commit, log, diff, branch, switch, merge, restore, reset, remote, push, pull');
    if (cmd === '--version' || cmd === 'version') return say('git version 2.43.0');
    if (cmd === 'init') {
      if (repo) { say(`Reinitialized existing Git repository in ${CWD}/.git/`); return; }
      const bi = rest.indexOf('-b'), bn = bi >= 0 ? rest[bi + 1] : rest.find((a) => a.startsWith('--initial-branch='))?.slice(17);
      repo = { commits: {}, branches: {}, head: { branch: bn ?? 'main' }, index: {}, work, config: {}, remotes: {}, remoteHeads: {}, tracking: {}, upstream: {}, tags: {}, stash: [], counter: 0 };
      return say(`Initialized empty Git repository in ${CWD}/.git/`);
    }
    if (cmd === 'config') {
      const r = repo;
      const keys = rest.filter((a) => !a.startsWith('--'));
      if (rest.includes('--list') || rest.includes('-l')) { const c = { ...(r?.config ?? globalConfig) }; return say(Object.entries(c).map(([k, v]) => `${k}=${v}`).join('\n')); }
      const target = rest.includes('--global') || !r ? globalConfig : r.config;
      if (keys.length >= 2) { target[keys[0]] = keys[1]; if (rest.includes('--global') && r) r.config[keys[0]] = keys[1]; return; }
      if (keys.length === 1) { const v = (r?.config ?? {})[keys[0]] ?? globalConfig[keys[0]]; if (v !== undefined) say(v); return; }
      return;
    }
    const r = need();
    if (!r) return;
    switch (cmd) {
      case 'status': {
        const s = rest.includes('-s') || rest.includes('--short');
        const t = statusText(r, s);
        return t ? say(t) : undefined;
      }
      case 'add': {
        const specs = pathArgs(rest);
        const allFlag = rest.includes('-A') || rest.includes('--all') || rest.includes('-u');
        if (!specs.length && allFlag) specs.push('.');
        if (!specs.length) return say("Nothing specified, nothing added.\nhint: Maybe you wanted to say 'git add .'?");
        const all = rest.includes('-A') || rest.includes('--all') || rest.includes('-u');
        const untrackedToo = !rest.includes('-u');
        const universe = [...new Set([...Object.keys(work).filter((p) => !ignored(p) && (untrackedToo || p in r.index)), ...Object.keys(r.index)])];
        const paths = all && !specs.length ? universe : expandPaths(r, specs, universe);
        if (!paths.length && !all) return say(`fatal: pathspec '${specs[0]}' did not match any files`);
        for (const p of paths) {
          if (p in work) r.index[p] = work[p];
          else delete r.index[p];
          r.merge && (r.merge.conflicts = r.merge.conflicts.filter((c) => c !== p));
        }
        return;
      }
      case 'rm': {
        const cached = rest.includes('--cached');
        const specs = pathArgs(rest);
        for (const p of expandPaths(r, specs, Object.keys(r.index))) {
          delete r.index[p];
          if (!cached) delete work[p];
          say(`rm '${p}'`);
        }
        if (!specs.length) say('fatal: No pathspec was given. Which files should I remove?');
        return;
      }
      case 'mv': {
        const [a, b] = pathArgs(rest);
        if (!a || !b || !(a in work)) return say(`fatal: bad source, source=${a}, destination=${b}`);
        work[b] = work[a]; delete work[a];
        if (a in r.index) { r.index[b] = r.index[a]; delete r.index[a]; }
        return;
      }
      case 'commit': return commitCmd(r, rest);
      case 'log': {
        let n = Infinity, oneline = false, graph = false, fmt: string | undefined, all = false;
        const revs: string[] = [];
        for (let i = 0; i < rest.length; i++) {
          const a = rest[i];
          if (a === '--oneline') oneline = true;
          else if (a === '--graph') graph = true;
          else if (a === '--all') all = true;
          else if (a === '-n') n = parseInt(rest[++i], 10);
          else if (/^-\d+$/.test(a)) n = parseInt(a.slice(1), 10);
          else if (a.startsWith('--pretty=') || a.startsWith('--format=')) { const v = a.slice(a.indexOf('=') + 1); fmt = v.startsWith('format:') ? v.slice(7) : v === 'oneline' ? '%h %s' : v; }
          else if (!a.startsWith('-')) revs.push(a);
        }
        const tip = tipOf(r);
        if (!tip && !all) return say(`fatal: your current branch '${r.head.branch}' does not have any commits yet`);
        const starts = all ? [...new Set([...Object.values(r.branches), ...Object.values(r.tags), ...Object.values(r.tracking), ...(tip ? [tip] : [])])] : revs.length ? revs.map((x) => resolveRev(r, x)).filter((x): x is string => !!x) : [tip!];
        if (revs.length && !starts.length) return say(`fatal: ambiguous argument '${revs[0]}': unknown revision or path not in the working tree.`);
        const commits = logOrder(r, starts).slice(0, n);
        const render = (c: Commit) => (fmt ? formatCommit(r, c, fmt) : oneline ? `${short(c.id)}${decorations(r, c.id)} ${c.message}` : '');
        if (graph) return say(graphLines(commits, render).join('\n'));
        if (fmt || oneline) return say(commits.map(render).join('\n'));
        return say(commits.map((c) => `commit ${c.id}${decorations(r, c.id)}${c.parents.length > 1 ? '' : ''}\nAuthor: ${c.author} <${c.email}>\nDate:   ${fmtDate(c.n)}\n\n    ${c.message}\n`).join('\n').replace(/\n$/, ''));
      }
      case 'show': {
        const id = resolveRev(r, pathArgs(rest)[0] ?? 'HEAD');
        if (!id) return say(`fatal: ambiguous argument '${pathArgs(rest)[0]}': unknown revision or path not in the working tree.`);
        const c = r.commits[id];
        return say(`commit ${c.id}${decorations(r, c.id)}\nAuthor: ${c.author} <${c.email}>\nDate:   ${fmtDate(c.n)}\n\n    ${c.message}\n${diffText(treeOf(r, c.parents[0]), c.tree) ? '\n' + diffText(treeOf(r, c.parents[0]), c.tree) : ''}`.replace(/\n$/, ''));
      }
      case 'diff': {
        const staged = rest.includes('--staged') || rest.includes('--cached');
        const stat_ = rest.includes('--stat');
        const specs = pathArgs(rest);
        const revs = specs.filter((s) => resolveRev(r, s.split('..')[0]) !== undefined && !(s in work));
        let before: Tree, after: Tree;
        let only: string[] = specs.filter((s) => !revs.includes(s));
        if (revs.length === 2 || (revs.length === 1 && revs[0].includes('..'))) {
          const [x, y] = revs.length === 2 ? revs : revs[0].split('..');
          before = treeOf(r, resolveRev(r, x)); after = treeOf(r, resolveRev(r, y));
        } else if (revs.length === 1) { before = treeOf(r, resolveRev(r, revs[0])); after = work; }
        else if (staged) { before = headTree(r); after = r.index; }
        else { before = r.index; after = Object.fromEntries(Object.entries(work).filter(([p]) => p in r.index)); }
        if (only.length) only = expandPaths(r, only, [...new Set([...Object.keys(before), ...Object.keys(after)])]);
        if (stat_) { const st = statLines(before, after); return st.summary.trim() ? say(`${st.text}\n${st.summary}`) : undefined; }
        const t = diffText(before, after, only.length ? only : undefined);
        return t ? say(t) : undefined;
      }
      case 'branch': {
        const flags = rest.filter((a) => a.startsWith('-'));
        const names = pathArgs(rest);
        if (flags.includes('-d') || flags.includes('-D') || flags.includes('--delete')) {
          for (const n of names) {
            if (!r.branches[n]) { say(`error: branch '${n}' not found.`); continue; }
            if (r.head.branch === n) { say(`error: Cannot delete branch '${n}' checked out at '${CWD}'`); continue; }
            const merged = ancestors(r, tipOf(r)!).has(r.branches[n]);
            if (!merged && !flags.includes('-D')) { say(`error: The branch '${n}' is not fully merged.\nIf you are sure you want to delete it, run 'git branch -D ${n}'.`); continue; }
            say(`Deleted branch ${n} (was ${short(r.branches[n])}).`);
            delete r.branches[n];
          }
          return;
        }
        if (flags.includes('-m') || flags.includes('-M')) {
          const [from, to] = names.length === 2 ? names : [r.head.branch!, names[0]];
          if (!r.branches[from] && r.head.branch !== from) return say(`error: refname refs/heads/${from} not found\nfatal: Branch rename failed`);
          r.branches[to] = r.branches[from]; delete r.branches[from];
          if (r.head.branch === from) r.head.branch = to;
          return;
        }
        if (names.length) {
          const tip = names[1] ? resolveRev(r, names[1]) : tipOf(r);
          if (!tip) return say(`fatal: not a valid object name: '${names[1] ?? r.head.branch}'`);
          if (r.branches[names[0]]) return say(`fatal: a branch named '${names[0]}' already exists`);
          r.branches[names[0]] = tip;
          return;
        }
        const rows = Object.keys(r.branches).sort().map((b) => `${b === r.head.branch ? '* ' : '  '}${b}${flags.includes('-v') || flags.includes('-vv') ? ` ${short(r.branches[b])} ${r.commits[r.branches[b]].message}` : ''}`);
        if (flags.includes('-a') || flags.includes('-r')) for (const t of Object.keys(r.tracking).sort()) rows.push(`  remotes/${t}`);
        if (!r.head.branch && tipOf(r)) rows.unshift(`* (HEAD detached at ${short(tipOf(r)!)})`);
        return rows.length ? say(rows.join('\n')) : undefined;
      }
      case 'switch':
      case 'checkout': {
        const flags = rest.filter((a) => a.startsWith('-'));
        const names = pathArgs(rest);
        if (cmd === 'checkout' && rest.includes('--')) {
          const files = rest.slice(rest.indexOf('--') + 1);
          for (const p of expandPaths(r, files, Object.keys(r.index))) work[p] = r.index[p];
          return;
        }
        if (flags.includes('-') || names[0] === '-') return say('fatal: no previous branch to switch to (not tracked in this practice terminal)');
        const create = flags.includes('-c') || flags.includes('-b') || flags.includes('-C') || flags.includes('-B') || flags.includes('--create');
        if (!names.length) return say('fatal: missing branch or commit argument');
        if (cmd === 'checkout' && !create && !r.branches[names[0]] && !resolveRev(r, names[0]) && names[0] in r.index) { work[names[0]] = r.index[names[0]]; return; }
        const start = create && names[1] ? resolveRev(r, names[1]) : undefined;
        return switchTo(r, names[0], create, start);
      }
      case 'restore': {
        const staged = rest.includes('--staged') || rest.includes('-S');
        const worktree = rest.includes('--worktree') || rest.includes('-W') || !staged;
        const srcIdx = rest.findIndex((a) => a === '--source' || a === '-s');
        const src = srcIdx >= 0 ? resolveRev(r, rest[srcIdx + 1]) : undefined;
        const specs = pathArgs(rest.filter((_a, i) => i !== srcIdx + 1 || srcIdx < 0));
        if (!specs.length) return say('fatal: you must specify path(s) to restore');
        const head = src ? treeOf(r, src) : headTree(r);
        const universe = [...new Set([...Object.keys(r.index), ...Object.keys(head), ...Object.keys(work)])];
        const paths = expandPaths(r, specs, universe);
        if (!paths.length) return say(`error: pathspec '${specs[0]}' did not match any file(s) known to git`);
        for (const p of paths) {
          if (staged) { if (p in head) r.index[p] = head[p]; else delete r.index[p]; }
          if (worktree && !staged) { const from = src ? head : r.index; if (p in from) work[p] = from[p]; else if (!src) delete work[p]; }
          if (worktree && staged) { const from = head; if (p in from) work[p] = from[p]; }
        }
        return;
      }
      case 'reset': {
        const mode = rest.includes('--hard') ? 'hard' : rest.includes('--soft') ? 'soft' : 'mixed';
        const specs = pathArgs(rest);
        const first = specs[0] ? resolveRev(r, specs[0]) : undefined;
        if (specs.length && !first) {
          // git reset <file>: unstage
          const head = headTree(r);
          for (const p of expandPaths(r, specs, [...new Set([...Object.keys(r.index), ...Object.keys(head)])])) { if (p in head) r.index[p] = head[p]; else delete r.index[p]; }
          return;
        }
        const target = first ?? tipOf(r);
        if (!target) return;
        const oldTracked = new Set([...Object.keys(r.index), ...Object.keys(headTree(r))]);
        moveHead(r, target);
        if (mode !== 'soft') r.index = { ...treeOf(r, target) };
        if (mode === 'hard') {
          for (const p of oldTracked) delete work[p];
          for (const [p, c] of Object.entries(r.index)) work[p] = c;
          r.merge = undefined;
          return say(`HEAD is now at ${short(target)} ${r.commits[target].message}`);
        }
        if (mode === 'mixed') {
          const u = trackedChanges(r).unstaged;
          if (u.length) say(`Unstaged changes after reset:\n${u.map((x) => `${x.kind === 'deleted' ? 'D' : 'M'}\t${x.path}`).join('\n')}`);
        }
        return;
      }
      case 'revert': {
        const spec = pathArgs(rest)[0] ?? 'HEAD';
        const id = resolveRev(r, spec);
        if (!id) return say(`fatal: bad revision '${spec}'`);
        const c = r.commits[id];
        const parent = treeOf(r, c.parents[0]);
        const cur = headTree(r);
        const tree: Tree = { ...cur };
        const clash: string[] = [];
        for (const p of new Set([...Object.keys(c.tree), ...Object.keys(parent)])) {
          if (c.tree[p] === parent[p]) continue;
          if (cur[p] !== c.tree[p]) { clash.push(p); continue; }
          if (p in parent) tree[p] = parent[p]; else delete tree[p];
        }
        if (clash.length) return say(`error: could not revert ${short(id)}... ${c.message}\nhint: after resolving the conflicts, mark them with\nhint: "git add/rm <pathspec>", then run\nhint: "git revert --continue".`);
        const nc = newCommit(r, [tipOf(r)!], `Revert "${c.message}"\n\nThis reverts commit ${c.id}.`.split('\n')[0], tree);
        const st = statLines(cur, tree);
        checkoutTree(r, tree);
        moveHead(r, nc.id);
        return say(`[${r.head.branch ?? 'detached HEAD'} ${short(nc.id)}] ${nc.message}\n Date: ${fmtDate(nc.n)}\n${st.summary}${st.modes.length ? '\n' + st.modes.join('\n') : ''}`);
      }
      case 'merge': return doMerge(r, rest);
      case 'stash': {
        const sub = rest[0] ?? 'push';
        if (sub === 'list') return say(r.stash.map((s, i) => `stash@{${i}}: WIP on ${s.branch}: ${short(s.base)} ${r.commits[s.base].message}`).reverse().map((_, i, arr) => arr[i]).join('\n').split('\n').reverse().join('\n'));
        if (sub === 'push' || sub === 'save' || sub.startsWith('-')) {
          const ch = trackedChanges(r);
          if (!ch.staged.length && !ch.unstaged.length) return say('No local changes to save');
          const base = tipOf(r)!;
          r.stash.push({ work: { ...work }, index: { ...r.index }, base, branch: r.head.branch ?? '(no branch)', message: '' });
          const ht = headTree(r);
          for (const p of Object.keys(r.index)) delete work[p];
          for (const [p, c] of Object.entries(ht)) work[p] = c;
          r.index = { ...ht };
          return say(`Saved working directory and index state WIP on ${r.head.branch ?? '(no branch)'}: ${short(base)} ${r.commits[base].message}`);
        }
        if (sub === 'pop' || sub === 'apply') {
          const s = sub === 'pop' ? r.stash.pop() : r.stash[r.stash.length - 1];
          if (!s) return say('No stash entries found.');
          const ht = headTree(r);
          for (const [p, c] of Object.entries(s.work)) if (s.index[p] !== undefined ? true : !(p in ht)) work[p] = c;
          for (const p of Object.keys(s.index)) if (s.work[p] !== undefined) work[p] = s.work[p];
          const t = statusText(r);
          say(t);
          if (sub === 'pop') say(`Dropped refs/stash@{${r.stash.length}} (${hash40('stash' + r.counter)})`);
          return;
        }
        if (sub === 'drop') { r.stash.pop(); return say(`Dropped refs/stash@{0} (${hash40('drop' + r.counter)})`); }
        return say(`error: unknown stash command '${sub}'`);
      }
      case 'tag': {
        const flags = rest.filter((a) => a.startsWith('-'));
        const names = pathArgs(rest).filter((_, i, arr) => !(flags.includes('-m') && i === arr.length - 1 && arr.length > 1 && false));
        if (flags.includes('-d')) { for (const n of names) { if (r.tags[n]) { say(`Deleted tag '${n}' (was ${short(r.tags[n])})`); delete r.tags[n]; } else say(`error: tag '${n}' not found.`); } return; }
        const tagName = names[0];
        if (!tagName) return Object.keys(r.tags).length ? say(Object.keys(r.tags).sort().join('\n')) : undefined;
        const tip = tipOf(r);
        if (!tip) return say('fatal: Failed to resolve \'HEAD\' as a valid ref.');
        if (r.tags[tagName]) return say(`fatal: tag '${tagName}' already exists`);
        r.tags[tagName] = names[1] ? resolveRev(r, names[1]) ?? tip : tip;
        return;
      }
      case 'remote': {
        const sub = rest[0];
        if (sub === 'add') { r.remotes[rest[1]] = rest[2]; return; }
        if (sub === 'remove' || sub === 'rm') { delete r.remotes[rest[1]]; return; }
        if (sub === 'set-url') { r.remotes[rest[1]] = rest[2]; return; }
        if (sub === 'get-url') return say(r.remotes[rest[1]] ?? `error: No such remote '${rest[1]}'`);
        const rows: string[] = [];
        for (const [k, v] of Object.entries(r.remotes)) { if (sub === '-v') { rows.push(`${k}\t${v} (fetch)`, `${k}\t${v} (push)`); } else rows.push(k); }
        return rows.length ? say(rows.join('\n')) : undefined;
      }
      case 'push': {
        const flags = rest.filter((a) => a.startsWith('-'));
        const pos = pathArgs(rest);
        const remote = pos[0] ?? 'origin';
        if (!r.remotes[remote]) return say(`fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.`);
        const branch = pos[1] ?? r.head.branch;
        if (!branch || !r.branches[branch]) return say(`error: src refspec ${branch ?? 'HEAD'} does not match any\nerror: failed to push some refs to '${r.remotes[remote]}'`);
        const heads = (r.remoteHeads[remote] ??= {});
        const local = r.branches[branch];
        const remoteTip = heads[branch];
        if (remoteTip === local) return say('Everything up-to-date');
        if (remoteTip && !ancestors(r, local).has(remoteTip) && !flags.includes('--force') && !flags.includes('-f')) {
          return say(`To ${r.remotes[remote]}\n ! [rejected]        ${branch} -> ${branch} (fetch first)\nerror: failed to push some refs to '${r.remotes[remote]}'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally. This is usually caused by another repository pushing\nhint: to the same ref. You may want to first integrate the remote changes\nhint: (e.g., 'git pull ...') before pushing again.`);
        }
        const line = remoteTip ? `   ${short(remoteTip)}..${short(local)}  ${branch} -> ${branch}` : ` * [new branch]      ${branch} -> ${branch}`;
        heads[branch] = local;
        r.tracking[`${remote}/${branch}`] = local;
        let text = `To ${r.remotes[remote]}\n${line}`;
        if (flags.includes('-u') || flags.includes('--set-upstream')) { r.upstream[branch] = `${remote}/${branch}`; text += `\nbranch '${branch}' set up to track '${remote}/${branch}'.`; }
        return say(text);
      }
      case 'fetch':
      case 'pull': {
        const pos = pathArgs(rest);
        const remote = pos[0] ?? 'origin';
        if (!r.remotes[remote]) return say(`fatal: '${remote}' does not appear to be a git repository\nfatal: Could not read from remote repository.\n\nPlease make sure you have the correct access rights\nand the repository exists.`);
        const heads = r.remoteHeads[remote] ?? {};
        const lines: string[] = [];
        for (const [b, id] of Object.entries(heads)) {
          const key = `${remote}/${b}`;
          if (r.tracking[key] !== id) {
            lines.push(r.tracking[key] ? `   ${short(r.tracking[key])}..${short(id)}  ${b}       -> ${key}` : ` * [new branch]      ${b}       -> ${key}`);
            r.tracking[key] = id;
          }
        }
        if (lines.length) say(`From ${r.remotes[remote]}\n${lines.join('\n')}`);
        if (cmd === 'pull') {
          const b = pos[1] ?? r.head.branch!;
          const key = `${remote}/${b}`;
          if (!r.tracking[key]) return say('fatal: Couldn\'t find remote ref ' + b);
          if (!lines.length && tipOf(r) === r.tracking[key]) return say('Already up to date.');
          return doMerge(r, [key]);
        }
        return;
      }
      case 'clone':
        return say('fatal: this practice terminal cannot download repositories. Use "git init" to start a repository here.');
      case 'reflog': {
        return say(logOrder(r, Object.values(r.branches)).map((c, i) => `${short(c.id)} HEAD@{${i}}: commit: ${c.message}`).join('\n'));
      }
      default:
        return say(`git: '${cmd}' is not a git command. See 'git --help'.`);
    }
  };

  const globalConfig: Record<string, string> = {};

  /* ---- shell commands ---- */
  const shell = (line: string): void => {
    const { tokens, error, redirect } = tokenize(line);
    if (error) return say(`bash: ${error}`);
    if (!tokens.length && !redirect) return;
    const [name, ...args] = tokens;
    const write = (text: string) => {
      if (redirect) {
        const prev = redirect.op === '>>' ? work[redirect.file] ?? '' : '';
        work[redirect.file] = prev + text;
      } else say(text.replace(/\n$/, ''));
    };
    switch (name) {
      case 'git': return git(args);
      case 'echo': {
        const noNl = args[0] === '-n';
        const text = (noNl ? args.slice(1) : args).join(' ').replace(/\\n/g, '\n');
        return write(text + (noNl ? '' : '\n'));
      }
      case 'printf': return write(args.join(' ').replace(/\\n/g, '\n'));
      case 'cat': {
        for (const f of args) { if (!(f in work)) say(`cat: ${f}: No such file or directory`); else write(work[f]); }
        return;
      }
      case 'ls': {
        const names = [...new Set(Object.keys(work).map((p) => (p.includes('/') ? p.split('/')[0] + '/' : p)))].filter((n) => !n.startsWith('.') || args.some((a) => a.includes('a'))).sort();
        return names.length ? say(names.join('  ')) : undefined;
      }
      case 'touch': { for (const f of args) if (!(f in work)) work[f] = ''; return; }
      case 'mkdir': return;
      case 'pwd': return say(CWD);
      case 'cd': return;
      case 'clear': return;
      case 'rm': {
        for (const f of args.filter((a) => !a.startsWith('-'))) { if (f in work) delete work[f]; else if (!args.includes('-f')) say(`rm: cannot remove '${f}': No such file or directory`); }
        return;
      }
      case 'mv': {
        const [a, b] = args.filter((x) => !x.startsWith('-'));
        if (!(a in work)) return say(`mv: cannot stat '${a}': No such file or directory`);
        work[b] = work[a]; delete work[a];
        return;
      }
      case 'cp': {
        const [a, b] = args.filter((x) => !x.startsWith('-'));
        if (!(a in work)) return say(`cp: cannot stat '${a}': No such file or directory`);
        work[b] = work[a];
        return;
      }
      case 'sed': {
        // sed -i 's/old/new/[g]' file
        const expr = args.find((a) => /^s(.).*\1.*\1g?$/.test(a));
        const file = args[args.length - 1];
        if (!expr || !(file in work)) return say(`sed: unsupported command (this terminal only supports: sed -i 's/old/new/' file)`);
        const d = expr[1];
        const parts = expr.slice(2).split(d);
        const re = new RegExp(parts[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), parts[2] === 'g' ? 'g' : '');
        work[file] = work[file].replace(re, parts[1]);
        return;
      }
      case 'head': case 'wc': case 'grep': return say(`bash: ${name}: not available in this practice terminal`);
      default: say(`bash: ${name}: command not found`);
    }
  };

  /* ---- run the script ---- */
  const lines = script.replace(/\r\n/g, '\n').split('\n');
  let pending = '';
  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    // a trailing backslash continues the line
    if (trimmed.endsWith('\\')) { pending += trimmed.slice(0, -1) + ' '; continue; }
    const full = (pending + trimmed).trim();
    pending = '';
    out.push(`$ ${full}`);
    // the pretend teammate used by the push / pull lessons: teammate <file> <text...>
    if (/^teammate\b/.test(full)) {
      const r = repo;
      if (!r || !Object.keys(r.remotes).length) { say('teammate: add a remote first (git remote add origin <url>)'); continue; }
      const [, file, ...text] = tokenize(full).tokens;
      const remote = Object.keys(r.remotes)[0];
      const heads = (r.remoteHeads[remote] ??= {});
      const b = r.head.branch ?? 'main';
      const tip = heads[b] ?? r.branches[b];
      const tree: Tree = { ...treeOf(r, tip), [file]: (treeOf(r, tip)[file] ?? '') + text.join(' ') + '\n' };
      const prevAuthor = r.config['user.name'];
      r.config['user.name'] = 'Teammate';
      const c = newCommit(r, tip ? [tip] : [], `Teammate edits ${file}`, tree);
      if (prevAuthor === undefined) delete r.config['user.name']; else r.config['user.name'] = prevAuthor;
      heads[b] = c.id;
      continue;
    }
    shell(full);
    if (out.length > 3000) { out.push('(output truncated)'); break; }
  }
  return { lines: out };
}
