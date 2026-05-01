"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Module } from "@/lib/tutorial";
import type { Quiz } from "@/types";
import QuizPanel from "./QuizPanel";

type Progress = {
  completedQuizzes: Record<string, { score: number; total: number }>;
  visited: Record<string, boolean>;
};

const STORAGE_KEY = "karkas-course-progress-v1";

const emptyProgress: Progress = { completedQuizzes: {}, visited: {} };

function loadProgress(): Progress {
  if (typeof window === "undefined") return emptyProgress;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress;
    const parsed = JSON.parse(raw) as Progress;
    return {
      completedQuizzes: parsed.completedQuizzes ?? {},
      visited: parsed.visited ?? {},
    };
  } catch {
    return emptyProgress;
  }
}

function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

type View = "content" | "quiz";

export default function LearnApp({
  modules,
  quizzes,
}: {
  modules: Module[];
  quizzes: Record<string, Quiz>;
}) {
  const [activeSlug, setActiveSlug] = useState(modules[0].slug);
  const [view, setView] = useState<View>("content");
  const [progress, setProgress] = useState<Progress>(emptyProgress);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const activeIndex = useMemo(
    () => modules.findIndex((m) => m.slug === activeSlug),
    [modules, activeSlug],
  );
  const activeModule = modules[activeIndex];
  const activeQuiz = quizzes[activeSlug];

  useEffect(() => {
    setProgress((prev) => {
      if (prev.visited[activeSlug]) return prev;
      const next = { ...prev, visited: { ...prev.visited, [activeSlug]: true } };
      saveProgress(next);
      return next;
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [activeSlug]);

  function selectModule(slug: string) {
    setActiveSlug(slug);
    setView("content");
    setSidebarOpen(false);
  }

  function recordQuiz(score: number, total: number) {
    setProgress((prev) => {
      const next: Progress = {
        ...prev,
        completedQuizzes: {
          ...prev.completedQuizzes,
          [activeSlug]: { score, total },
        },
      };
      saveProgress(next);
      return next;
    });
  }

  function goPrev() {
    if (activeIndex > 0) selectModule(modules[activeIndex - 1].slug);
  }

  function goNext() {
    if (activeIndex < modules.length - 1) selectModule(modules[activeIndex + 1].slug);
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        progressCount={Object.keys(progress.completedQuizzes).length}
        total={modules.length}
        onMenuToggle={() => setSidebarOpen((v) => !v)}
      />
      <div className="flex-1 flex">
        <Sidebar
          modules={modules}
          activeSlug={activeSlug}
          onSelect={selectModule}
          progress={progress}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0">
          <div className="max-w-3xl mx-auto px-5 md:px-10 py-10">
            <ModuleHeader
              module={activeModule}
              view={view}
              onSetView={setView}
              hasQuiz={Boolean(activeQuiz)}
            />
            {view === "content" ? (
              <article className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeModule.content}</ReactMarkdown>
                <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-wrap items-center gap-3">
                  {activeQuiz ? (
                    <button
                      onClick={() => setView("quiz")}
                      className="rounded-md bg-[var(--accent)] text-white px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
                    >
                      Пройти квиз модуля →
                    </button>
                  ) : null}
                  <NavButtons
                    canPrev={activeIndex > 0}
                    canNext={activeIndex < modules.length - 1}
                    onPrev={goPrev}
                    onNext={goNext}
                  />
                </div>
              </article>
            ) : activeQuiz ? (
              <QuizPanel
                key={activeSlug}
                quiz={activeQuiz}
                onComplete={recordQuiz}
                onBackToContent={() => setView("content")}
                onNextModule={
                  activeIndex < modules.length - 1
                    ? () => selectModule(modules[activeIndex + 1].slug)
                    : undefined
                }
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

function TopBar({
  progressCount,
  total,
  onMenuToggle,
}: {
  progressCount: number;
  total: number;
  onMenuToggle: () => void;
}) {
  return (
    <header className="border-b border-[var(--border)] sticky top-0 z-30 bg-[var(--background)]/95 backdrop-blur">
      <div className="px-4 md:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="md:hidden rounded-md border border-[var(--border)] px-2 py-1 text-sm"
            onClick={onMenuToggle}
            aria-label="Меню курса"
          >
            ☰
          </button>
          <Link href="/" className="text-base font-semibold tracking-tight">
            Каркасник<span className="text-[var(--accent)]">.</span>курс
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
          <span>
            Пройдено: <strong className="text-[var(--foreground)]">{progressCount}</strong> / {total}
          </span>
          <Link href="/" className="hover:text-[var(--foreground)] transition">
            На главную
          </Link>
        </div>
      </div>
    </header>
  );
}

function Sidebar({
  modules,
  activeSlug,
  onSelect,
  progress,
  open,
  onClose,
}: {
  modules: Module[];
  activeSlug: string;
  onSelect: (slug: string) => void;
  progress: Progress;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
          aria-hidden
        />
      ) : null}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:sticky top-0 md:top-[57px] left-0 h-[100dvh] md:h-[calc(100dvh-57px)] w-72 z-40 md:z-auto bg-[var(--surface)] md:bg-transparent border-r border-[var(--border)] transition-transform overflow-y-auto sidebar-scroll`}
      >
        <nav className="p-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3 px-2">
            Модули
          </h2>
          <ul className="space-y-1">
            {modules.map((m) => {
              const isActive = m.slug === activeSlug;
              const result = progress.completedQuizzes[m.slug];
              const isVisited = progress.visited[m.slug];
              return (
                <li key={m.slug}>
                  <button
                    type="button"
                    onClick={() => onSelect(m.slug)}
                    className={`w-full text-left rounded-md px-3 py-2 flex items-center gap-3 transition ${
                      isActive
                        ? "bg-[var(--accent)] text-white"
                        : "hover:bg-[color-mix(in_srgb,var(--accent-soft)_30%,transparent)]"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-mono w-6 tabular-nums ${
                        isActive ? "text-white/80" : "text-[var(--accent)]"
                      }`}
                    >
                      {String(m.number).padStart(2, "0")}
                    </span>
                    <span className="text-sm flex-1 leading-snug">{m.short}</span>
                    {result ? (
                      <span
                        className={`text-[10px] font-medium ${
                          isActive ? "text-white" : "text-[var(--accent)]"
                        }`}
                        aria-label={`Квиз пройден на ${result.score}/${result.total}`}
                      >
                        {result.score}/{result.total}
                      </span>
                    ) : isVisited ? (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-white/70" : "bg-[var(--accent)]/60"
                        }`}
                        aria-label="Просмотрено"
                      />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

function ModuleHeader({
  module: m,
  view,
  onSetView,
  hasQuiz,
}: {
  module: Module;
  view: View;
  onSetView: (v: View) => void;
  hasQuiz: boolean;
}) {
  return (
    <div className="mb-8">
      <div className="text-xs font-mono text-[var(--accent)] mb-2">
        Модуль {String(m.number).padStart(2, "0")}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4">{m.title}</h1>
      <div className="inline-flex rounded-md border border-[var(--border)] p-0.5 bg-[var(--surface)]">
        <button
          type="button"
          onClick={() => onSetView("content")}
          className={`px-3 py-1.5 text-sm rounded-[5px] transition ${
            view === "content"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Материал
        </button>
        <button
          type="button"
          onClick={() => onSetView("quiz")}
          disabled={!hasQuiz}
          className={`px-3 py-1.5 text-sm rounded-[5px] transition disabled:opacity-40 ${
            view === "quiz"
              ? "bg-[var(--accent)] text-white"
              : "text-[var(--muted)] hover:text-[var(--foreground)]"
          }`}
        >
          Квиз
        </button>
      </div>
    </div>
  );
}

function NavButtons({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex gap-2 ml-auto">
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface)] transition disabled:opacity-40"
      >
        ← Предыдущий
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canNext}
        className="rounded-md border border-[var(--border)] px-3 py-2 text-sm hover:bg-[var(--surface)] transition disabled:opacity-40"
      >
        Следующий →
      </button>
    </div>
  );
}
