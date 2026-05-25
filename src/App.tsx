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
  
  // Храним план категорий для всех 140 вопросов, чтобы знать, 
  // какую категорию генерировать для конкретного индекса
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

    while (plan.length < 140) {
      plan.push(mockCategories[0].id);
    }
    if (plan.length > 140) {
      plan = plan.slice(0, 140);
    }

    return plan.sort(() => Math.random() - 0.5); 
  };

  // Изменили сигнатуру: теперь передаем массив объектов с жесткой привязкой к индексу
  const fetchQuestionsForIndices = async (tasks: { index: number; categoryId: number }[]) => {
    const promises = tasks.map(async (task) => {
      const topics = mockTopics.filter(t => t.categoryId === task.categoryId);
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const questions = await testApi.generateQuestions(randomTopic.title, 1);
      return {
        index: task.index,
        question: questions[0] // Достаем один сгенерированный вопрос
      };
    });
    return Promise.all(promises);
  };

  const handleSelectMode = async (mode: Mode, targetId: number | null) => {
    setIsGenerating(true);
    setFinalScore(null);
    let initialQuestions: (Question | undefined)[] = [];

    if (mode === 'FullTest') {
      const plan = generateTestPlan();
      testPlanRef.current = plan; // Сохраняем план на все 140 вопросов

      // Создаем пустой каркас
      initialQuestions = new Array(140).fill(undefined);
      
      // Сразу готовим задачи на загрузку первых 10 вопросов согласно плану
      const firstBatchTasks = plan.slice(0, 10).map((catId, idx) => ({
        index: idx,
        categoryId: catId
      }));

      const fetchedResults = await fetchQuestionsForIndices(firstBatchTasks);
      
      // Раскладываем по местам
      fetchedResults.forEach(res => {
        if (res.question) initialQuestions[res.index] = res.question;
      });

    } else if (mode === 'TopicInfinite' && targetId) {
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

    setActiveQuestions(initialQuestions);
    setCurrentSession({ mode, targetId });
    setIsGenerating(false);
  };

  const loadMoreQuestions = async (targetIndex: number) => {
    if (isFetchingMore.current) return;
    isFetchingMore.current = true;

    if (currentSession?.mode === 'FullTest') {
      // Нам нужно проверить диапазон от текущего кликнутого/активного индекса до +5 вперед
      const targetEndIndex = Math.min(targetIndex + 5, 139);
      
      // Собираем задачи: какой индекс пустует и какая категория ему нужна по плану
      const tasksToFetch: { index: number; categoryId: number }[] = [];
      
      for (let i = targetIndex; i <= targetEndIndex; i++) {
        if (!activeQuestions[i]) {
          tasksToFetch.push({
            index: i,
            categoryId: testPlanRef.current[i] // Берем категорию строго для этого индекса!
          });
        }
      }

      if (tasksToFetch.length > 0) {
        try {
          const newQuestionsResults = await fetchQuestionsForIndices(tasksToFetch);

          setActiveQuestions(prev => {
            const updated = [...prev];
            newQuestionsResults.forEach(res => {
              if (res.question) {
                updated[res.index] = res.question; // Вставляем строго в свой индекс
              }
            });
            return updated;
          });
        } catch (error) {
          console.error("Ошибка при подгрузке вопросов:", error);
        }
      }
    } else {
      // Логика бесконечных режимов (простой пуш в конец)
      let newBatch: Question[] = [];
      if (currentSession?.mode === 'TopicInfinite') {
        const topic = mockTopics.find(t => t.id === currentSession.targetId);
        newBatch = await testApi.generateQuestions(topic!.title, 5);
      } else if (currentSession?.mode === 'CategoryInfinite' || currentSession?.mode === 'FullInfinite') {
        const catId = currentSession.mode === 'FullInfinite'
          ? Math.floor(Math.random() * 10) + 1
          : currentSession.targetId!;
        const topics = mockTopics.filter(t => t.categoryId === catId);
        newBatch = await testApi.generateQuestions(
          topics[Math.floor(Math.random() * topics.length)].title, 5
        );
      }
      setActiveQuestions(prev => [...prev, ...newBatch]);
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