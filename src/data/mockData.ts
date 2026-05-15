import { Category, Topic, CategoryWithTopics } from '../types/quiz';

// Имитация таблицы "categories" в БД
const mockCategories: Category[] = [
  { id: 1, title: 'Программирование', description: 'Вопросы по веб-разработке и языкам программирования' },
  { id: 2, title: 'Дизайн', description: 'Интерфейсы, колористика и UX/UI практики' }
];

// Имитация таблицы "topics" в БД с foreign key (categoryId)
const mockTopics: Topic[] = [
  { id: 101, categoryId: 1, title: 'JavaScript' },
  { id: 102, categoryId: 1, title: 'React & MUI' },
  { id: 103, categoryId: 1, title: 'TypeScript' },
  { id: 201, categoryId: 2, title: 'UX Аналитика' },
  { id: 202, categoryId: 2, title: 'Работа в Figma' }
];

// Функция, которая собирает данные вместе (как это делал бы SQL-запрос с JOIN)
export const getCategoriesWithTopics = (): CategoryWithTopics[] => {
  return mockCategories.map(category => ({
    ...category,
    topics: mockTopics.filter(topic => topic.categoryId === category.id)
  }));
};