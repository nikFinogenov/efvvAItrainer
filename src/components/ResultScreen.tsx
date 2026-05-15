import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  return (
    <Card className='max-w-125 mx-auto mt-12 text-center shadow-lg rounded-xl p-6'>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom color="primary" className='font-bold'>
          Test Completed! 🎉
        </Typography>
        <Typography variant="h6" className='my-3'>
          Your Score: <Box component="span" className='font-bold text-secondary text-[2rem]'>{score}</Box> / {totalQuestions}
        </Typography>
        <Typography variant="body1" color="text.secondary" className='mb-4'>
          {score === totalQuestions ? "Perfect score! You're a master!" : "Great effort! Keep practicing to beat your highscore."}
        </Typography>
        <Button variant="contained" size="large" onClick={onRestart} fullWidth>
          Back to Categories
        </Button>
      </CardContent>
    </Card>
  );
};