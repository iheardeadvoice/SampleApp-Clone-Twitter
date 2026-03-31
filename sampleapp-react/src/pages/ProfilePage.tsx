import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  User as UserIcon,
  Shield,
  Edit,
  ArrowLeft,
  Share2,
  Star,
  Award,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById } from '../api/users';
import type { User } from '../types';

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, token } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getUserById(Number(id));
        setUser(data);
      } catch (err) {
        setError('Не удалось загрузить профиль пользователя');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (user) {
      navigate(`/profile/${user.id}/edit`);
    }
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/profile/${id}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(profileUrl);
      }
      alert('Ссылка на профиль скопирована');
    } catch {
      alert('Не удалось скопировать ссылку');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Пользователь не найден'}
        </Alert>
        <Button startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
          Назад
        </Button>
      </Container>
    );
  }

  const isOwnProfile = currentUser?.id === user.id;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button startIcon={<ArrowLeft size={18} />} onClick={handleBack}>
          Назад
        </Button>

        <Tooltip title="Поделиться">
          <IconButton onClick={handleShare}>
            <Share2 size={20} />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            sx={{
              width: 120,
              height: 120,
              bgcolor: isOwnProfile ? 'primary.main' : 'secondary.main',
              mb: 2,
              fontSize: '3rem',
            }}
          >
            {user.login.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h4" gutterBottom>
            {user.name || user.login}
          </Typography>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            @{user.login}
          </Typography>

          <Box display="flex" gap={1} mt={1}>
            {isOwnProfile && (
              <Chip
                icon={<Star size={14} />}
                label="Это вы"
                color="primary"
                size="small"
              />
            )}

            {token && isOwnProfile && (
              <Chip
                icon={<Shield size={14} />}
                label="JWT активен"
                color="success"
                size="small"
              />
            )}
          </Box>

          {isOwnProfile && (
            <Button
              variant="outlined"
              startIcon={<Edit size={18} />}
              onClick={handleEdit}
              sx={{ mt: 2 }}
            >
              Редактировать профиль
            </Button>
          )}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{xs : 12 , md :6}}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <UserIcon size={20} color="#3f51b5" />
                <Typography variant="h6">Основная информация</Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                    ID:
                  </Typography>
                  <Typography variant="body1">{user.id}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                    Логин:
                  </Typography>
                  <Typography variant="body1">{user.login}</Typography>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                    Имя:
                  </Typography>
                  <Typography variant="body1">{user.name || 'Не указано'}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs : 12 , md :6}}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Award size={20} color="#3f51b5" />
                <Typography variant="h6">Статистика</Typography>
              </Box>

              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                    Статус:
                  </Typography>
                  <Chip
                    size="small"
                    label={isOwnProfile && token ? 'Активен' : 'Не активен'}
                    color={isOwnProfile && token ? 'success' : 'default'}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: 80 }}>
                    Токен:
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {isOwnProfile && token ? `${token.substring(0, 15)}...` : 'Скрыт'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {isOwnProfile && token && (
          <Grid size={{xs : 12 }}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Shield size={20} color="#4caf50" />
                  <Typography variant="h6">Ваш JWT токен</Typography>
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    wordBreak: 'break-all',
                  }}
                >
                  {token}
                </Paper>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  Используется для авторизации запросов к API
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};