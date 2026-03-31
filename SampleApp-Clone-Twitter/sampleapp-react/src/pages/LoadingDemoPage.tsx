import { useState } from 'react';
import { Container, Typography, Box, Paper, Button, Stack, Alert, LinearProgress } from '@mui/material';
import { Loader2, Zap, Layers, Info } from 'lucide-react';
import { useLoading } from '../contexts/LoadingContext';
import { getUsers } from '../api/users';
import { ButtonLoader } from '../components/ButtonLoader';

export const LoadingDemoPage = () => {
    const { withLoading, isLoading } = useLoading();
    const [result, setResult] = useState<string>('');
    const [localLoading, setLocalLoading] = useState(false);

    const simulateRequest = async () => {
        setLocalLoading(true);
        setResult('');
        try {
            await withLoading(getUsers());
            setResult('✅ Данные успешно загружены');
        } catch (error: any) {
            console.error('Error:', error);
            setResult(`❌ Ошибка загрузки: ${error.response?.data?.message || error.message}`);
        } finally {
            setLocalLoading(false);
        }
    };

    const simulateMultipleRequests = async () => {
        setLocalLoading(true);
        setResult('');
        try {
            await withLoading(Promise.all([
                getUsers(),
                getUsers(), // Второй запрос на получение пользователей (работает)
                getUsers()  // Третий запрос
            ]));
            setResult('✅ Все запросы выполнены успешно');
        } catch (error: any) {
            console.error('Error:', error);
            setResult(`❌ Ошибка при выполнении запросов: ${error.response?.data?.message || error.message}`);
        } finally {
            setLocalLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                    <Loader2 size={32} color="#1976d2" />
                    <Typography variant="h4">Демонстрация лоадера</Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 4 }}>
                    <Typography variant="body2">
                        Глобальный лоадер появляется при любом HTTP запросе и блокирует интерфейс.
                        Счетчик запросов отслеживает множественные запросы.
                    </Typography>
                </Alert>

                <Stack spacing={3}>
                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Состояние загрузки
                        </Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box sx={{ flex: 1 }}>
                                <LinearProgress
                                    variant={isLoading ? 'indeterminate' : 'determinate'}
                                    value={isLoading ? 0 : 100}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                            <Typography>
                                {isLoading ? 'Активен' : 'Не активен'}
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Тестовые запросы
                        </Typography>
                        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            <Button
                                variant="contained"
                                onClick={simulateRequest}
                                disabled={localLoading}
                                startIcon={localLoading ? <ButtonLoader /> : <Zap size={18} />}
                            >
                                Одиночный запрос
                            </Button>

                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={simulateMultipleRequests}
                                disabled={localLoading}
                                startIcon={localLoading ? <ButtonLoader /> : <Layers size={18} />}
                            >
                                Множественные запросы
                            </Button>
                        </Stack>

                        {result && (
                            <Alert severity={result.includes('✅') ? 'success' : 'error'} sx={{ mt: 2 }}>
                                {result}
                            </Alert>
                        )}
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                        <Box display="flex" gap={2}>
                            <Info size={20} color="#666" />
                            <Typography variant="body2" color="text.secondary">
                                Глобальный лоадер автоматически отслеживает все HTTP запросы через axios интерцепторы.
                                При множественных запросах лоадер остается активным до завершения последнего.
                            </Typography>
                        </Box>
                    </Paper>
                </Stack>
            </Paper>
        </Container>
    );
};