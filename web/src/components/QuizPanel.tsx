"use client";

import { useMemo, useState } from "react";
import type { Quiz } from "@/types";

type AnswerState = number | null;

export default function QuizPanel({
  quiz,
  onComplete,
  onBackToContent,
  onNextModule,
}: {
  quiz: Quiz;
  onComplete: (score: number, total: number) => void;
  onBackToContent: () => void;
  onNextModule?: () => void;
}) {
  const total = quiz.questions.length;
  const [answers, setAnswers] = useState<AnswerState[]>(() => Array(total).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () =>
      submitted
        ? answers.reduce<number>(
            (acc, ans, i) => (ans === quiz.questions[i].correctIndex ? acc + 1 : acc),
            0,
          )
        : 0,
    [submitted, answers, quiz.questions],
  );

  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === total;

  function setAnswer(qIndex: number, optIndex: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optIndex;
      return next;
    });
  }

  function handleSubmit() {
    if (!allAnswered) return;
    setSubmitted(true);
    const computed = answers.reduce<number>(
      (acc, ans, i) => (ans === quiz.questions[i].correctIndex ? acc + 1 : acc),
      0,
    );
    onComplete(computed, total);
  }

  function handleRetry() {
    setAnswers(Array(total).fill(null));
    setSubmitted(false);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="text-sm text-[var(--muted)]">
          {submitted
            ? `Результат: ${score} из ${total}`
            : `Отвечено: ${answeredCount} из ${total}`}
        </div>
        <div className="h-1.5 flex-1 max-w-xs bg-[var(--border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--accent)] transition-all"
            style={{
              width: `${((submitted ? total : answeredCount) / total) * 100}%`,
            }}
          />
        </div>
      </div>

      <ol className="space-y-6">
        {quiz.questions.map((q, qi) => {
          const selected = answers[qi];
          const correct = q.correctIndex;
          const isCorrect = submitted && selected === correct;
          const isWrong = submitted && selected !== null && selected !== correct;

          return (
            <li
              key={qi}
              className={`rounded-lg border p-5 ${
                submitted
                  ? isCorrect
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-red-500/50 bg-red-500/5"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-sm font-mono text-[var(--accent)] tabular-nums mt-0.5">
                  {String(qi + 1).padStart(2, "0")}
                </span>
                <p className="text-base font-medium leading-relaxed">{q.question}</p>
              </div>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isAnswer = oi === correct;
                  let cls =
                    "block w-full text-left px-4 py-3 rounded-md border text-sm transition cursor-pointer";
                  if (submitted) {
                    if (isAnswer) {
                      cls +=
                        " border-green-500 bg-green-500/10 text-[var(--foreground)]";
                    } else if (isSelected && !isAnswer) {
                      cls +=
                        " border-red-500 bg-red-500/10 text-[var(--foreground)]";
                    } else {
                      cls +=
                        " border-[var(--border)] text-[var(--muted)]";
                    }
                  } else if (isSelected) {
                    cls +=
                      " border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent-soft)_25%,transparent)]";
                  } else {
                    cls +=
                      " border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface)]";
                  }
                  return (
                    <button
                      key={oi}
                      type="button"
                      onClick={() => setAnswer(qi, oi)}
                      disabled={submitted}
                      className={cls}
                    >
                      <span className="font-mono text-xs text-[var(--accent)] mr-2">
                        {String.fromCharCode(65 + oi)}.
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation ? (
                <div
                  className={`mt-4 text-sm leading-relaxed border-l-2 pl-3 ${
                    isWrong
                      ? "border-red-500 text-[var(--foreground)]"
                      : "border-[var(--accent)] text-[var(--muted)]"
                  }`}
                >
                  <strong className="text-[var(--foreground)]">Пояснение:</strong> {q.explanation}
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
        {!submitted ? (
          <>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="rounded-md bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition disabled:opacity-40"
            >
              Проверить ответы
            </button>
            <button
              type="button"
              onClick={onBackToContent}
              className="rounded-md border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition"
            >
              Вернуться к материалу
            </button>
          </>
        ) : (
          <>
            <ResultBadge score={score} total={total} />
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-md border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition"
            >
              Пройти заново
            </button>
            <button
              type="button"
              onClick={onBackToContent}
              className="rounded-md border border-[var(--border)] px-4 py-2.5 text-sm hover:bg-[var(--surface)] transition"
            >
              К материалу
            </button>
            {onNextModule ? (
              <button
                type="button"
                onClick={onNextModule}
                className="ml-auto rounded-md bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
              >
                К следующему модулю →
              </button>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function ResultBadge({ score, total }: { score: number; total: number }) {
  const pct = (score / total) * 100;
  const tone =
    pct === 100
      ? "bg-green-500/15 text-green-700 dark:text-green-300 border-green-500/40"
      : pct >= 75
        ? "bg-[color-mix(in_srgb,var(--accent-soft)_50%,transparent)] text-[var(--accent)] border-[var(--accent)]/40"
        : "bg-red-500/10 text-red-600 dark:text-red-300 border-red-500/40";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium ${tone}`}
    >
      {score} / {total}
      {pct === 100 ? " — отлично!" : pct >= 75 ? " — зачёт" : " — повторите"}
    </span>
  );
}
