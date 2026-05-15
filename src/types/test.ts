export type Mode = 
  | 'FullTest'          // Экзамен на 140 вопросов по всей таксономии
  | 'FullInfinite'      // Бесконечный микс по всем категориям
  | 'CategoryInfinite'  // Бесконечная тренировка по одной категории
  | 'TopicInfinite';    // Бесконечная тренировка по одному топику

export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  text: string;
  options: AnswerOption[];
  explanation: string;
}

export interface Topic {
  id: number;
  categoryId: number;
  title: string;
}

export interface Category {
  id: number;
  title: string;
  description: string; // Здесь храним процент (напр. "12")
}

export interface CategoryWithTopics extends Category {
  topics: Topic[];
}

export interface TestSession {
  mode: Mode;
  targetId: number | null; // ID категории или топика (null для Full режимов)
}