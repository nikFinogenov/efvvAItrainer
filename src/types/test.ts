export interface Topic {
  id: string;
  title: string;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}