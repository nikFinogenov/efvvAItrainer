import { Category, Topic, CategoryWithTopics, Question } from '../types/test';

// --- 1. ТАБЛИЦА КАТЕГОРИЙ ---
export const mockCategories: Category[] = [
    {
        id: 1,
        title: 'Алгоритми та обчислювальна складність',
        description: '12'
    },
    {
        id: 2,
        title: "Архітектура комп'ютера",
        description: '10'
    },
    {
        id: 3,
        title: 'Бази та сховища даних',
        description: '12'
    },
    {
        id: 4,
        title: 'Інженерія систем і програмного забезпечення',
        description: '10'
    },
    {
        id: 5,
        title: 'Кібербезпека та захист інформації',
        description: '8'
    }, {
        id: 6,
        title: 'Прикладна математика',
        description: '16'
    }, {
        id: 7,
        title: "Комп'ютерні мережі та обмін даними",
        description: '6'
    }, {
        id: 8,
        title: 'Операційні системи',
        description: '10'
    }, {
        id: 9,
        title: 'Основи мов програмування',
        description: '10'
    }, {
        id: 10,
        title: 'Штучний інтелект',
        description: '6'
    },

];

// --- 2. ТАБЛИЦА ТЕМ (С внешними ключами) ---
export const mockTopics: Topic[] = [
    { id: 101, categoryId: 1, title: 'Основи структури даних і алгоритми' },
    { id: 102, categoryId: 1, title: 'Стратегії розроблення алгоритмів' },
    { id: 103, categoryId: 1, title: 'Моделі обчислень' },

    { id: 201, categoryId: 2, title: 'Функції бінарної логіки' },
    { id: 202, categoryId: 2, title: 'Подання даних на рівні машин' },
    { id: 203, categoryId: 2, title: "Пристрої введення - виведення.Поняття шини комп'ютера" },
    { id: 204, categoryId: 2, title: "Функціональна оршанізація обчислюванльних систем" },

    { id: 301, categoryId: 3, title: 'Ключі та нормалізація даних: основня нормальні форми (1NF, 2NF, 3NF, BCNF)' },
    { id: 302, categoryId: 3, title: 'Основні концепції систем баз даних' },
    { id: 303, categoryId: 3, title: 'Моделювання даних' },
    { id: 304, categoryId: 3, title: 'Реляційні бази даних' },
    { id: 305, categoryId: 3, title: 'Побудова запиту' },
    { id: 306, categoryId: 3, title: 'Обробка запитів' },

    { id: 401, categoryId: 4, title: 'Складні та великі системи' },
    { id: 402, categoryId: 4, title: 'Моделі систем' },
    { id: 403, categoryId: 4, title: 'Інформаційні системи' },
    { id: 404, categoryId: 4, title: 'Аналіз вимог' },
    { id: 405, categoryId: 4, title: 'Проєктування програмного забезпечення' },
    { id: 406, categoryId: 4, title: 'Реалізація програмного забезпеення' },
    { id: 407, categoryId: 4, title: 'Забезпечення якості' },
    { id: 408, categoryId: 4, title: 'Команлна робота, підходи до розробки ПЗ' },

    { id: 501, categoryId: 5, title: 'Основи кібербезпеки' },
    { id: 502, categoryId: 5, title: 'Кіберзагрози та кібератаки' },
    { id: 503, categoryId: 5, title: 'Безпека мережі' },

    { id: 601, categoryId: 6, title: 'Застосування методів математичного аналізу, аналітичної геометрії, лінійної алгебри в IT' },
    { id: 602, categoryId: 6, title: 'Дискретна математика' },
    { id: 603, categoryId: 6, title: "Застосування теорії ймовірностей та математичної статистики в IT" },
    { id: 604, categoryId: 6, title: "Диференційні рівняння" },

    { id: 701, categoryId: 7, title: "Класифікаця та функції комп'ютерних мереж" },
    { id: 702, categoryId: 7, title: 'Поняття протоколу та інтерфейсу, ієрархія протоколів, потік інформаціх в мережі. Еталонні моделі ISO/OSI та TCP/IP' },
    { id: 703, categoryId: 7, title: 'Інтернет речей' },

    { id: 801, categoryId: 8, title: "Прозначення операційних систем" },
    { id: 802, categoryId: 8, title: 'Файлові системи' },
    { id: 803, categoryId: 8, title: 'Основні команди командного рядку Linux та Windows' },

    { id: 901, categoryId: 9, title: 'Сутність і види мов програмування' },
    { id: 902, categoryId: 9, title: 'Принципи та сфера застосування видів програмування' },
    { id: 903, categoryId: 9, title: "Моделі паралельних обчислень: класифікаця Флінна" },
    { id: 904, categoryId: 9, title: "Трансляція та виконання: компілятор, інтерпретатор, компонувальник" },

    { id: 1001, categoryId: 10, title: "Фундаментальні поняття" },
    { id: 1002, categoryId: 10, title: 'Пошук у просторі станів та подання знань' },
    { id: 1003, categoryId: 10, title: 'Машинне навчання' },
];

