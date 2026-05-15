import React, { useState, useEffect } from 'react';
import { Typography, Button, Box, Divider, Collapse, Alert } from '@mui/material';
import { Question } from '../types/quiz';

interface QuizScreenProps {
  questions: Question[];
  mode: 'test' | 'infinite';
  onQuizEnd: (score: number) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, mode, onQuizEnd, onExit }) => {
  // --- СОСТОЯНИЯ ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const isInfinite = mode === 'infinite';
  const labels = ['А', 'Б', 'В', 'Г'];

  // Текущий выбор пользователя для активного вопроса
  // В бесконечном режиме используем ID вопроса как ключ, в тесте — индекс
  const sessionKey = isInfinite ? currentQuestion.id : currentIndex;
  const selectedOptionId = userAnswers[sessionKey] ?? null;
  const isRevealed = revealedIndices.has(sessionKey);

  // --- ЛОГИКА ---

  // Функция для получения случайного вопроса (для бесконечного режима)
  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const nextQ = questions[randomIndex];
    // Чтобы не было повторов дважды подряд
    if (questions.length > 1 && nextQ.id === currentQuestion.id) {
      return getRandomQuestion();
    }
    return nextQ;
  };

  const handleSelect = (optionId: number) => {
    // Нельзя менять ответ, если он уже раскрыт или тест завершен
    if (isRevealed || isFinished) return;
    setUserAnswers(prev => ({ ...prev, [sessionKey]: optionId }));
  };

  const handleReveal = () => {
    setRevealedIndices(prev => new Set(prev).add(sessionKey));
  };

  const handleNext = () => {
    if (isInfinite) {
      if (!isRevealed) {
        // Первый клик в бесконечном режиме — показать ответ (авто-штраф)
        handleReveal();
      } else {
        // Второй клик — следующий рандомный вопрос
        const nextQ = getRandomQuestion();
        setCurrentQuestion(nextQ);
        setIsRevealed(false);
        setShowExplanation(false);
        // Мы не сбрасываем userAnswers, чтобы в теории можно было вернуться, 
        // но в бесконечном режиме это просто очищает экран для нового вопроса
      }
    } else {
      // Режим Теста
      if (currentIndex + 1 < questions.length) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setCurrentQuestion(questions[nextIdx]);
        setShowExplanation(false);
      } else if (!isFinished) {
        finishTest();
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setCurrentQuestion(questions[prevIdx]);
      setShowExplanation(false);
    }
  };

  const finishTest = () => {
    const finalScore = questions.reduce((acc, q, idx) => {
      // Если подсмотрел — 0 баллов за вопрос
      if (revealedIndices.has(idx)) return acc;
      const ansId = userAnswers[idx];
      const correct = q.options.find(o => o.isCorrect)?.id;
      return ansId === correct ? acc + 1 : acc;
    }, 0);
    
    setIsFinished(true);
    // onQuizEnd(finalScore); // Можно вызвать сразу или дать посмотреть историю
  };

  return (
    <Box className="max-w-4xl mx-auto mt-6 p-4 md:p-6 select-none">
      
      {/* 1. ПАГИНАЦИЯ (Только для ТЕСТА) */}
      {!isInfinite && (
        <Box className="mb-8">
          <Box className="flex flex-wrap gap-2 mb-4">
            {questions.map((q, idx) => {
              const selectedId = userAnswers[idx];
              const isAnswered = selectedId !== null && selectedId !== undefined;
              const isActive = currentIndex === idx;
              const wasRevealed = revealedIndices.has(idx);

              // Цвета квадратиков
              let bgColor = 'bg-white';
              let textColor = 'text-gray-500';
              let borderColor = 'border-gray-300';

              if (wasRevealed) {
                bgColor = 'bg-[#ff5252]'; // Красный (подсмотрел = ошибка)
                textColor = 'text-white';
                borderColor = 'border-[#ff5252]';
              } else if (isFinished && isAnswered) {
                const isCorrect = q.options.find(o => o.id === selectedId)?.isCorrect;
                bgColor = isCorrect ? 'bg-[#4caf50]' : 'bg-[#ff5252]';
                textColor = 'text-white';
                borderColor = isCorrect ? 'border-[#4caf50]' : 'border-[#ff5252]';
              } else if (isAnswered) {
                borderColor = 'border-gray-600';
                textColor = 'text-gray-800';
              }

              return (
                <Box
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setCurrentQuestion(questions[idx]);
                    setShowExplanation(false);
                  }}
                  className={`
                    w-10 h-10 flex items-center justify-center border-2 cursor-pointer transition-all font-bold text-sm rounded-sm
                    ${bgColor} ${textColor} ${borderColor}
                    ${isActive ? 'ring-4 ring-yellow-400 border-white' : ''}
                  `}
                >
                  {idx + 1}
                </Box>
              );
            })}
          </Box>
          <Box className="flex justify-end">
             <Box className="border-2 border-gray-400 px-4 py-1 text-gray-700 font-bold rounded-md text-sm">
                Завдання {currentIndex + 1} з {questions.length}
             </Box>
          </Box>
          <Divider className="mt-4" />
        </Box>
      )}

      {/* 2. КАРТОЧКА ВОПРОСА */}
      <Box className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100">
        <Typography variant="h5" className="mb-8 text-gray-800 font-medium leading-relaxed">
          {currentQuestion.text}
        </Typography>

        {/* Список вариантов */}
        <Box className="space-y-4 mb-10">
          {currentQuestion.options.map((option, index) => {
            const isCorrect = option.isCorrect;
            const highlightCorrect = (isRevealed || isFinished) && isCorrect;
            return (
              <Box key={option.id} className="flex items-start gap-4">
                <Box className={`
                  px-3 py-1 font-bold rounded min-w-[36px] text-center transition-colors
                  ${highlightCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  {labels[index]}
                </Box>
                <Typography className={`pt-1 text-lg ${highlightCorrect ? 'text-green-600 font-bold' : 'text-gray-700'}`}>
                  {option.text}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Сетка выбора (NMT Style) */}
        <Box className="mb-10">
          <Typography variant="body2" className="mb-4 text-gray-500 font-bold uppercase tracking-wider">
            Позначте відповідь:
          </Typography>
          <Box className="flex gap-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;
              const showFinal = isRevealed || isFinished;

              let boxBorder = isSelected ? 'border-blue-600' : 'border-gray-300';
              if (showFinal && isCorrect) boxBorder = 'border-green-500';

              return (
                <Box key={option.id} className="flex flex-col items-center">
                  <Typography className={`font-bold mb-1 ${showFinal && isCorrect ? 'text-green-600' : 'text-gray-700'}`}>
                    {labels[index]}
                  </Typography>
                  <Box 
                    onClick={() => handleSelect(option.id)}
                    className={`
                      w-14 h-14 border-2 flex items-center justify-center cursor-pointer transition-all rounded-lg
                      ${boxBorder} ${isSelected ? 'bg-blue-50' : 'bg-white'}
                      ${showFinal && isCorrect ? 'bg-green-50' : ''}
                      hover:shadow-inner
                    `}
                  >
                    {isSelected && (
                      <Box className={`w-8 h-8 rounded-sm shadow-sm
                        ${showFinal ? (isCorrect && !isRevealed ? 'bg-green-600' : 'bg-red-400') : 'bg-blue-600'}`} 
                      />
                    )}
                    {showFinal && isCorrect && !isSelected && (
                      <Box className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Объяснение (Collapse) */}
        <Collapse in={showExplanation}>
          <Alert severity="info" className="mb-8 rounded-xl border-none bg-blue-50 text-blue-900 shadow-inner">
            <Typography className="font-bold mb-1">Пояснення:</Typography>
            {currentQuestion.explanation || "На жаль, пояснення до цього питання відсутнє."}
          </Alert>
        </Collapse>

        <Divider className="mb-8" />

        {/* 3. КНОПКИ УПРАВЛЕНИЯ */}
        <Box className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Box className="flex gap-2 w-full md:w-auto">
            {!isInfinite && (
              <Button 
                variant="outlined" 
                className="border-gray-300 text-gray-500 py-3 px-6 capitalize rounded-xl"
                onClick={handlePrev}
                disabled={currentIndex === 0 || isFinished}
              >
                Попереднє
              </Button>
            )}
            <Button 
              variant="contained" 
              className="bg-[#4caf50] hover:bg-[#388e3c] shadow-none capitalize py-3 px-6 rounded-xl flex-grow md:flex-grow-0"
              onClick={handleNext}
              disabled={isFinished && !isInfinite}
            >
              Пропустити
            </Button>
          </Box>

          <Box className="flex gap-2 w-full md:w-auto">
            {(isRevealed || isFinished) && currentQuestion.explanation && (
              <Button 
                variant="outlined" 
                className="border-blue-600 text-blue-600 capitalize py-3 px-6 rounded-xl"
                onClick={() => setShowExplanation(!showExplanation)}
              >
                {showExplanation ? 'Сховати' : 'Пояснити'}
              </Button>
            )}

            {!isFinished && !isRevealed && (
              <Button 
                variant="outlined" 
                className="border-blue-600 text-blue-600 capitalize py-3 px-6 rounded-xl"
                onClick={handleReveal}
                disabled={isRevealed}
              >
                Показати відповідь
              </Button>
            )}

            <Button 
              variant="contained" 
              disabled={selectedOptionId === null && !isRevealed && !isFinished}
              className={`
                capitalize py-3 px-10 text-lg shadow-none rounded-xl transition-all flex-grow md:flex-grow-0
                ${isFinished ? 'bg-blue-600 text-white' : 
                  (isInfinite && !isRevealed ? 'bg-blue-600' : 'bg-[#c62828] hover:bg-[#b71c1c]')}
              `}
              onClick={isFinished ? onExit : handleNext}
            >
              {isFinished ? 'До меню' : 
                (isInfinite ? (isRevealed ? 'Наступне' : 'Відповісти') : 
                (currentIndex + 1 === questions.length ? 'Завершити' : 'Наступне'))}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};