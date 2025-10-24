
export interface Question {
  question: string;
  questionType: 'number' | 'mcq';
  correctAnswer: number | string;
  options?: string[];
}

export interface QuizDocument {
  id: string;
  title: string;
  category: string;
  questions: Question[];
}

export interface Settings {
  shuffle: boolean;
  repeatWrong: boolean;
  repeatSet: number;
  useCustomNumpad: boolean;
}

export interface AnswerRecord {
  question: Question;
  userAnswer: number | string | null;
  attempts: (string | number)[];
  isCorrect: boolean;
}

export interface TestResult {
  date: string;
  time: string;
  score: string;
  correct: number;
  wrong: number;
  skipped: number;
  answers: AnswerRecord[];
}
