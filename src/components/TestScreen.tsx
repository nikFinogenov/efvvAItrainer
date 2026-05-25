import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Divider, Collapse, Alert, CircularProgress } from '@mui/material';
import { Question, Mode } from '../types/test';
import { t } from '../utils/translations';
import { useSettings } from '../context/AppContext';
// import AddIcon from '@mui/icons-material/Add'; // Если используешь иконки, или просто текстом

interface TestScreenProps {
  questions: (Question | undefined)[];
  mode: Mode;
  onTestEnd: (score: number) => void;
  onExit: () => void;
  onNeedMore: (targetIndex: number) => void;
}

export const TestScreen: React.FC<TestScreenProps> = ({ questions, mode, onTestEnd, onExit, onNeedMore }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const { lang } = useSettings();

  const isFullTest = mode === 'FullTest';
  const currentQuestion = questions[currentIndex];
  const labels = t[lang].options;
  const selectedOptionId = userAnswers[currentIndex] ?? null;
  const isRevealed = revealedIndices.has(currentIndex);

  // Автоматическая фоновая подгрузка при приближении к "пустоте"
  useEffect(() => {
    if (isFullTest && !isFinished) {
      const currentMissing = !currentQuestion;
      const nextMissing = currentIndex + 3 < 140 && !questions[currentIndex + 3];

      if ((currentMissing || nextMissing) && currentIndex < 140) {
        onNeedMore(currentIndex);
      }
    }
  }, [currentIndex, questions, isFullTest, isFinished, currentQuestion]);

  const handleSelect = (id: number) => {
    if (isRevealed || isFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: id }));
  };

  const handleNext = () => {
    setShowExplanation(false);
    
    if (!isFullTest) {
      if (!isRevealed) {
        setRevealedIndices(prev => new Set(prev).add(currentIndex));
      } else {
        if (currentIndex + 1 < questions.length) setCurrentIndex(prev => prev + 1);
      }
    } else {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= 140) {
        finishTest();
      } else {
        setCurrentIndex(nextIndex);
      }
    }
  };

  const handlePaginationClick = (idx: number) => {
    if (isFinished) return;
    setCurrentIndex(idx);
  };

  // Функция для ручной подгрузки по кнопке "+5"
  const handleLoadManualBatch = () => {
    // Находим первый undefined вопрос, начиная от текущего индекса и дальше
    let firstEmptyIndex = currentIndex;
    while (firstEmptyIndex < 140 && questions[firstEmptyIndex] !== undefined) {
      firstEmptyIndex++;
    }

    // Если нашли пустоту в пределах теста, триггерим загрузку для этой зоны
    if (firstEmptyIndex < 140) {
      onNeedMore(firstEmptyIndex);
    }
  };

  const finishTest = () => {
    const score = questions.reduce((acc, q, idx) => {
      if (!q) return acc;
      const correctOption = q.options.find(o => o.isCorrect);
      const isCorrect = userAnswers[idx] === correctOption?.id;
      return isCorrect ? acc + 1 : acc;
    }, 0);

    setIsFinished(true);
    onTestEnd(score);
  };

  return (
    <Box className="max-w-4xl mx-auto select-none">

      {/* ПАГИНАЦИЯ И КНОПКА РУЧНОЙ ПОДГРУЗКИ */}
      {isFullTest && (
        <Box className="mb-6 space-y-3">
          <Box className="flex flex-wrap gap-1.5">
            {Array.from({ length: 140 }).map((_, idx) => {
              const q = questions[idx];
              const answered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
              const revealed = revealedIndices.has(idx);

              let style = "border-gray-200 text-gray-300 bg-gray-50/50"; // Еще не загружен

              if (q) {
                style = "border-gray-300 text-gray-400 bg-white"; // Загружен
                
                if (isFinished || revealed) {
                  const correctId = q.options.find(o => o.isCorrect)?.id;
                  const isCorrect = userAnswers[idx] === correctId;
                  style = isCorrect
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-red-500 border-red-500 text-white";
                } else if (answered) {
                  style = "border-gray-800 text-gray-800 font-bold bg-white";
                }
              }

              return (
                <Box
                  key={idx}
                  onClick={() => handlePaginationClick(idx)}
                  className={`w-8 h-8 flex items-center justify-center border text-xs font-bold cursor-pointer rounded-sm ${style} ${currentIndex === idx ? 'ring-2 ring-yellow-400 border-white z-10' : ''}`}
                >
                  {idx + 1}
                </Box>
              );
            })}
          </Box>

          {/* Кнопка параллельной ручной подгрузки */}
          {!isFinished && (
            <Button 
              variant="text" 
              size="small"
              onClick={handleLoadManualBatch}
              className="text-blue-600 hover:text-blue-800 text-xs font-bold normal-case p-0 flex items-center gap-1"
            >
              +5 вопросов в сетку
            </Button>
          )}
        </Box>
      )}

      {/* КОНТЕНТНАЯ КАРТОЧКА */}
      {!currentQuestion ? (
        <Box className="p-12 rounded-2xl border border-gray-100 flex flex-col items-center justify-center h-80 gap-4 shadow-sm bg-white">
          <CircularProgress size={40} />
          <Typography variant="body2" className="text-gray-400 animate-pulse">
            {t[lang].loading}
          </Typography>
        </Box>
      ) : (
        /* Сам вопрос */
        <Box className="p-8 rounded-2xl shadow-sm border border-gray-300">
          <Typography variant="h5" className="mb-8 leading-relaxed font-medium">
            {currentQuestion.text}
          </Typography>

          {/* Варианты ответов */}
          <Box className="space-y-4 mb-10">
            {currentQuestion.options.map((opt, i) => (
              <Box key={opt.id} className="flex items-start gap-4">
                <Box className={`px-3 py-1 font-bold rounded min-w-9 text-center border ${(isRevealed || isFinished) && opt.isCorrect ? 'bg-green-500 text-white' : 'border-gray-300'}`}>
                  {labels[i]}
                </Box>
                <Typography className={`pt-1 text-lg ${(isRevealed || isFinished) && opt.isCorrect ? 'text-green-600 font-bold' : ''}`}>
                  {opt.text}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* СЕТКА ВЫБОРА */}
          <Box className="mb-10">
            <Typography variant="body2" className="mb-4 font-bold uppercase">{t[lang].selectAnswer}</Typography>
            <Box className="flex gap-4">
              {currentQuestion.options.map((opt, i) => {
                const selected = selectedOptionId === opt.id;
                const correct = opt.isCorrect;
                const show = isRevealed || isFinished;
                return (
                  <Box key={opt.id} className="flex flex-col items-center">
                    <Typography className="font-bold mb-1">{labels[i]}</Typography>
                    <Box onClick={() => handleSelect(opt.id)}
                      className={`w-14 h-14 border-2 flex items-center justify-center cursor-pointer rounded-xl ${selected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'} ${show && correct ? 'border-green-500 bg-green-50' : ''}`}>
                      {selected && <Box className={`w-8 h-8 rounded-sm ${show ? (correct ? 'bg-green-600' : 'bg-red-400') : 'bg-blue-600'}`} />}
                      {show && correct && !selected && <Box className="w-4 h-4 bg-green-500 rounded-full" />}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Объяснение */}
          <Collapse in={showExplanation}>
            <Alert severity="info" className="mb-8 rounded-xl bg-blue-50 text-blue-900 border-none">
              {currentQuestion.explanation}
            </Alert>
          </Collapse>

          <Divider className="mb-8" />

          {/* Панель кнопок */}
          <Box className="flex justify-between items-center">
            <Box className="flex gap-2">
              <Button onClick={onExit} className="text-gray-400 capitalize">
                {t[lang].exitBtn}
              </Button>
              {isFullTest && !isFinished && (
                <Button onClick={finishTest} color="error" className="capitalize text-red-500">
                  {t[lang].finishBtn}
                </Button>
              )}
            </Box>
            
            <Box className="flex gap-3">
              {(isRevealed || isFinished) && (
                <Button variant="outlined" className="rounded-xl border-blue-600 text-blue-600" onClick={() => setShowExplanation(!showExplanation)}>
                  {showExplanation ? t[lang].hideExplainBtn : t[lang].explainBtn}
                </Button>
              )}
              {!isFinished && !isRevealed && (
                <Button variant="outlined" className="rounded-xl border-blue-600 text-blue-600" onClick={() => setRevealedIndices(prev => new Set(prev).add(currentIndex))}>
                  {t[lang].showAnswerBtn}
                </Button>
              )}
              <Button variant="contained" disabled={selectedOptionId === null && !isRevealed}
                className={`py-3 px-10 rounded-xl shadow-none capitalize ${isRevealed || isFinished ? 'bg-[#4caf50]' : 'bg-[#c62828]'}`}
                onClick={handleNext}>
                {isFullTest ? (currentIndex === 139 ? t[lang].finishBtn : t[lang].nextBtn) : (isRevealed ? t[lang].nextBtn : t[lang].answerBtn)}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};