import React, { useState } from 'react';
import { Container, Box, CssBaseline, CircularProgress, Typography } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategoryList } from './components/CategoryList';
import { TestScreen } from './components/TestScreen';
import { ResultScreen } from './components/ResultScreen';
import { Question, Mode } from './types/test';
import { testApi } from './services/api';
import { mockCategories, mockTopics } from './data/mockData';

const App: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<{ mode: Mode; targetId: number | null } | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [questionsQueue, setQuestionsQueue] = useState<number[]>([]); // Очередь ID категорий для плана
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  // --- ЛОГИКА ТАКСОНОМИИ ---

  const generateTestPlan = () => {
    let plan: number[] = [];
    const TOTAL = 10;
    mockCategories.forEach(cat => {
      const count = Math.round(TOTAL * (parseInt(cat.description) / 100));
      for (let i = 0; i < count; i++) plan.push(cat.id);
    });
    return plan.sort(() => Math.random() - 0.5); // Перемешиваем
  };

  const fetchQuestionsBatch = async (categoryIds: number[]) => {
    const promises = categoryIds.map(async (catId) => {
      const topics = mockTopics.filter(t => t.categoryId === catId);
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      return testApi.generateQuestions(randomTopic.title, 1);
    });
    const results = await Promise.all(promises);
    return results.flat();
  };

  const handleSelectMode = async (mode: Mode, targetId: number | null) => {
    setIsGenerating(true);
    setFinalScore(null);
    let initialQuestions: Question[] = [];

    if (mode === 'FullTest') {
      const plan = generateTestPlan();
      const firstBatch = plan.slice(0, 10);
      initialQuestions = await fetchQuestionsBatch(firstBatch);
      setQuestionsQueue(plan.slice(10));
    } else if (mode === 'TopicInfinite' && targetId) {
      const topic = mockTopics.find(t => t.id === targetId);
      initialQuestions = await testApi.generateQuestions(topic!.title, 5);
    } else if (mode === 'CategoryInfinite' && targetId) {
      const catTopics = mockTopics.filter(t => t.categoryId === targetId);
      const randomTopic = catTopics[Math.floor(Math.random() * catTopics.length)];
      initialQuestions = await testApi.generateQuestions(randomTopic.title, 5);
    } else if (mode === 'FullInfinite') {
      const firstBatch = [1, 2, 3, 4, 5].map(() => Math.floor(Math.random() * 10) + 1);
      initialQuestions = await fetchQuestionsBatch(firstBatch);
    }

    setActiveQuestions(initialQuestions);
    setCurrentSession({ mode, targetId });
    setIsGenerating(false);
  };

  const loadMoreQuestions = async () => {
    if (isFetchingMore) return;
    setIsFetchingMore(true);

    let newBatch: Question[] = [];
    if (currentSession?.mode === 'FullTest' && questionsQueue.length > 0) {
      const batch = questionsQueue.slice(0, 5);
      newBatch = await fetchQuestionsBatch(batch);
      setQuestionsQueue(prev => prev.slice(5));
    } else if (currentSession?.mode === 'TopicInfinite') {
      const topic = mockTopics.find(t => t.id === currentSession.targetId);
      newBatch = await testApi.generateQuestions(topic!.title, 5);
    } else if (currentSession?.mode === 'CategoryInfinite' || currentSession?.mode === 'FullInfinite') {
      const catId = currentSession.mode === 'FullInfinite'
        ? Math.floor(Math.random() * 10) + 1
        : currentSession.targetId!;
      const topics = mockTopics.filter(t => t.categoryId === catId);
      newBatch = await testApi.generateQuestions(topics[Math.floor(Math.random() * topics.length)].title, 5);
    }

    setActiveQuestions(prev => [...prev, ...newBatch]);
    setIsFetchingMore(false);
  };

  const handleGoHome = () => {
    if (currentSession && finalScore === null) {
      if (!window.confirm("Прогрес буде втрачено. Вийти?")) return;
    }
    setCurrentSession(null);
    setFinalScore(null);
    setActiveQuestions([]);
  };

  return (
    <Box className="flex flex-col min-h-screen bg-gray-50">
      <CssBaseline />
      <Header onHomeClick={handleGoHome} />
      <Container component="main" className="grow py-10">
        {isGenerating ? (
          <Box className="flex flex-col items-center mt-20">
            <CircularProgress size={80} />
            <Typography variant="h5" className="mt-6 animate-pulse">Генерація тесту за таксономією...</Typography>
          </Box>
        ) : finalScore !== null ? (
          <ResultScreen score={finalScore} totalQuestions={activeQuestions.length} onRestart={handleGoHome} />
        ) : currentSession ? (
          <TestScreen
            questions={activeQuestions}
            mode={currentSession.mode}
            onTestEnd={setFinalScore}
            onExit={handleGoHome}
            onNeedMore={loadMoreQuestions}
          />
        ) : (
          <CategoryList onSelectMode={handleSelectMode} />
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default App;