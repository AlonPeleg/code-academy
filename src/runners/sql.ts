import initSqlJs, { type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import type { LogLine, RunOutput, SourceFile, SqlTable } from './types';

/** Sample database every SQL lesson starts with. Shown to learners in the "Sample data" panel. */
export const DEFAULT_SQL_SEED = `CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  city TEXT
);
CREATE TABLE courses (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  language TEXT,
  credits INTEGER
);
CREATE TABLE enrollments (
  student_id INTEGER,
  course_id INTEGER,
  grade INTEGER
);

INSERT INTO students VALUES
  (1, 'Ava', 21, 'Tel Aviv'),
  (2, 'Noam', 19, 'Haifa'),
  (3, 'Maya', 23, 'Tel Aviv'),
  (4, 'Omer', 20, 'Jerusalem'),
  (5, 'Lior', 22, 'Haifa'),
  (6, 'Dana', 19, 'Eilat'),
  (7, 'Yael', 24, NULL);

INSERT INTO courses VALUES
  (1, 'Intro to HTML', 'HTML', 2),
  (2, 'JavaScript Basics', 'JavaScript', 3),
  (3, 'Python for Everyone', 'Python', 4),
  (4, 'SQL Fundamentals', 'SQL', 3),
  (5, 'React in Practice', 'JavaScript', 4);

INSERT INTO enrollments VALUES
  (1, 1, 90), (1, 2, 85), (1, 5, 91),
  (2, 2, 70), (2, 3, 88),
  (3, 3, 95), (3, 4, 92),
  (4, 1, 60), (4, 4, 75),
  (5, 2, 80), (5, 5, 78),
  (6, 3, 82),
  (7, 4, NULL);
`;

let sqlPromise: Promise<SqlJsStatic> | null = null;
const getSql = () => (sqlPromise ??= initSqlJs({ locateFile: () => wasmUrl }));

const cell = (v: unknown) => (v === null || v === undefined ? 'NULL' : String(v));

export async function runSql(files: SourceFile[], ctx: { seed?: string }): Promise<RunOutput> {
  const start = performance.now();
  const SQL = await getSql();
  const db = new SQL.Database();
  const logs: LogLine[] = [];
  try {
    db.run(ctx.seed ?? DEFAULT_SQL_SEED);
    const results = db.exec(files[0].code);
    const tables: SqlTable[] = results.map((r) => ({ columns: r.columns, rows: r.values as SqlTable['rows'] }));
    let checkText = '';
    if (results.length) {
      const last = results[results.length - 1];
      checkText = [last.columns.join(' | '), ...last.values.map((row) => row.map(cell).join(' | '))].join('\n');
    } else {
      logs.push({ level: 'system', text: 'Query ran successfully. It did not return any rows.' });
    }
    return { ok: true, logs, tables, checkText, durationMs: performance.now() - start };
  } catch (e) {
    logs.push({ level: 'error', text: e instanceof Error ? e.message : String(e) });
    return { ok: false, logs };
  } finally {
    db.close();
  }
}
