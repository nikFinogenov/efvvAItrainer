import React from 'react';
import { Box, Typography, Container } from '@mui/material';

export const Footer: React.FC = () => {
  return (
    <Box component="footer" className='bg-white py-6 mt-auto'>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Test App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};