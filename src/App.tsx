import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CssBaseline, CircularProgress } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategoryCard } from './components/CategoryCard';
import { CategoryWithTopics } from './types/quiz';
import { quizApi } from './services/api';

const App: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithTopics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Загружаем данные при старте приложения
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSelectMode = (mode: 'test' | 'infinite', topicId: number | null) => {
    alert(`Режим: ${mode}. ID Темы: ${topicId || 'Все темы категории'}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
          Категории Квизов
        </Typography>
        
        {loading ? (
          // Пока данные "из БД" грузятся, показываем красивый спиннер от MUI
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {categories.map((category) => (
              <Grid item key={category.id} xs={12} sm={6} md={4}>
                {/* Не забудь обновить типы в самом CategoryCard (заменить string | null на number | null для топиков) */}
                <CategoryCard category={category} onSelectMode={handleSelectMode} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default App;