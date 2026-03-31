import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Alert,
  Avatar,
} from '@mui/material';
import {
  Home,
  LogIn,
  RefreshCw,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFeed } from '../api/feed';
import { getFollowState } from '../api/relations';
import type { FeedPost, FollowState } from '../types';
import { CreatePostCard } from '../components/feed/CreatePostCard';
import { PostCard } from '../components/feed/PostCard';

export const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [social, setSocial] = useState<FollowState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadFeed = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError('');

      const [feedData, socialData] = await Promise.all([
        getFeed(),
        getFollowState(user.id),
      ]);

      setPosts(feedData);
      setSocial(socialData);
    } catch {
      setError('Не удалось загрузить ленту');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, [user?.id]);

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Paper
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 6,
            background:
              'linear-gradient(135deg, rgba(29,155,240,0.10), rgba(124,58,237,0.10))',
          }}
        >
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}>
              <Sparkles size={36} />
            </Avatar>

            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Локальная mini-Twitter лента
            </Typography>

            <Typography variant="h6" color="text.secondary" maxWidth={720}>
              После входа у тебя будет лента, подписки, подписчики, лайки,
              комментарии и персональные профили.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<LogIn size={20} />}
                onClick={() => navigate('/login')}
                sx={{ borderRadius: 999 }}
              >
                Войти
              </Button>

              <Button
                variant="outlined"
                size="large"
                startIcon={<UserPlus size={20} />}
                onClick={() => navigate('/register')}
                sx={{ borderRadius: 999 }}
              >
                Регистрация
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Card sx={{ borderRadius: 4, mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {user.login[0]?.toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>
                      {user.name || user.login}
                    </Typography>
                    <Typography color="text.secondary">@{user.login}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Подписчики: ${social?.followersCount ?? 0}`} />
                  <Chip label={`Подписки: ${social?.followingCount ?? 0}`} />
                  <Chip label={`Посты в ленте: ${posts.length}`} color="primary" />
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<Users size={18} />}
                  onClick={() => navigate('/users')}
                  sx={{ borderRadius: 999 }}
                >
                  Найти людей
                </Button>

                <Button
                  variant="text"
                  onClick={() => navigate(`/profile/${user.id}`)}
                  sx={{ borderRadius: 999 }}
                >
                  Открыть мой профиль
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: 800 }}>
                Как это работает
              </Typography>
              <Typography color="text.secondary">
                В ленте показываются твои посты и посты тех, на кого ты
                подписан. Подписаться можно из профиля пользователя.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CreatePostCard onCreated={loadFeed} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Лента
            </Typography>

            <Button
              startIcon={<RefreshCw size={18} />}
              onClick={loadFeed}
              disabled={loading}
              sx={{ borderRadius: 999 }}
            >
              Обновить
            </Button>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Typography color="text.secondary">Загрузка ленты...</Typography>
          ) : posts.length === 0 ? (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Лента пока пустая
              </Typography>
              <Typography color="text.secondary">
                Напиши первый пост или подпишись на других пользователей.
              </Typography>
            </Paper>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onChanged={loadFeed} />
            ))
          )}
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Card
            sx={{
              borderRadius: 4,
              background:
                'linear-gradient(180deg, rgba(29,155,240,0.08), rgba(124,58,237,0.06))',
            }}
          >
            
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};