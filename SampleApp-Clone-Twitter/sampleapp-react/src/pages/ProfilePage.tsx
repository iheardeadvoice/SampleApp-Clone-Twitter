import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import {
  ArrowLeft,
  Edit,
  RefreshCw,
  UserPlus,
  UserMinus,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserById } from '../api/users';
import { getUserFeed } from '../api/feed';
import {
  followUser,
  getFollowers,
  getFollowState,
  getFollowing,
  unfollowUser,
} from '../api/relations';
import type { FeedPost, FollowState, User, UserPreview } from '../types';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostCard } from '../components/feed/CreatePostCard';

export const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [followers, setFollowers] = useState<UserPreview[]>([]);
  const [following, setFollowing] = useState<UserPreview[]>([]);
  const [social, setSocial] = useState<FollowState | null>(null);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [error, setError] = useState('');

  const profileId = Number(id);
  const isOwnProfile = currentUser?.id === profileId;

  const loadProfile = async () => {
    if (!profileId) return;

    try {
      setLoading(true);
      setError('');

      const [userData, postsData, followersData, followingData, socialData] =
        await Promise.all([
          getUserById(profileId),
          getUserFeed(profileId),
          getFollowers(profileId),
          getFollowing(profileId),
          getFollowState(profileId),
        ]);

      setProfile(userData);
      setPosts(postsData);
      setFollowers(followersData);
      setFollowing(followingData);
      setSocial(socialData);
    } catch {
      setError('Не удалось загрузить профиль');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const handleFollowToggle = async () => {
    if (!profile || isOwnProfile || !social) return;

    try {
      setFollowLoading(true);

      if (social.isFollowing) {
        await unfollowUser(profile.id);
      } else {
        await followUser(profile.id);
      }

      await loadProfile();
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="text.secondary">Загрузка профиля...</Typography>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Профиль не найден'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, borderRadius: 999 }}
      >
        Назад
      </Button>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              borderRadius: 5,
              background:
                'linear-gradient(180deg, rgba(29,155,240,0.10), rgba(124,58,237,0.08))',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main' }}>
                    {profile.login[0]?.toUpperCase()}
                  </Avatar>

                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {profile.name || profile.login}
                    </Typography>
                    <Typography color="text.secondary">@{profile.login}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip label={`Подписчики: ${social?.followersCount ?? 0}`} />
                  <Chip label={`Подписки: ${social?.followingCount ?? 0}`} />
                  <Chip label={`Посты: ${posts.length}`} color="primary" />
                </Stack>

                {isOwnProfile ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit size={18} />}
                    onClick={() => navigate(`/profile/${profile.id}/edit`)}
                    sx={{ borderRadius: 999 }}
                  >
                    Редактировать профиль
                  </Button>
                ) : (
                  <Button
                    variant={social?.isFollowing ? 'outlined' : 'contained'}
                    color={social?.isFollowing ? 'inherit' : 'primary'}
                    startIcon={
                      social?.isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />
                    }
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    sx={{ borderRadius: 999 }}
                  >
                    {followLoading
                      ? 'Подожди...'
                      : social?.isFollowing
                      ? 'Отписаться'
                      : 'Подписаться'}
                  </Button>
                )}

                <Button
                  variant="text"
                  startIcon={<RefreshCw size={18} />}
                  onClick={loadProfile}
                  sx={{ borderRadius: 999 }}
                >
                  Обновить профиль
                </Button>
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, mt: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Users size={18} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Подписчики
                </Typography>
              </Stack>

              {followers.length === 0 ? (
                <Typography color="text.secondary">Пока нет подписчиков</Typography>
              ) : (
                <List dense>
                  {followers.slice(0, 8).map((item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => navigate(`/profile/${item.id}`)}
                    >
                      <ListItemText
                        primary={item.name || item.login}
                        secondary={`@${item.login}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, mt: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 800 }}>
                Подписки
              </Typography>

              {following.length === 0 ? (
                <Typography color="text.secondary">Пока нет подписок</Typography>
              ) : (
                <List dense>
                  {following.slice(0, 8).map((item) => (
                    <ListItemButton
                      key={item.id}
                      onClick={() => navigate(`/profile/${item.id}`)}
                    >
                      <ListItemText
                        primary={item.name || item.login}
                        secondary={`@${item.login}`}
                      />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          {isOwnProfile && <CreatePostCard onCreated={loadProfile} />}

          <Paper sx={{ p: 3, borderRadius: 4, mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Посты пользователя
            </Typography>
            <Typography color="text.secondary">
              @{profile.login}
            </Typography>
          </Paper>

          {posts.length === 0 ? (
            <Paper sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Здесь пока пусто
              </Typography>
              <Typography color="text.secondary">
                У пользователя ещё нет постов.
              </Typography>
            </Paper>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onChanged={loadProfile} />
            ))
          )}
        </Grid>
      </Grid>
    </Container>
  );
};