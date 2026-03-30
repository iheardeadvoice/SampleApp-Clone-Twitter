import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Avatar } from '@mui/material';
import { Home, Users, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        handleClose();
        navigate('/');
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
                    SampleApp
                </Typography>

                <Button color="inherit" onClick={() => navigate('/')} startIcon={<Home size={20} />}>
                    Главная
                </Button>

                {user && (
                    <Button color="inherit" onClick={() => navigate('/users')} startIcon={<Users size={20} />}>
                        Пользователи
                    </Button>
                )}

                {user ? (
                    <>
                        <Button color="inherit" onClick={handleMenu} startIcon={<UserIcon size={20} />}>
                            {user.login}
                        </Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleLogout}>
                                <LogOut size={16} style={{ marginRight: 8 }} />
                                Выйти
                            </MenuItem>
                        </Menu>
                    </>
                ) : (
                    <Button color="inherit" onClick={() => navigate('/login')} startIcon={<LogIn size={20} />}>
                        Вход
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};