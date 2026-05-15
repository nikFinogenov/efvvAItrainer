import { Question } from '../types/quiz';

const mockQuestions: Question[] = [
  // JavaScript Questions (Topic 101)
  {
    id: 1,
    topicId: 101,
    text: 'Which company developed JavaScript?',
    options: [
      { id: 1, text: 'Netscape', isCorrect: true },
      { id: 2, text: 'Microsoft', isCorrect: false },
      { id: 3, text: 'Sun Microsystems', isCorrect: false },
      { id: 4, text: 'Oracle', isCorrect: false }
    ]
  },
  {
    id: 2,
    topicId: 101,
    text: 'Which of the following is NOT a JavaScript data type?',
    options: [
      { id: 5, text: 'String', isCorrect: false },
      { id: 6, text: 'Boolean', isCorrect: false },
      { id: 7, text: 'Float', isCorrect: true },
      { id: 8, text: 'Undefined', isCorrect: false }
    ]
  },
  // React Questions (Topic 102)
  {
    id: 3,
    topicId: 102,
    text: 'What is the purpose of React Virtual DOM?',
    options: [
      { id: 9, text: 'To directly manipulate the browser HTML', isCorrect: false },
      { id: 10, text: 'To optimize rendering performance by minimizing real DOM updates', isCorrect: true },
      { id: 11, text: 'To store data securely in the cloud', isCorrect: false },
      { id: 12, text: 'To handle backend routing', isCorrect: false }
    ]
  }
];

// Service functions to simulate DB queries
export const quizApiExtended = {
  // Simulates getting questions filtered by topic or category
  getQuestions: async (topicId: number | null, categoryId: number | null): Promise<Question[]> => {
    // Artificial delay for DB simulation
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (topicId) {
      return mockQuestions.filter(q => q.topicId === topicId);
    }
    if (categoryId) {
      // If category chosen, get all questions for topics inside that category
      const targetTopics = mockTopics.filter(t => t.categoryId === categoryId).map(t => t.id);
      return mockQuestions.filter(q => targetTopics.includes(q.topicId));
    }
    return mockQuestions; // fallback
  }
};

export const getCategoriesWithTopics = (): CategoryWithTopics[] => {
  return mockCategories.map(category => ({
    ...category,
    topics: mockTopics.filter(topic => topic.categoryId === category.id)
  }));
};