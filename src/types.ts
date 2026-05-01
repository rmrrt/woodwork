export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
};

export type Quiz = {
  moduleSlug: string;
  questions: QuizQuestion[];
};
