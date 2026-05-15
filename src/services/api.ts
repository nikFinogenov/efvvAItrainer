import { CategoryWithTopics } from '../types/quiz';
import { getCategoriesWithTopics } from '../data/mockData';

// Имитируем сетевую задержку (например, 500 миллисекунд)
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const quizApi = {
  // Получить все категории с темами
  getCategories: async (): Promise<CategoryWithTopics[]> => {
    await delay(500); // Ждем полсекунды, как будто идет запрос к БД
    return getCategoriesWithTopics();
  },

  // Сюда в будущем мы добавим методы:
  // getQuestionsByTopic: async (topicId: number) => { ... }
  // saveResult: async (userId: number, score: number) => { ... }
};