// --- 3. ТАБЛИЦА ВОПРОСОВ ---
// const mockQuestions: Question[] = [
//     // JavaScript (Topic 101)
//     {
//         id: 1, topicId: 101, text: 'What is the output of "typeof null" in JavaScript?',
//         options: [
//             { id: 1, text: '"null"', isCorrect: false },
//             { id: 2, text: '"object"', isCorrect: true },
//             { id: 3, text: '"undefined"', isCorrect: false },
//             { id: 4, text: '"boolean"', isCorrect: false }
//         ],
//         explanation: 'In JavaScript, "typeof null" returning "object" is a long-standing bug in the language that cannot be fixed for web compatibility reasons.'
//     },
//     {
//         id: 2, topicId: 101, text: 'Which method is used to add an element at the end of an array?',
//         options: [
//             { id: 5, text: 'push()', isCorrect: true },
//             { id: 6, text: 'pop()', isCorrect: false },
//             { id: 7, text: 'shift()', isCorrect: false },
//             { id: 8, text: 'unshift()', isCorrect: false }
//         ],
//         explanation: 'In JavaScript, "typeof null" returning "object" is a long-standing bug in the language that cannot be fixed for web compatibility reasons.'

//     },
//     // React (Topic 102)
//     {
//         id: 3, topicId: 102, text: 'What is the purpose of the useEffect hook?',
//         options: [
//             { id: 9, text: 'To manage local state only', isCorrect: false },
//             { id: 10, text: 'To perform side effects in functional components', isCorrect: true },
//             { id: 11, text: 'To optimize re-renders automatically', isCorrect: false },
//             { id: 12, text: 'To navigate between pages', isCorrect: false }
//         ],
//         explanation: 'In JavaScript, "typeof null" returning "object" is a long-standing bug in the language that cannot be fixed for web compatibility reasons.'

//     },
//     // TypeScript (Topic 103)
//     {
//         id: 4, topicId: 103, text: 'Which keyword is used to create a custom type alias?',
//         options: [
//             { id: 13, text: 'interface', isCorrect: false },
//             { id: 14, text: 'typedef', isCorrect: false },
//             { id: 15, text: 'type', isCorrect: true },
//             { id: 16, text: 'class', isCorrect: false }
//         ],
//         explanation: 'In JavaScript, "typeof null" returning "object" is a long-standing bug in the language that cannot be fixed for web compatibility reasons.'

//     },
//     // Color Theory (Topic 202)
//     {
//         id: 5, topicId: 202, text: 'What are the three primary colors in the RYB color model?',
//         options: [
//             { id: 17, text: 'Red, Green, Blue', isCorrect: false },
//             { id: 18, text: 'Red, Yellow, Blue', isCorrect: true },
//             { id: 19, text: 'Cyan, Magenta, Yellow', isCorrect: false },
//             { id: 20, text: 'Orange, Green, Violet', isCorrect: false }
//         ],
//         explanation: 'In JavaScript, "typeof null" returning "object" is a long-standing bug in the language that cannot be fixed for web compatibility reasons.'

//     }
// ];

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
// export const testApiExtended = {
//     getQuestions: async (topicId: number | null, categoryId: number | null): Promise<Question[]> => {
//         // Имитируем задержку сети
//         await new Promise(resolve => setTimeout(resolve, 600));

//         // Если выбрана конкретная тема
//         if (topicId) {
//             return mockQuestions.filter(q => q.topicId === topicId);
//         }

//         // Если выбран "тест по всей категории"
//         if (categoryId) {
//             const topicIdsInCategory = mockTopics
//                 .filter(t => t.categoryId === categoryId)
//                 .map(t => t.id);

//             return mockQuestions.filter(q => topicIdsInCategory.includes(q.topicId));
//         }

//         return [];
//     }
// };