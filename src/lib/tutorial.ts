import fs from "node:fs";
import path from "node:path";

export type Module = {
  slug: string;
  number: number;
  title: string;
  short: string;
  content: string;
};

const MODULES: Array<{ file: string; title: string; short: string }> = [
  { file: "01-introduction.md", title: "Введение и философия каркасного строительства", short: "Введение" },
  { file: "02-materials.md", title: "Древесина: породы, сорта, влажность", short: "Древесина" },
  { file: "03-tools-safety.md", title: "Инструмент, крепёж и техника безопасности", short: "Инструмент и ТБ" },
  { file: "04-design-planning.md", title: "Проектирование и расчёт нагрузок", short: "Проектирование" },
  { file: "05-foundation.md", title: "Фундаменты для каркасных построек", short: "Фундамент" },
  { file: "06-frame.md", title: "Каркас стен (platform framing)", short: "Каркас" },
  { file: "07-roof.md", title: "Перекрытия и кровля", short: "Перекрытия и кровля" },
  { file: "08-insulation.md", title: "Утепление, паро-, ветро- и шумоизоляция", short: "Изоляция" },
  { file: "09-cladding.md", title: "Облицовка фасада", short: "Облицовка" },
  { file: "10-interior.md", title: "Внутренняя отделка и инженерия", short: "Отделка" },
  { file: "11-banya.md", title: "Каркасная баня: специфика и узлы", short: "Баня" },
  { file: "12-shed.md", title: "Хозблок 3×6 м: практикум", short: "Хозблок" },
];

const TUTORIAL_DIR = path.join(process.cwd(), "src", "content", "tutorial");

let cache: Module[] | null = null;

export function getModules(): Module[] {
  if (cache) return cache;

  cache = MODULES.map((m, idx) => {
    const raw = fs.readFileSync(path.join(TUTORIAL_DIR, m.file), "utf8");
    const stripped = stripNavigation(raw);
    return {
      slug: m.file.replace(/\.md$/, ""),
      number: idx + 1,
      title: m.title,
      short: m.short,
      content: stripped,
    };
  });

  return cache;
}

function stripNavigation(md: string): string {
  return md
    .split("\n")
    .filter((line) => !/^←\s*\[Модуль|^→\s*\[Модуль|^\[← К оглавлению\]|^\[↑ К оглавлению\]/.test(line.trim()))
    .filter((line) => !/^← \[.*\] · → \[.*\]/.test(line.trim()))
    .join("\n")
    .replace(/^---\s*$/gm, "")
    .trim();
}
