import { Category } from '../types/quiz';

export const mockCategories: Category[] = [
  {
    id: 'programming',
    title: 'Программирование',
    description: 'Вопросы по веб-разработке и языкам программирования',
    topics: [
      { id: 'js', title: 'JavaScript' },
      { id: 'react', title: 'React & MUI' },
      { id: 'ts', title: 'TypeScript' }
    ]
  },
  {
    id: 'design',
    title: 'Дизайн',
    description: 'Интерфейсы, колористика и UX/UI практики',
    topics: [
      { id: 'ux', title: 'UX Аналитика' },
      { id: 'figma', title: 'Работа в Figma' }
    ]
  }
];