import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { PenSquare } from 'lucide-react';
import { createMicropost } from '../../api/microposts';
import { useAuth } from '../../contexts/AuthContext';

type Props = {
  onCreated: () => void | Promise<void>;
};

export const CreatePostCard = ({ onCreated }: Props) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 280;

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setSaving(true);
      setError('');
      await createMicropost(content.trim());
      setContent('');
      await onCreated();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Не удалось опубликовать пост');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 4,
        boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
            {user?.login?.[0]?.toUpperCase() || '?'}
          </Avatar>

          <Box flex={1}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Что нового?
            </Typography>

            <TextField
              fullWidth
              multiline
              minRows={3}
              maxRows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Поделись мыслями..."
              inputProps={{ maxLength }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 2 }}
            >
              <Typography
                variant="body2"
                color={content.length > maxLength - 20 ? 'warning.main' : 'text.secondary'}
              >
                {content.length}/{maxLength}
              </Typography>

              <Button
                variant="contained"
                startIcon={<PenSquare size={18} />}
                disabled={saving || !content.trim()}
                onClick={handleSubmit}
                sx={{ borderRadius: 999 }}
              >
                {saving ? 'Публикация...' : 'Опубликовать'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};