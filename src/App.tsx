import React, { useState, useRef } from 'react';
import { Container, Box, CircularProgress, Typography } from '@mui/material';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CategoryList } from './components/CategoryList';
import { TestScreen } from './components/TestScreen';
import { ResultScreen } from './components/ResultScreen';
import { Question, Mode } from './types/test';
import { testApi } from './services/api';
import { mockCategories, mockTopics } from './data/mockData';
import { t } from './utils/translations';
import { useSettings } from './context/AppContext';

const App: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<{ mode: Mode; targetId: number | null } | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<(Question | undefined)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); // Централизованный индекс
  
  const testPlanRef = useRef<number[]>([]); 
  const [isGenerating, setIsGenerating] = useState(false);
  const isFetchingMore = useRef(false); 
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const { lang } = useSettings();

  const generateTestPlan = () => {
    let plan: number[] = [];
    const TOTAL = 140; 
    mockCategories.forEach(cat => {
      const count = Math.round(TOTAL * (parseInt(cat.description) / 100));
      for (let i = 0; i < count; i++) plan.push(cat.id);
    });

    while (plan.length < 140) plan.push(mockCategories[0].id);
    if (plan.length > 140) plan = plan.slice(0, 140);

    return plan.sort(() => Math.random() - 0.5); 
  };

  const fetchQuestionsForIndices = async (tasks: { index: number; categoryId: number }[]) => {
    const promises = tasks.map(async (task) => {
      const topics = mockTopics.filter(t => t.categoryId === task.categoryId);
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const questions = await testApi.generateQuestions(randomTopic.title, 1);
      return { index: task.index, question: questions[0] };
    });
    return Promise.all(promises);
  };

  const handleSelectMode = async (mode: Mode, targetId: number | null) => {
    setIsGenerating(true);
    setFinalScore(null);
    setCurrentIndex(0); // Сброс индекса при старте любого режима
    let initialQuestions: (Question | undefined)[] = [];

    if (mode === 'FullTest') {
      const plan = generateTestPlan();
      testPlanRef.current = plan;
      initialQuestions = new Array(140).fill(undefined);
      
      const firstBatchTasks = plan.slice(0, 10).map((catId, idx) => ({ index: idx, categoryId: catId }));
      const fetchedResults = await fetchQuestionsForIndices(firstBatchTasks);
      
      fetchedResults.forEach(res => {
        if (res.question) initialQuestions[res.index] = res.question;
      });
    } else {
      // Для бесконечных режимов сразу генерируем пачку из 5 вопросов
      if (mode === 'TopicInfinite' && targetId) {
        const topic = mockTopics.find(t => t.id === targetId);
        initialQuestions = await testApi.generateQuestions(topic!.title, 5);
      } else if (mode === 'CategoryInfinite' && targetId) {
        const catTopics = mockTopics.filter(t => t.categoryId === targetId);
        const randomTopic = catTopics[Math.floor(Math.random() * catTopics.length)];
        initialQuestions = await testApi.generateQuestions(randomTopic.title, 5);
      } else if (mode === 'FullInfinite') {
        const firstBatch = [1, 2, 3, 4, 5].map(() => Math.floor(Math.random() * 10) + 1);
        const promises = firstBatch.map(catId => {
          const topics = mockTopics.filter(t => t.categoryId === catId);
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          return testApi.generateQuestions(randomTopic.title, 1);
        });
        const results = await Promise.all(promises);
        initialQuestions = results.flat();
      }
    }

    setActiveQuestions(initialQuestions);
    setCurrentSession({ mode, targetId });
    setIsGenerating(false);
  };

  const loadMoreQuestions = async (targetIndex: number) => {
    if (isFetchingMore.current) return;
    isFetchingMore.current = true;

    if (currentSession?.mode === 'FullTest') {
      const targetEndIndex = Math.min(targetIndex + 5, 139);
      const tasksToFetch: { index: number; categoryId: number }[] = [];
      
      for (let i = targetIndex; i <= targetEndIndex; i++) {
        if (!activeQuestions[i]) {
          tasksToFetch.push({ index: i, categoryId: testPlanRef.current[i] });
        }
      }

      if (tasksToFetch.length > 0) {
        try {
          const newQuestionsResults = await fetchQuestionsForIndices(tasksToFetch);
          setActiveQuestions(prev => {
            const updated = [...prev];
            newQuestionsResults.forEach(res => {
              if (res.question) updated[res.index] = res.question;
            });
            return updated;
          });
        } catch (error) {
          console.error("Ошибка генерации:", error);
        }
      }
    } else {
      // БЕСКОНЕЧНЫЙ РЕЖИМ
      try {
        let newBatch: Question[] = [];
        if (currentSession?.mode === 'TopicInfinite') {
          const topic = mockTopics.find(t => t.id === currentSession.targetId);
          newBatch = await testApi.generateQuestions(topic!.title, 5);
        } else if (currentSession?.mode === 'CategoryInfinite' || currentSession?.mode === 'FullInfinite') {
          const catId = currentSession.mode === 'FullInfinite'
            ? Math.floor(Math.random() * 10) + 1
            : currentSession.targetId!;
          const topics = mockTopics.filter(t => t.categoryId === catId);
          newBatch = await testApi.generateQuestions(topics[Math.floor(Math.random() * topics.length)].title, 5);
        }

        setActiveQuestions(prev => {
          if (prev.length >= 10) {
            // Отрезаем первые 5 старых вопросов, сдвигая буфер
            // И одновременно корректируем индекс в меньшую сторону
            setCurrentIndex(oldIndex => Math.max(0, oldIndex - 5));
            return [...prev.slice(5), ...newBatch];
          }
          return [...prev, ...newBatch];
        });
      } catch (error) {
        console.error("Ошибка бесконечной генерации:", error);
      }
    }

    isFetchingMore.current = false;
  };

  const handleGoHome = () => {
    if (currentSession && finalScore === null) {
      if (!window.confirm(t[lang].confirmExit)) return;
    }
    setCurrentSession(null);
    setFinalScore(null);
    setActiveQuestions([]);
    testPlanRef.current = [];
  };

  return (
    <Box className="flex flex-col min-h-screen">
      <Header onHomeClick={handleGoHome} />
      <Container component="main" className="grow py-10">
        {isGenerating ? (
          <Box className="flex flex-col items-center mt-20">
            <CircularProgress size={80} />
            <Typography variant="h5" className="mt-6 animate-pulse">{t[lang].aiLoading}</Typography>
          </Box>
        ) : finalScore !== null ? (
          <ResultScreen score={finalScore} totalQuestions={activeQuestions.filter(Boolean).length} onRestart={handleGoHome} />
        ) : currentSession ? (
          <TestScreen
            questions={activeQuestions}
            mode={currentSession.mode}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
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