import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Divider } from '@mui/material';
import { CategoryWithTopics, Mode } from '../types/test';
import SchoolIcon from '@mui/icons-material/School';

interface CategoryCardProps {
  category: CategoryWithTopics;
  onSelectMode: (mode: Mode, targetId: number | null) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelectMode }) => {
  return (
    <Card 
      className="w-full max-w-sm min-h-95 flex flex-col justify-between rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 bg-white group"
    >
      <CardContent className="grow p-6 flex flex-col">
        {/* Заголовок категории */}
        <Box className="flex items-start gap-3 mb-4">
          <Box className="p-2.5 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
            <SchoolIcon />
          </Box>
          <Box>
            <Typography variant="h6" className="font-bold text-gray-800 leading-snug">
              {category.title}
            </Typography>
            <Typography variant="caption" className="text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-md">
              Вага в іспиті: {category.description}%
            </Typography>
          </Box>
        </Box>

        <Divider className="my-2 opacity-50" />

        {/* СПИСОК ТОПИКОВ (ЧИПСЫ) */}
        <Typography variant="subtitle2" className="text-gray-400 font-bold uppercase tracking-wider text-[11px] mb-2 mt-2">
          Тренажер по топіках:
        </Typography>
        
        <Box className="flex flex-wrap gap-1.5 overflow-y-auto max-h-35 pr-1 grow content-start">
          {category.topics.map((topic) => (
            <Chip 
              key={topic.id} 
              label={topic.title} 
              clickable 
              // ✅ Передаем TopicInfinite вместо старого 'infinite'/'test'
              onClick={() => onSelectMode('TopicInfinite', topic.id)} 
              color="primary"
              variant="outlined"
              size="small"
              className="hover:bg-blue-50 text-xs py-1 transition-colors border-gray-200 text-gray-700"
            />
          ))}
        </Box>
      </CardContent>

      {/* КНОПКА КАТЕГОРИИ */}
      <Box className="p-6 pt-0">
        <Button 
          variant="contained" 
          fullWidth
          size="large"
          // ✅ Передаем CategoryInfinite для тренировки по всей категории
          onClick={() => onSelectMode('CategoryInfinite', category.id)}
          className="bg-gray-900 hover:bg-blue-600 text-white font-bold py-3 rounded-xl shadow-none capitalize transition-all duration-300"
        >
          Тренажер категорії
        </Button>
      </Box>
    </Card>
  );
};