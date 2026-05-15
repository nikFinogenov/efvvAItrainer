// Тема (например: JavaScript). В БД это отдельная таблица.
export interface Topic {
  id: number;          # Первичный ключ (Primary Key) в БД
  categoryId: number;  # Внешний ключ (Foreign Key) для связи с категорией
  title: string;
}

// Категория (например: Программирование)
export interface Category {
  id: number;          # Первичный ключ (Primary Key)
  title: string;
  description: string;
}

// Специальный тип для интерфейса, где нам нужны категории сразу со своими темами
export interface CategoryWithTopics extends Category {
  topics: Topic[];
}