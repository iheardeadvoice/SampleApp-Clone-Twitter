import { Container, Typography, Box, Paper, Avatar, Button } from '@mui/material';
import { Home, Users, Sparkles, LogIn, UserPlus, Loader2, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <Box display="flex" justifyContent="center" gap={2} mb={3}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 60, height: 60 }}>
                        <Home size={30} />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'secondary.main', width: 60, height: 60 }}>
                        <Users size={30} />
                    </Avatar>
                    <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60 }}>
                        <Sparkles size={30} />
                    </Avatar>
                </Box>

                <Typography variant="h2" gutterBottom>
                    {user ? `Добро пожаловать, ${user.login}!` : 'Добро пожаловать!'}
                </Typography>

                <Typography variant="h5" color="text.secondary" paragraph>
                    SampleApp на React
                </Typography>

                {!user ? (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            startIcon={<LogIn size={20} />} 
                            onClick={() => navigate('/login')}
                        >
                            Войти
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="primary"
                            startIcon={<UserPlus size={20} />} 
                            onClick={() => navigate('/register')}
                        >
                            Регистрация
                        </Button>
                    </Box>
                ) : (
                    <>
                        {token && (
                            <Box mt={3} p={2} bgcolor="#f5f5f5" borderRadius={1}>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    JWT токен активен
                                </Typography>
                            </Box>
                        )}
                        <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Loader2 size={20} />}
                                onClick={() => navigate('/loading-demo')}
                            >
                                Демо лоадера
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Shield size={20} />}
                                onClick={() => navigate('/guards-demo')}
                            >
                                Демо защитников
                            </Button>
                        </Box>
                    </>
                )}
            </Paper>
        </Container>
    );
};