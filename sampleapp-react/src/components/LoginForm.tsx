import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, InputAdornment, IconButton, Alert } from '@mui/material';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type FormData = {
    login: string;
    password: string;
};

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            setError('');
            await login(data.login, data.password);
            onSuccess?.();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка входа');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Логин"
                    {...register('login', { required: 'Логин обязателен' })}
                    error={!!errors.login}
                    helperText={errors.login?.message}
                    disabled={loading}
                    fullWidth
                />

                <TextField
                    label="Пароль"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', { required: 'Пароль обязателен' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    disabled={loading}
                    fullWidth
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

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<LogIn size={20} />}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? 'Вход...' : 'Войти'}
                </Button>
            </Box>
        </form>
    );
};