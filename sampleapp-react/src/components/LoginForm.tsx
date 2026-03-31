import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Alert, TextField, InputAdornment, IconButton } from '@mui/material';
import { LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ButtonLoader } from './ButtonLoader';

type FormData = {
    login: string;
    password: string;
};

export const LoginForm = ({ onSuccess }: { onSuccess?: () => void }) => {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            login: '',
            password: '',
        },
    });

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
                    fullWidth
                    label="Логин"
                    {...register('login', { required: 'Логин обязателен' })}
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
                        minLength: { value: 3, message: 'Минимум 3 символа' }
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

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={loading ? <ButtonLoader /> : <LogIn size={20} />}
                    disabled={!isValid || loading}
                >
                    {loading ? 'Вход...' : 'Войти'}
                </Button>
            </Box>
        </form>
    );
};