import { useState, type MouseEvent } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Home,
  Users,
  LogIn,
  LogOut,
  User as UserIcon,
  Edit,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleClose();
    if (user) navigate(`/profile/${user.id}`);
  };

  const handleEditProfile = () => {
    handleClose();
    if (user) navigate(`/profile/${user.id}/edit`);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(16px)',
        background: 'rgba(25, 118, 210, 0.92)',
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', fontWeight: 800 }}
          onClick={() => navigate('/')}
        >
          SampleAPP
        </Typography>

        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<Home size={18} />}
            sx={{ borderRadius: 999 }}
          >
            Лента
          </Button>

          {user && (
            <Button
              color="inherit"
              onClick={() => navigate('/users')}
              startIcon={<Users size={18} />}
              sx={{ borderRadius: 999 }}
            >
              Люди
            </Button>
          )}

          {user ? (
            <>
              <Tooltip title="Аккаунт">
                <IconButton onClick={handleMenu} size="small">
                  <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main' }}>
                    {user.login.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    minWidth: 220,
                    borderRadius: 3,
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle2">{user.name || user.login}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{user.login}
                  </Typography>
                </Box>

                <Divider />

                <MenuItem onClick={handleProfile}>
                  <UserIcon size={16} style={{ marginRight: 12 }} />
                  Профиль
                </MenuItem>

                <MenuItem onClick={handleEditProfile}>
                  <Edit size={16} style={{ marginRight: 12 }} />
                  Редактировать профиль
                </MenuItem>

                <Divider />

                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <LogOut size={16} style={{ marginRight: 12 }} />
                  Выйти
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate('/login')}
              startIcon={<LogIn size={18} />}
              sx={{ borderRadius: 999 }}
            >
              Войти
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};