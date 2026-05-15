import React, { useState } from 'react';
import { Container, Grid, Typography, Box, CssBaseline } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategoryCard } from './components/CategoryCard';
import { mockCategories } from './data/mockData';

const App: React.FC = () => {
  // Временный обработчик для проверки работы кнопок
  const handleSelectMode = (mode: 'test' | 'infinite', topicId: string | null) => {
    alert(`Выбран режим: ${mode}. Тема ID: ${topicId || 'Все темы категории'}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline /> {/* Сброс стилей MUI */}
      <Header />
      
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
          Категории Квизов
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
          Наведите на категорию, чтобы выбрать режим игры или конкретную тему
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {mockCategories.map((category) => (
            <Grid item key={category.id} xs={12} sm={6} md={4}>
              <CategoryCard category={category} onSelectMode={handleSelectMode} />
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default App;