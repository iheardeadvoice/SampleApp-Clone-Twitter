import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Home, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SampleApp
        </Typography>
        <Button color="inherit" onClick={() => navigate('/')} startIcon={<Home size={20} />}>
          Главная
        </Button>
        <Button color="inherit" onClick={() => navigate('/users')} startIcon={<Users size={20} />}>
          Пользователи
        </Button>
      </Toolbar>
    </AppBar>
  );
};