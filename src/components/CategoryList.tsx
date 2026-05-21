import React from 'react';
import { Grid, Typography, Box, Button, Paper } from '@mui/material';
import { CategoryCard } from './CategoryCard';
import { CategoryWithTopics, Mode } from '../types/test';
import { mockCategories, mockTopics } from '../data/mockData';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';

interface CategoryListProps {
    onSelectMode: (mode: Mode, targetId: number | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelectMode }) => {
    // Собираем категории вместе с их топиками для передачи в карточки
    const categoriesWithTopics: CategoryWithTopics[] = mockCategories.map(cat => ({
        ...cat,
        topics: mockTopics.filter(t => t.categoryId === cat.id)
    }));

    return (
        <Box>
            {/* СЕКЦИЯ ГЛОБАЛЬНЫХ РЕЖИМОВ */}
            <Paper
                elevation={0}
                className="p-8 mb-12 bg-linear-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-xl"
            >
                <Grid container spacing={4} className="items-center">
                    <Grid size={{
                        xs: 12,
                        sm:6,
                        md: 4,
                        lg: 3
                    }}>
                        <Typography variant="h4" className="font-bold mb-2">
                            Готові до повного іспиту?
                        </Typography>
                        <Typography variant="body1" className="opacity-90">
                            Запустіть комплексне тестування на 140 питань, сформоване згідно з державною таксономією та вагою кожної категорії.
                        </Typography>
                    </Grid>
                    <Grid className="flex gap-3 justify-end" size = {{ 
                        xs: 12,
                        md: 5
                    }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<AssignmentIcon />}
                            className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-6 rounded-xl shadow-lg"
                            onClick={() => onSelectMode('FullTest', null)}
                        >
                            Скласти іспит (140)
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            startIcon={<AllInclusiveIcon />}
                            className="border-white text-white hover:bg-white/10 font-bold py-3 px-6 rounded-xl"
                            onClick={() => onSelectMode('FullInfinite', null)}
                        >
                            Мікс (Безкінечно)
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* СЕКЦИЯ КАТЕГОРИЙ */}
            <Typography variant="h4" className="font-bold mb-2">
                Категорії знань
            </Typography>
            <Typography variant="body1" className="mb-8">
                Виберіть конкретний розділ для глибокого опрацювання топиків у безкінечному режимі
            </Typography>

            <Grid container spacing={4}>
                {categoriesWithTopics.map((category) => (
                    <Grid key={category.id} 
                    size={{
                        xs: 12, // 1 в ряд на мобилках
                        sm: 6,  // 2 в ряд на планшетах
                        md: 4,  // 3 в ряд на ноутах
                        lg: 3   // 4 в ряд на больших экранах
                    }}>
                        <CategoryCard
                            category={category}
                            onSelectMode={(mode, targetId) => onSelectMode(mode, targetId)}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};