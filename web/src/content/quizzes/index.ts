import type { Quiz } from "@/types";
import q01 from "./01-introduction";
import q02 from "./02-materials";
import q03 from "./03-tools-safety";
import q04 from "./04-design-planning";
import q05 from "./05-foundation";
import q06 from "./06-frame";
import q07 from "./07-roof";
import q08 from "./08-insulation";
import q09 from "./09-cladding";
import q10 from "./10-interior";
import q11 from "./11-banya";
import q12 from "./12-shed";

const quizzes: Record<string, Quiz> = Object.fromEntries(
  [q01, q02, q03, q04, q05, q06, q07, q08, q09, q10, q11, q12].map((q) => [q.moduleSlug, q]),
);

export function getQuiz(slug: string): Quiz | undefined {
  return quizzes[slug];
}

export function getAllQuizzes(): Record<string, Quiz> {
  return quizzes;
}
