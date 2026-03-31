import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Alert, TextField, InputAdornment, IconButton } from '@mui/material';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { PasswordStrength } from './PasswordStrength';
import { ButtonLoader } from './ButtonLoader';

type FormData = {
    login: string;
    password: string;
    name: string;
};

export const RegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { register: registerUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, watch, formState } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            login: '',
            password: '',
            name: '',
        },
    });

    const { errors, isValid } = formState;
    const passwordValue = watch('password');

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            setServerError('');
            await registerUser(data);
            onSuccess?.();
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors) {
                if (errors.Login) {
                    setServerError(errors.Login[0]);
                } else {
                    setServerError('Проверьте правильность заполнения полей');
                }
            } else {
                setServerError(err.response?.data?.message || 'Ошибка регистрации');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {serverError && <Alert severity="error">{serverError}</Alert>}

                <TextField
                    fullWidth
                    label="Имя"
                    {...register('name')}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="Логин"
                    {...register('login', {
                        required: 'Логин обязателен',
                        minLength: { value: 3, message: 'Минимум 3 символа' },
                        validate: (value) => {
                            if (value === 'admin') return 'Недопустимый логин пользователя';
                            return true;
                        }
                    })}
                    error={!!errors.login}
                    helperText={errors.login?.message}
                    required
                    disabled={loading}
                />

                <TextField
                    fullWidth
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                        required: 'Пароль обязателен',
                        minLength: { value: 3, message: 'Минимум 3 символа' },
                        maxLength: { value: 8, message: 'Максимум 8 символов' },
                        validate: (value) => {
                            if (value === '123') return 'Слишком простой пароль';
                            return true;
                        }
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    required
                    disabled={loading}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                <PasswordStrength password={passwordValue} />

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <ButtonLoader /> : <UserPlus size={20} />}
                    disabled={!isValid || loading}
                    sx={{ mt: 1 }}
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </Box>
        </form>
    );
};