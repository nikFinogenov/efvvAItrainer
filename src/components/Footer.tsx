import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Quiz App. Все права защищены.
        </Typography>
      </Container>
    </Box>
  );
};