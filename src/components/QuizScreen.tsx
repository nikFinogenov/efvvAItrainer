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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false); // Состояние "показан ответ"

  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const labels = ['А', 'Б', 'В', 'Г'];

  const handleSelect = (id: number) => {
    if (isRevealed) return; // Запрещаем менять выбор, если ответ уже открыт
    setSelectedOptionId(id);
  };

  const handleNext = () => {
    const correctOption = currentQuestion.options.find(o => o.isCorrect);
    const isCorrect = selectedOptionId === correctOption?.id;
    
    // Если пользователь сам ответил правильно до открытия или просто переходит
    const newScore = isCorrect ? score + 1 : score;

    if (currentQuestionIndex + 1 < questions.length) {
      setScore(newScore);
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOptionId(null);
      setIsRevealed(false); // Сбрасываем для следующего вопроса
    } else {
      onQuizEnd(newScore);
    }
  };

  return (
    <Box className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
      {/* Текст вопроса */}
      <Typography variant="h5" className="mb-8 text-gray-800 leading-relaxed font-medium">
        {currentQuestion.text}
      </Typography>

      {/* Список вариантов ответов */}
      <Box className="space-y-4 mb-10">
        {currentQuestion.options.map((option, index) => {
          const isCorrect = option.isCorrect;
          return (
            <Box key={option.id} className="flex items-start gap-4">
              <Box className={`
                px-3 py-1 font-bold rounded min-w-[32px] text-center transition-colors
                ${isRevealed && isCorrect ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700'}
              `}>
                {labels[index]}
              </Box>
              <Typography variant="body1" className={`pt-1 text-lg ${isRevealed && isCorrect ? 'text-green-700 font-medium' : 'text-gray-700'}`}>
                {option.text}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Сетка выбора ответа */}
      <Box className="mb-10">
        <Typography variant="body2" className="mb-3 text-gray-600 font-medium">
          Позначте відповіді:
        </Typography>
        <Box className="flex gap-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;
            
            // Логика цвета рамки
            let borderColor = 'border-gray-300';
            if (isSelected) borderColor = 'border-blue-600';
            if (isRevealed && isCorrect) borderColor = 'border-green-500';

            return (
              <Box key={option.id} className="flex flex-col items-center">
                <Typography className={`font-bold mb-1 ${isRevealed && isCorrect ? 'text-green-600' : 'text-gray-800'}`}>
                  {labels[index]}
                </Typography>
                <Box 
                  onClick={() => handleSelect(option.id)}
                  className={`
                    w-12 h-12 border-2 flex items-center justify-center cursor-pointer transition-all
                    ${borderColor} 
                    ${isRevealed && isCorrect ? 'bg-green-50' : isSelected ? 'bg-blue-50' : 'bg-white'}
                    rounded-md
                  `}
                >
                  {/* Икс или Квадратик при выборе */}
                  {isSelected && (
                    <Box className={`w-7 h-7 rounded-sm ${isRevealed && !isCorrect ? 'bg-red-400' : 'bg-blue-600'}`} />
                  )}
                  {/* Если ответ открыт и это правильный, но не выбранный — можно добавить точку или оставить просто рамку */}
                  {isRevealed && isCorrect && !isSelected && (
                    <Box className="w-3 h-3 bg-green-500 rounded-full" />
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Divider className="mb-8" />

      {/* Кнопки управления */}
      <Box className="grid grid-cols-3 gap-4">
        <Button 
          variant="contained" 
          className="bg-[#4caf50] hover:bg-[#43a047] capitalize py-3 text-lg shadow-none"
          onClick={() => {
            setSelectedOptionId(null);
            handleNext();
          }}
        >
          Пропустити
        </Button>

        <Button 
          variant="outlined" 
          disabled={isRevealed}
          className="border-blue-600 text-blue-600 hover:bg-blue-50 capitalize py-3 text-lg font-medium"
          onClick={() => setIsRevealed(true)}
        >
          Показати відповідь
        </Button>

        <Button 
          variant="contained" 
          disabled={selectedOptionId === null && !isRevealed}
          className={`
            ${selectedOptionId === null && !isRevealed ? 'bg-gray-300' : 'bg-[#c62828] hover:bg-[#b71c1c]'} 
            capitalize py-3 text-lg shadow-none text-white
          `}
          onClick={handleNext}
        >
          Наступне
        </Button>
      </Box>
    </Box>
  );
};