import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, CssBaseline, CircularProgress } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategoryCard } from './components/CategoryCard';
import { QuizScreen } from './components/QuizScreen';
import { ResultScreen } from './components/ResultScreen';
import { CategoryWithTopics, Question, QuizSession } from './types/quiz';
import { quizApi } from './services/api';
import { quizApiExtended } from './data/mockData';

const App: React.FC = () => {
  const [categories, setCategories] = useState<CategoryWithTopics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // App navigation state
  const [currentSession, setCurrentSession] = useState<QuizSession | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [quizLoading, setQuizLoading] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await quizApi.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelectMode = async (mode: 'test' | 'infinite', topicId: number | null, categoryId: number = 1) => {
    try {
      setQuizLoading(true);
      setCurrentSession({ mode, topicId, categoryId });
      setFinalScore(null);
      
      // Fetch matching questions as if calling a database route
      const questions = await quizApiExtended.getQuestions(topicId, topicId ? null : categoryId);
      setActiveQuestions(questions);
    } catch (e) {
      console.error("Failed to load questions", e);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleQuizEnd = (score: number) => {
    setFinalScore(score);
  };

  const handleExitQuiz = () => {
    setCurrentSession(null);
    setActiveQuestions([]);
    setFinalScore(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <Header />
      
      <Container component="main" sx={{ mt: 6, mb: 6, flexGrow: 1 }}>
        {loading || quizLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : finalScore !== null ? (
          // 1. SHOW RESULT SCREEN
          <ResultScreen score={finalScore} totalQuestions={activeQuestions.length} onRestart={handleExitQuiz} />
        ) : currentSession ? (
          // 2. SHOW GAME SCREEN
          <QuizScreen 
            questions={activeQuestions} 
            mode={currentSession.mode} 
            onQuizEnd={handleQuizEnd} 
            onExit={handleExitQuiz} 
          />
        ) : (
          // 3. SHOW DEFAULT MAIN CATEGORIES SCREEN
          <>
            <Typography variant="h3" component="h1" align="center" gutterBottom fontWeight="bold">
              Quiz Categories
            </Typography>
            <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
              Hover over a category to choose your game mode or a specific topic
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {categories.map((category) => (
                <Grid item key={category.id}>
                  {/* Passing category.id dynamically here */}
                  <CategoryCard 
                    category={category} 
                    onSelectMode={(mode, topicId) => handleSelectMode(mode, topicId, category.id)} 
                  />
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default App;