import { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Avatar, Chip, Box } from '@mui/material';
import { Home, Users, LogIn, LogOut, User as UserIcon, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
    const navigate = useNavigate();
    const { user, logout, token } = useAuth();
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

    const handleProfile = () => {
        handleClose();
        if (user) {
            navigate(`/profile/${user.id}`);
        }
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
                        {token && (
                            <Chip
                                icon={<Shield size={14} />}
                                label="JWT"
                                size="small"
                                sx={{
                                    mr: 2,
                                    bgcolor: 'success.main',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                            />
                        )}

                        <Button color="inherit" onClick={handleMenu} startIcon={<UserIcon size={20} />}>
                            {user.login}
                        </Button>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                            <MenuItem onClick={handleProfile}>
                                <UserIcon size={16} style={{ marginRight: 8 }} />
                                Профиль
                            </MenuItem>
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