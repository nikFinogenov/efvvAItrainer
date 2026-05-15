import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart }) => {
  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 6, textAlign: 'center', boxShadow: 5, borderRadius: 3, p: 3 }}>
      <CardContent>
        <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom color="primary">
          Quiz Completed! 🎉
        </Typography>
        <Typography variant="h6" sx={{ my: 3 }}>
          Your Score: <Box component="span" sx={{ fontWeight: 'bold', color: 'secondary.main', fontSize: '2rem' }}>{score}</Box> / {totalQuestions}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {score === totalQuestions ? "Perfect score! You're a master!" : "Great effort! Keep practicing to beat your highscore."}
        </Typography>
        <Button variant="contained" size="large" onClick={onRestart} fullWidth>
          Back to Categories
        </Button>
      </CardContent>
    </Card>
  );
};