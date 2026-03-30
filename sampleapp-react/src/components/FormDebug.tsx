import { Paper, Typography, Box, Chip } from '@mui/material';

type FormDebugProps = {
    values: any;
    errors: any;
    touched: any;
    isValid: boolean;
    isDirty: boolean;
};

export const FormDebug = ({ values, errors, touched, isValid, isDirty }: FormDebugProps) => {
    if (import.meta.env.PROD) return null;

    return (
        <Paper variant="outlined" sx={{ p: 2, mt: 3, bgcolor: '#f5f5f5' }}>
            <Typography variant="subtitle2" gutterBottom>
                Отладка формы
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <Chip 
                    label={`Статус: ${isValid ? '✅ Валидна' : '❌ Невалидна'}`} 
                    size="small"
                    color={isValid ? 'success' : 'error'}
                />
                <Chip 
                    label={`Изменена: ${isDirty ? '✅ Да' : '❌ Нет'}`} 
                    size="small"
                />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        Значения:
                    </Typography>
                    <pre style={{ fontSize: 12, margin: 0 }}>
                        {JSON.stringify(values, null, 2)}
                    </pre>
                </Box>

                <Box>
                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        Ошибки:
                    </Typography>
                    <pre style={{ fontSize: 12, margin: 0, color: '#d32f2f' }}>
                        {JSON.stringify(errors, null, 2)}
                    </pre>
                </Box>

                <Box>
                    <Typography variant="caption" display="block" color="text.secondary" gutterBottom>
                        Touched:
                    </Typography>
                    <pre style={{ fontSize: 12, margin: 0 }}>
                        {JSON.stringify(touched, null, 2)}
                    </pre>
                </Box>
            </Box>
        </Paper>
    );
};