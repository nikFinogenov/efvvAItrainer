export interface Topic {
  id: number;          // Primary Key in DB
  categoryId: number;  // Foreign Key linking to Category
  title: string;
}

export interface Category {
  id: number;          // Primary Key
  title: string;
  description: string;
}

// ⚠️ MAKE SURE THIS IS EXPORTED ⚠️
export interface CategoryWithTopics extends Category {
  topics: Topic[];
}

export interface AnswerOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  topicId: number;    // Foreign Key linking to Topic
  text: string;
  options: AnswerOption[];
}

export interface QuizSession {
  mode: 'test' | 'infinite';
  topicId: number | null;
  categoryId: number | null;
}