import React from 'react';
import { Box, Typography, Container, Button, IconButton } from '@mui/material';
import { LightMode, DarkMode, Language } from '@mui/icons-material';
import { useSettings } from '../context/AppContext';


// interface FooterProps {
//   onHomeClick: () => void;
// }

export const Footer: React.FC = () => {

  const { themeMode, toggleTheme, lang, setLang } = useSettings();

  return (
    <Box component="footer" className='py-6 mt-auto'>
      
      <Container maxWidth="lg">
        <Box className="flex items-center justify-between gap-2">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Test App. All rights reserved.
          </Typography>
          {/* Переключатель языка */}
          <Box>
            <Button
              color="inherit"
              startIcon={<Language />}
              onClick={() => setLang(lang === 'uk' ? 'en' : 'uk')}
              className="text-white font-bold capitalize text-sm"
            >
              {lang === 'uk' ? 'UA' : 'EN'}
            </Button>

            {/* Переключатель темы */}
            <IconButton color="inherit" onClick={toggleTheme} className="text-white">
              {themeMode === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};