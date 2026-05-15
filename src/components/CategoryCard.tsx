import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Box, Chip } from '@mui/material';
import { Category, Topic } from '../types/quiz';

interface CategoryCardProps {
  category: Category;
  onSelectMode: (mode: 'test' | 'infinite', topicId: string | null) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelectMode }) => {
  return (
    <Card 
      sx={{ 
        height: 280, 
        position: 'relative', 
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover .hover-overlay': { transform: 'translateY(0)' } // Эффект выезжания при ховере
      }}
    >
      {/* Основной контент карточки (виден изначально) */}
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" component="div" gutterBottom>
            {category.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.disabled">
          Доступно тем: {category.topics.length}
        </Typography>
      </CardContent>

      {/* Оверлей при ховере */}
      <Box
        className="hover-overlay"
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 2,
          transition: 'transform 0.3s ease-in-out',
          transform: 'translateY(100%)', // Изначально спрятан внизу
        }}
      >
        <Typography variant="subtitle1" textAlign="center" fontWeight="bold" gutterBottom>
          Выберите режим для всей категории:
        </Typography>
        
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
          <Button variant="contained" size="small" onClick={() => onSelectMode('test', null)}>
            Пройти тест
          </Button>
          <Button variant="outlined" size="small" color="secondary" onClick={() => onSelectMode('infinite', null)}>
            Бесконечный
          </Button>
        </Stack>

        <Typography variant="subtitle2" textAlign="center" sx={{ mt: 1, mb: 1 }}>
          Или выберите конкретную тему:
        </Typography>

        {/* Список тем в виде кликабельных чипсов */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
          {category.topics.map((topic: Topic) => (
            <Chip 
              key={topic.id} 
              label={topic.title} 
              clickable 
              onClick={() => onSelectMode('test', topic.id)}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
      </Box>
    </Card>
  );
};