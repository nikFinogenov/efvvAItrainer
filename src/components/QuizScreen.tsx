import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Stack, Box, LinearProgress } from '@mui/material';
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
  const [isAnswered, setIsAnswered] = useState(false);

  if (questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>No questions found for this selection.</Typography>
        <Button variant="contained" onClick={onExit}>Go Back</Button>
      </Box>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  // Calculate progress bar percentage
  const progress = ((currentQuestionIndex) / questions.length) * 100;

  const handleOptionClick = (optionId: number) => {
    if (isAnswered) return; // Prevent changing answers
    setSelectedOptionId(optionId);
  };

  const handleSubmitAnswer = () => {
    const selectedOption = currentQuestion.options.find(o => o.id === selectedOptionId);
    if (selectedOption?.isCorrect) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOptionId(null);

    const nextIndex = currentQuestionIndex + 1;
    
    if (mode === 'infinite') {
      // In infinite mode, loop back or keep going (simulated here by looping)
      setCurrentQuestionIndex(nextIndex % questions.length);
    } else {
      // Standard Test Mode
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        onQuizEnd(score + (currentQuestion.options.find(o => o.id === selectedOptionId)?.isCorrect ? 1 : 0));
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      {/* Top Controls */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {mode === 'infinite' ? 'Infinite Mode' : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </Typography>
        <Button size="small" color="error" onClick={onExit}>Exit Quiz</Button>
      </Stack>

      {/* Progress Bar (Only for fixed test mode) */}
      {mode === 'test' && (
        <LinearProgress variant="determinate" value={progress} sx={{ mb: 4, borderRadius: 2, height: 8 }} />
      )}

      <Card sx={{ p: 2, boxShadow: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
            {currentQuestion.text}
          </Typography>

          <Stack spacing={2}>
            {currentQuestion.options.map((option) => {
              // Color logic after checking answers
              let buttonColor: 'inherit' | 'primary' | 'success' | 'error' = 'inherit';
              let variant: 'outlined' | 'contained' = 'outlined';

              if (selectedOptionId === option.id) {
                variant = 'contained';
                buttonColor = 'primary';
              }

              if (isAnswered) {
                if (option.isCorrect) {
                  buttonColor = 'success';
                  variant = 'contained';
                } else if (selectedOptionId === option.id) {
                  buttonColor = 'error';
                  variant = 'contained';
                }
              }

              return (
                <Button
                  key={option.id}
                  variant={variant}
                  color={buttonColor}
                  size="large"
                  onClick={() => handleOptionClick(option.id)}
                  disabled={isAnswered && option.id !== selectedOptionId && !option.isCorrect}
                  sx={{ justifyContent: 'flex-start', py: 1.5, px: 3, textTransform: 'none', fontSize: '1.1rem' }}
                >
                  {option.text}
                </Button>
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* Action Navigation Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        {!isAnswered ? (
          <Button variant="contained" color="secondary" size="large" onClick={handleSubmitAnswer} disabled={selectedOptionId === null}>
            Submit Answer
          </Button>
        ) : (
          <Button variant="contained" color="primary" size="large" onClick={handleNext}>
            {currentQuestionIndex + 1 === questions.length && mode === 'test' ? 'See Results' : 'Next Question'}
          </Button>
        )}
      </Box>
    </Box>
  );
};