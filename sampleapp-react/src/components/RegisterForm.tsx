import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, InputAdornment, IconButton, Alert } from '@mui/material';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type FormData = {
    login: string;
    password: string;
    name: string;
};

export const RegisterForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { register: registerUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);
            setError('');
            await registerUser(data);
            onSuccess?.();
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors) {
                const messages = Object.values(errors).flat().join('. ');
                setError(messages);
            } else {
                setError(err.response?.data?.message || 'Ошибка регистрации');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {error && <Alert severity="error">{error}</Alert>}

                <TextField
                    label="Имя"
                    {...register('name')}
                    disabled={loading}
                    fullWidth
                />

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
                    {...register('password', {
                        required: 'Пароль обязателен',
                        minLength: { value: 3, message: 'Минимум 3 символа' },
                        maxLength: { value: 8, message: 'Максимум 8 символов' }
                    })}
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
                    startIcon={<UserPlus size={20} />}
                    disabled={loading}
                    fullWidth
                >
                    {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </Box>
        </form>
    );
};