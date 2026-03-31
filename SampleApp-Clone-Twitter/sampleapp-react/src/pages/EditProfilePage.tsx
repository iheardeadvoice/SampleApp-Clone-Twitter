import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { ArrowLeft, Save, User as UserIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById, updateUser } from '../api/users';
import type { User } from '../types';
import { PreventUnsavedChanges } from '../components/guards/PreventUnsavedChanges';

export const EditProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    login: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === Number(id);
  const isDirty =
    formData.name !== (user?.name || '') ||
    formData.login !== (user?.login || '');

  useEffect(() => {
    if (!isOwnProfile) {
      navigate('/users', { replace: true });
      return;
    }

    const loadUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const data = await getUserById(Number(id));
        setUser(data);
        setFormData({
          name: data.name || '',
          login: data.login,
        });
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, isOwnProfile, navigate]);

  const handleChange =
    (field: keyof typeof formData) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.login.trim()) {
      alert('Логин не может быть пустым');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const updatedUserFromApi = await updateUser(Number(id), {
        name: formData.name,
        login: formData.login,
      });

      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          ...updatedUserFromApi,
          token: updatedUserFromApi.token || currentUser.token,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      window.location.href = `/profile/${id}`;
    } catch (err: any) {
      const errors = err.response?.data?.errors;

      if (errors) {
        const messages = Object.values(errors).flat().join('. ');
        setError(messages);
      } else {
        setError(err.response?.data?.message || 'Ошибка при обновлении профиля');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Назад
        </Button>
      </Container>
    );
  }

  return (
    <PreventUnsavedChanges
      isDirty={isDirty && !saving}
      message="У вас есть несохраненные изменения. Вы действительно хотите покинуть страницу?"
    >
      {({ confirmNavigate }) => (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Button
            startIcon={<ArrowLeft size={18} />}
            onClick={() => confirmNavigate(() => navigate(-1))}
            sx={{ mb: 2 }}
          >
            Назад
          </Button>

          <Paper sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                <UserIcon size={32} />
              </Avatar>

              <Box>
                <Typography variant="h5">Редактирование профиля</Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: {user?.id}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={formData.name}
                  onChange={handleChange('name')}
                  disabled={saving}
                />

                <TextField
                  fullWidth
                  label="Логин"
                  value={formData.login}
                  onChange={handleChange('login')}
                  disabled={saving}
                  required
                />

                {isDirty && (
                  <Alert severity="info">
                    У вас есть несохраненные изменения
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save size={18} />}
                  disabled={!isDirty || saving}
                  size="large"
                >
                  {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      )}
    </PreventUnsavedChanges>
  );
};