import React from 'react';
import { Card, CardContent, Typography, Button, Stack, Box, Chip } from '@mui/material';
import { CategoryWithTopics } from '../types/quiz';

interface CategoryCardProps {
  category: CategoryWithTopics;
  onSelectMode: (mode: 'test' | 'infinite', topicId: number | null) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onSelectMode }) => {
  return (
    <Card 
      sx={{ 
        width: 340,        // Fixed width for all cards
        height: 320,       // Fixed height for all cards
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        boxShadow: 3,
        borderRadius: 2,
        '&:hover .hover-overlay': { transform: 'translateY(0)' }
      }}
    >
      {/* Main Content (Visible by default) */}
      <CardContent 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          p: 3
        }}
      >
        <Box>
          <Typography variant="h5" component="div" gutterBottom fontWeight="bold">
            {category.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {category.description}
          </Typography>
        </Box>
        
        <Typography variant="caption" color="text.disabled" fontWeight="medium">
          Topics available: {category.topics.length}
        </Typography>
      </CardContent>

      {/* Hover Overlay */}
      <Box
        className="hover-overlay"
        sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.98)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: 3,
          transition: 'transform 0.25s ease-in-out',
          transform: 'translateY(100%)',
          zIndex: 2
        }}
      >
        <Typography variant="subtitle1" textAlign="center" fontWeight="bold" gutterBottom>
          Select category mode:
        </Typography>
        
        <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 3 }}>
          <Button variant="contained" size="small" onClick={() => onSelectMode('test', null)}>
            Take Test
          </Button>
          <Button variant="outlined" size="small" color="secondary" onClick={() => onSelectMode('infinite', null)}>
            Infinite
          </Button>
        </Stack>

        <Typography variant="subtitle2" textAlign="center" sx={{ mb: 1 }} color="text.secondary">
          Or choose a specific topic:
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center', maxHeight: 120, overflowY: 'auto', p: 0.5 }}>
          {category.topics.map((topic) => (
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