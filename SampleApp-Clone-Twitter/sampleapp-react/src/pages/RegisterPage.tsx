import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PasswordStrength } from '../components/PasswordStrength';
import { ButtonLoader } from '../components/ButtonLoader';
import { PreventUnsavedChanges } from '../components/guards/PreventUnsavedChanges';

type FormData = {
  login: string;
  password: string;
  name: string;
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState,
    clearErrors,
    setError,
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      login: '',
      password: '',
      name: '',
    },
  });

  const { errors, isValid, isDirty } = formState;
  const loginValue = watch('login');
  const passwordValue = watch('password');

  useEffect(() => {
    if (loginValue !== 'admin') {
      clearErrors('login');
    }
  }, [loginValue, clearErrors]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setServerError('');

      await registerUser(data);

      reset();
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      const apiErrors = err.response?.data?.errors;

      if (apiErrors) {
        if (apiErrors.Login?.[0]) {
          setError('login', {
            type: 'manual',
            message: apiErrors.Login[0],
          });
        }

        if (apiErrors.Password?.[0]) {
          setError('password', {
            type: 'manual',
            message: apiErrors.Password[0],
          });
        }

        if (apiErrors.Name?.[0]) {
          setError('name', {
            type: 'manual',
            message: apiErrors.Name[0],
          });
        }

        setServerError('Проверьте правильность заполнения полей');
      } else {
        setServerError(err.response?.data?.message || 'Ошибка регистрации');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PreventUnsavedChanges isDirty={isDirty && !loading}>
      {({ confirmNavigate }) => (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper sx={{ p: 4 }}>
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <UserPlus size={48} color="#3f51b5" />
              <Typography variant="h4" sx={{ mt: 2 }}>
                Регистрация
              </Typography>
            </Box>

            {serverError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {serverError}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <TextField
                label="Имя"
                fullWidth
                {...register('name', {
                  required: 'Имя обязательно',
                  minLength: {
                    value: 2,
                    message: 'Минимум 2 символа',
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
              />

              <TextField
                label="Логин"
                fullWidth
                {...register('login', {
                  required: 'Логин обязателен',
                  minLength: {
                    value: 3,
                    message: 'Минимум 3 символа',
                  },
                  validate: (value: string) => {
                    if (value === 'admin') {
                      return 'Недопустимый логин пользователя';
                    }
                    return true;
                  },
                })}
                error={!!errors.login}
                helperText={errors.login?.message}
                disabled={loading}
              />

              <TextField
                label="Пароль"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 3,
                    message: 'Минимум 3 символа',
                  },
                  maxLength: {
                    value: 8,
                    message: 'Максимум 8 символов',
                  },
                  validate: (value: string) => {
                    if (value === '123') {
                      return 'Слишком простой пароль';
                    }
                    return true;
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev: boolean) => !prev)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {passwordValue ? <PasswordStrength password={passwordValue} /> : null}

              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <ButtonLoader size={20} /> : <UserPlus size={18} />}
                disabled={!isValid || loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </Box>

            {isDirty && !loading && (
              <Alert severity="info" sx={{ mt: 2 }}>
                У вас есть несохраненные изменения
              </Alert>
            )}

            <Box textAlign="center" mt={2}>
              <Typography variant="body2">
                Уже есть аккаунт?{' '}
                <Button
                  color="primary"
                  onClick={() => confirmNavigate(() => navigate('/login'))}
                >
                  Войти
                </Button>
              </Typography>
            </Box>
          </Paper>
        </Container>
      )}
    </PreventUnsavedChanges>
  );
};
