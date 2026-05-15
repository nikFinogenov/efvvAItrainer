import { Question, CategoryWithTopics } from '../types/test';
import { getCategoriesWithTopics } from '../data/mockData';

// Simulate network latency (e.g., 500ms) to mimic a real database fetch
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const API_URL = import.meta.env.VITE_API_URL;

export const testApi = {
  // Fetch all categories along with their respective topics
  getCategories: async (): Promise<CategoryWithTopics[]> => {
    await delay(500); 
    return getCategoriesWithTopics();
  },
  generateQuestions: async (topicTitle: string, count: number = 5): Promise<Question[]> => {
    try {
      const response = await fetch(`${API_URL}/generate-test`, { // Убедись, что на сервере эндпоинт тоже переименован
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topicTitle, count })
      });

      if (!response.ok) {
        throw new Error('AI Server is having a bad day');
      }

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  }

  // Future DB methods will go here:
  // getQuestionsByTopic: async (topicId: number) => { ... }
};