import { Category, Topic, CategoryWithTopics, Question } from '../types/quiz';

// --- 1. ТАБЛИЦА КАТЕГОРИЙ ---
const mockCategories: Category[] = [
  { 
    id: 1, 
    title: 'Frontend Development', 
    description: 'Master the art of building beautiful and performant user interfaces.' 
  },
  { 
    id: 2, 
    title: 'UI/UX Design', 
    description: 'Explore the principles of user-centered design, accessibility, and visual harmony.' 
  },
  { 
    id: 3, 
    title: 'Computer Science', 
    description: 'Deep dive into algorithms, data structures, and the foundations of computing.' 
  }
];

// --- 2. ТАБЛИЦА ТЕМ (С внешними ключами) ---
export const mockTopics: Topic[] = [
  // Topics for Frontend (Cat 1)
  { id: 101, categoryId: 1, title: 'JavaScript' },
  { id: 102, categoryId: 1, title: 'React & MUI' },
  { id: 103, categoryId: 1, title: 'TypeScript' },
  
  // Topics for Design (Cat 2)
  { id: 201, categoryId: 2, title: 'Typography' },
  { id: 202, categoryId: 2, title: 'Color Theory' },
  
  // Topics for CS (Cat 3)
  { id: 301, categoryId: 3, title: 'Data Structures' },
  { id: 302, categoryId: 3, title: 'Algorithms' }
];

// --- 3. ТАБЛИЦА ВОПРОСОВ ---
const mockQuestions: Question[] = [
  // JavaScript (Topic 101)
  {
    id: 1, topicId: 101, text: 'What is the output of "typeof null" in JavaScript?',
    options: [
      { id: 1, text: '"null"', isCorrect: false },
      { id: 2, text: '"object"', isCorrect: true },
      { id: 3, text: '"undefined"', isCorrect: false },
      { id: 4, text: '"boolean"', isCorrect: false }
    ]
  },
  {
    id: 2, topicId: 101, text: 'Which method is used to add an element at the end of an array?',
    options: [
      { id: 5, text: 'push()', isCorrect: true },
      { id: 6, text: 'pop()', isCorrect: false },
      { id: 7, text: 'shift()', isCorrect: false },
      { id: 8, text: 'unshift()', isCorrect: false }
    ]
  },
  // React (Topic 102)
  {
    id: 3, topicId: 102, text: 'What is the purpose of the useEffect hook?',
    options: [
      { id: 9, text: 'To manage local state only', isCorrect: false },
      { id: 10, text: 'To perform side effects in functional components', isCorrect: true },
      { id: 11, text: 'To optimize re-renders automatically', isCorrect: false },
      { id: 12, text: 'To navigate between pages', isCorrect: false }
    ]
  },
  // TypeScript (Topic 103)
  {
    id: 4, topicId: 103, text: 'Which keyword is used to create a custom type alias?',
    options: [
      { id: 13, text: 'interface', isCorrect: false },
      { id: 14, text: 'typedef', isCorrect: false },
      { id: 15, text: 'type', isCorrect: true },
      { id: 16, text: 'class', isCorrect: false }
    ]
  },
  // Color Theory (Topic 202)
  {
    id: 5, topicId: 202, text: 'What are the three primary colors in the RYB color model?',
    options: [
      { id: 17, text: 'Red, Green, Blue', isCorrect: false },
      { id: 18, text: 'Red, Yellow, Blue', isCorrect: true },
      { id: 19, text: 'Cyan, Magenta, Yellow', isCorrect: false },
      { id: 20, text: 'Orange, Green, Violet', isCorrect: false }
    ]
  }
];

// --- 4. API SERVICES (Имитация работы БД) ---

/**
 * Имитирует JOIN запрос: берет категории и "подтягивает" к ним соответствующие темы.
 */
export const getCategoriesWithTopics = (): CategoryWithTopics[] => {
  return mockCategories.map(category => ({
    ...category,
    topics: mockTopics.filter(topic => topic.categoryId === category.id)
  }));
};

/**
 * Имитирует сложный запрос с фильтрацией.
 * Позволяет получить вопросы либо по конкретной теме, либо по всей категории целиком.
 */
export const quizApiExtended = {
  getQuestions: async (topicId: number | null, categoryId: number | null): Promise<Question[]> => {
    // Имитируем задержку сети
    await new Promise(resolve => setTimeout(resolve, 600));

    // Если выбрана конкретная тема
    if (topicId) {
      return mockQuestions.filter(q => q.topicId === topicId);
    }

    // Если выбран "тест по всей категории"
    if (categoryId) {
      const topicIdsInCategory = mockTopics
        .filter(t => t.categoryId === categoryId)
        .map(t => t.id);
      
      return mockQuestions.filter(q => topicIdsInCategory.includes(q.topicId));
    }

    return [];
  }
};