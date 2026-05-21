import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type Language = 'uk' | 'en';
type ThemeMode = 'light' | 'dark';

interface AppContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    themeMode: ThemeMode;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'uk');
    const [themeMode, setThemeMode] = useState<ThemeMode>(() => (localStorage.getItem('theme') as ThemeMode) || 'light');

    // Синхронизация темы с Tailwind и LocalStorage
    useEffect(() => {
        const root = window.document.documentElement;
        if (themeMode === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', themeMode);
    }, [themeMode]);

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const toggleTheme = () => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));

    // Создаем динамическую тему MUI в зависимости от стейта
    const muiTheme = createTheme({
        palette: {
            mode: themeMode,
            primary: { main: '#1976d2' },
            secondary: { main: '#9c27b0' },
            background: {
                default: themeMode === 'dark' ? '#121212' : '#f9fafb',
                paper: themeMode === 'dark' ? '#1e1e1e' : '#ffffff',
            },
        },
    });

    return (
        <AppContext.Provider value={{ lang, setLang, themeMode, toggleTheme }}>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </AppContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useSettings must be used within AppSettingsProvider');
    return context;
};