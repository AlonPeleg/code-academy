import { useState } from 'react';
import type { QuizQuestion } from '../lib/types';
import { useT } from '../lib/i18n';

interface Props {
  questions: QuizQuestion[];
  best?: { best: number; total: number };
  onScore: (score: number, total: number) => void;
}

export default function Quiz({ questions, best, onScore }: Props) {
  const tr = useT();
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  if (!questions.length) return <p className="muted">{tr('No quiz for this lesson yet.')}</p>;

  const score = picked.filter((p, i) => p === questions[i].answer).length;
  const allAnswered = picked.every((p) => p !== null);

  const submit = () => {
    setSubmitted(true);
    onScore(score, questions.length);
  };
  const retry = () => {
    setPicked(questions.map(() => null));
    setSubmitted(false);
  };

  return (
    <div className="quiz">
      {best && <p className="muted small">{tr('Best score so far:')} {best.best}/{best.total}</p>}
      {questions.map((q, qi) => (
        <fieldset key={qi} className="question">
          <legend>
            <span className="qnum">{qi + 1}</span> {q.q}
          </legend>
          {q.options.map((opt, oi) => {
            const chosen = picked[qi] === oi;
            const state = submitted ? (oi === q.answer ? ' correct' : chosen ? ' wrong' : '') : chosen ? ' chosen' : '';
            return (
              <label key={oi} className={'option' + state}>
                <input type="radio" name={`q${qi}`} checked={chosen} disabled={submitted} onChange={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))} />
                <span>{opt}</span>
              </label>
            );
          })}
          {submitted && q.explain && <p className="explain">{q.explain}</p>}
        </fieldset>
      ))}
      {!submitted ? (
        <button className="btn primary" onClick={submit} disabled={!allAnswered}>{tr('Check answers')}</button>
      ) : (
        <div className="quiz-result">
          <strong>{tr('You got {score} of {total}.', { score, total: questions.length })}</strong>{' '}
          {score === questions.length ? tr('Perfect!') : tr('Review the explanations above and try again.')}
          <div><button className="btn ghost sm" onClick={retry}>{tr('Try again')}</button></div>
        </div>
      )}
    </div>
  );
}
