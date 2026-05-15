import React, { useState } from 'react';
import { Typography, Button, Box, Divider } from '@mui/material';
import { Question } from '../types/quiz';

interface QuizScreenProps {
  questions: Question[];
  mode: 'test' | 'infinite';
  onQuizEnd: (score: number) => void;
  onExit: () => void;
}

export const QuizScreen: React.FC<QuizScreenProps> = ({ questions, mode, onQuizEnd, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Храним ответы: { [index вопроса]: ID выбранного варианта }
  const [userAnswers, setUserAnswers] = useState<Record<number, number | null>>({});
  // Храним, для каких вопросов был нажат "Показать ответ"
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  const isTestMode = mode === 'test';
  const currentQuestion = questions[currentIndex];
  const labels = ['А', 'Б', 'В', 'Г'];
  const selectedOptionId = userAnswers[currentIndex] || null;
  const isRevealed = revealedIndices.has(currentIndex);

  const handleSelect = (optionId: number) => {
    if (isRevealed) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionId }));
  };

  const toggleReveal = () => {
    setRevealedIndices(prev => new Set(prev).add(currentIndex));
  };

  const goToNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else if (isTestMode) {
      // Считаем финальный счет только при завершении
      const score = questions.reduce((acc, q, idx) => {
        const answerId = userAnswers[idx];
        const isCorrect = q.options.find(o => o.id === answerId)?.isCorrect;
        return isCorrect ? acc + 1 : acc;
      }, 0);
      onQuizEnd(score);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  return (
    <Box className="max-w-4xl mx-auto mt-6 p-6">
      
      {/* 1. ПАГИНАЦИЯ (Только для режима теста) */}
      {isTestMode && (
        <Box className="mb-8">
          <Box className="flex flex-wrap gap-2 mb-4">
            {questions.map((_, idx) => {
              const isAnswered = userAnswers[idx] !== undefined && userAnswers[idx] !== null;
              const isActive = currentIndex === idx;
              
              return (
                <Box
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    w-10 h-10 flex items-center justify-center border-2 cursor-pointer transition-all font-medium
                    ${isActive ? 'bg-[#ff5252] border-[#ff5252] text-white shadow-md' : 
                      isAnswered ? 'border-[#4caf50] text-[#4caf50]' : 'border-gray-300 text-gray-500'}
                    hover:border-red-400
                  `}
                >
                  {idx + 1}
                </Box>
              );
            })}
          </Box>
          <Box className="flex justify-end">
             <Box className="border-2 border-[#4caf50] px-4 py-1 text-[#4caf50] font-medium">
                Завдання {currentIndex + 1} з {questions.length}
             </Box>
          </Box>
          <Divider className="mt-4" />
        </Box>
      )}

      {/* 2. ВОПРОС И ВАРИАНТЫ */}
      <Box className="bg-white p-6 rounded-lg">
        <Typography variant="h5" className="mb-8 text-gray-800 leading-relaxed">
          {currentQuestion.text}
        </Typography>

        <Box className="space-y-4 mb-10">
          {currentQuestion.options.map((option, index) => (
            <Box key={option.id} className="flex items-start gap-4">
              <Box className={`
                px-3 py-1 font-bold rounded min-w-[32px] text-center
                ${isRevealed && option.isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100'}
              `}>
                {labels[index]}
              </Box>
              <Typography className={`pt-1 text-lg ${isRevealed && option.isCorrect ? 'text-green-600 font-bold' : ''}`}>
                {option.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* 3. СЕТКА ВЫБОРА */}
        <Box className="mb-10">
          <Typography variant="body2" className="mb-3 text-gray-600">Позначте відповіді:</Typography>
          <Box className="flex gap-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrect = option.isCorrect;
              return (
                <Box key={option.id} className="flex flex-col items-center">
                  <Typography className="font-bold mb-1">{labels[index]}</Typography>
                  <Box 
                    onClick={() => handleSelect(option.id)}
                    className={`
                      w-12 h-12 border-2 flex items-center justify-center cursor-pointer
                      ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                      ${isRevealed && isCorrect ? 'border-green-500 bg-green-50' : ''}
                    `}
                  >
                    {isSelected && <Box className={`w-7 h-7 ${isRevealed && !isCorrect ? 'bg-red-400' : 'bg-blue-600'}`} />}
                    {isRevealed && isCorrect && !isSelected && <Box className="w-3 h-3 bg-green-500 rounded-full" />}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Divider className="mb-8" />

        {/* 4. КНОПКИ НАВИГАЦИИ */}
        <Box className="flex flex-wrap gap-4 justify-between">
          <Box className="flex gap-2">
            {isTestMode && (
              <Button 
                variant="outlined"
                disabled={currentIndex === 0}
                className="border-gray-400 text-gray-600 px-6 py-2"
                onClick={goToPrev}
              >
                Попереднє
              </Button>
            )}
            <Button 
              variant="contained" 
              className="bg-[#4caf50] hover:bg-[#43a047] px-6 py-2 shadow-none capitalize"
              onClick={() => {
                if (!isRevealed) setUserAnswers(prev => ({ ...prev, [currentIndex]: null }));
                goToNext();
              }}
            >
              Пропустити
            </Button>
          </Box>

          <Box className="flex gap-2">
            <Button 
              variant="outlined" 
              disabled={isRevealed}
              className="border-blue-600 text-blue-600 px-6 py-2 capitalize"
              onClick={toggleReveal}
            >
              Показати відповідь
            </Button>

            <Button 
              variant="contained" 
              className="bg-[#c62828] hover:bg-[#b71c1c] px-8 py-2 shadow-none capitalize"
              onClick={goToNext}
            >
              {currentIndex + 1 === questions.length && isTestMode ? 'Завершити' : 'Наступне'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};