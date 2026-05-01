import Link from "next/link";

const modules = [
  { n: "01", title: "Введение и философия каркасного дома" },
  { n: "02", title: "Древесина: породы, сорта, влажность" },
  { n: "03", title: "Инструмент, крепёж и техника безопасности" },
  { n: "04", title: "Проектирование и расчёт нагрузок" },
  { n: "05", title: "Фундаменты для каркасных построек" },
  { n: "06", title: "Каркас стен (platform framing)" },
  { n: "07", title: "Перекрытия и кровля" },
  { n: "08", title: "Утепление, паро-, ветро- и шумоизоляция" },
  { n: "09", title: "Облицовка фасада" },
  { n: "10", title: "Внутренняя отделка и инженерия" },
  { n: "11", title: "Каркасная баня" },
  { n: "12", title: "Хозблок 3×6 м: практикум" },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">
            Каркасник<span className="text-[var(--accent)]">.</span>курс
          </span>
          <Link
            href="/learn"
            className="rounded-md bg-[var(--accent)] text-white px-4 py-2 text-sm font-medium hover:opacity-90 transition"
          >
            Начать обучение →
          </Link>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted)] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            Платформа практического обучения
          </span>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-6">
            От доски и шуруповёрта —
            <br />
            до собственной бани и&nbsp;дома.
          </h1>
          <p className="text-lg text-[var(--muted)] leading-relaxed mb-8 max-w-2xl">
            12 модулей по&nbsp;современному каркасному строительству. ГОСТ&nbsp;и&nbsp;СП РФ, скандинавская
            школа, узлы стен, кровли и&nbsp;изоляции, баня и&nbsp;хозблок «под&nbsp;ключ». Каждый
            модуль закрывается квизом из&nbsp;8&nbsp;вопросов.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/learn"
              className="rounded-md bg-[var(--accent)] text-white px-5 py-3 text-base font-medium hover:opacity-90 transition"
            >
              Открыть туториал
            </Link>
            <a
              href="#program"
              className="rounded-md border border-[var(--border)] px-5 py-3 text-base font-medium hover:bg-[var(--surface)] transition"
            >
              Программа курса
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <Stat value="12" label="модулей теории и практики" />
          <Stat value="96" label="вопросов в квизах" />
          <Stat value="2 800+" label="строк практического материала" />
        </div>
      </section>

      <section id="program" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Программа</h2>
        <p className="text-[var(--muted)] mb-10">
          Курс построен последовательно от&nbsp;материалов и&nbsp;инструмента до&nbsp;готовых построек.
        </p>
        <ul className="grid md:grid-cols-2 gap-3">
          {modules.map((m) => (
            <li
              key={m.n}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-4 py-4 flex items-center gap-4"
            >
              <span className="text-sm font-mono text-[var(--accent)] tabular-nums">{m.n}</span>
              <span className="text-sm">{m.title}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            href="/learn"
            className="rounded-md bg-[var(--accent)] text-white px-5 py-3 text-base font-medium hover:opacity-90 transition inline-block"
          >
            Перейти к&nbsp;первому модулю →
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-[var(--muted)] flex flex-wrap justify-between gap-4">
          <span>© Каркасник.курс — материалы под CC BY 4.0</span>
          <span>Опирается на СП 31-105-2002, СП 64.13330.2017, ГОСТ 8486-86 и др.</span>
        </div>
      </footer>
    </main>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold tracking-tight text-[var(--accent)] mb-1">{value}</div>
      <div className="text-sm text-[var(--muted)]">{label}</div>
    </div>
  );
}
