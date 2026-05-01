import { getModules } from "@/lib/tutorial";
import { getAllQuizzes } from "@/content/quizzes";
import LearnApp from "@/components/LearnApp";

export const metadata = {
  title: "Каркасник.курс — туториал",
};

export default function LearnPage() {
  const modules = getModules();
  const quizzes = getAllQuizzes();

  return <LearnApp modules={modules} quizzes={quizzes} />;
}
