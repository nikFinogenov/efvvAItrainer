import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Divider } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { t } from '../utils/translations';
import { useSettings } from '../context/AppContext';


interface HeaderProps {
  onHomeClick: () => void; // Проп для возврата домой
}

export const Header: React.FC<HeaderProps> = ({ onHomeClick }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const { lang } = useSettings();

  return (
    <AppBar position="static" className="bg-[#1976d2] shadow-md">
      <Toolbar>
        {/* Кликабельное название */}
        <Typography 
          variant="h6" 
          component="div" 
          onClick={onHomeClick}
          className="grow cursor-pointer select-none font-bold tracking-[0.5px] hover:opacity-80 transition-opacity"
        >
          {t[lang].title}
        </Typography>

        <Box>
          <IconButton
            size="large"
            onClick={handleMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>My Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <Divider />
            <MenuItem onClick={handleMenuClose} className="text-red-600">Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};