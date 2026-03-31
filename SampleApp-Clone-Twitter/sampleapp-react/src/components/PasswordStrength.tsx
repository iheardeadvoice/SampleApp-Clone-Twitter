import { Box, LinearProgress, Typography } from '@mui/material';

type PasswordStrengthProps = {
    password: string;
};

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
    const getStrength = () => {
        if (!password) return 0;
        if (password.length < 4) return 25;
        if (password.length < 6) return 50;
        if (password.length < 8) return 75;
        return 100;
    };

    const getColor = () => {
        if (!password) return 'primary';
        if (password.length < 4) return 'error';
        if (password.length < 6) return 'warning';
        return 'success';
    };

    const getLabel = () => {
        if (!password) return '';
        if (password.length < 4) return 'Слабый';
        if (password.length < 6) return 'Средний';
        if (password.length < 8) return 'Хороший';
        return 'Отличный';
    };

    const strength = getStrength();
    const color = getColor();
    const label = getLabel();

    if (!password) return null;

    return (
        <Box sx={{ mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" color="text.secondary">
                    Сложность пароля:
                </Typography>
                <Typography variant="caption" color={`${color}.main`}>
                    {label}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={strength}
                color={color}
                sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
            />
        </Box>
    );
};