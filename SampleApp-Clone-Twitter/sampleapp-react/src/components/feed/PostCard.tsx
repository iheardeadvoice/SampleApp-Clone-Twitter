import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  Heart,
  MessageCircle,
  Send,
  Trash2,
  LoaderCircle,
} from 'lucide-react';
import type { FeedPost, PostComment } from '../../types';
import { toggleLike } from '../../api/likes';
import {
  createComment,
  deleteComment,
  getCommentsByMicropost,
} from '../../api/comments';
import { deleteMicropost } from '../../api/microposts';

type Props = {
  post: FeedPost;
  onChanged?: () => void | Promise<void>;
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const PostCard = ({ post, onChanged }: Props) => {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');
  const [likeLoading, setLikeLoading] = useState(false);
  const [commentSaving, setCommentSaving] = useState(false);
  const [postDeleting, setPostDeleting] = useState(false);

  useEffect(() => {
    setLiked(post.isLikedByCurrentUser);
    setLikeCount(post.likeCount);
    setCommentCount(post.commentCount);
  }, [post]);

  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const data = await getCommentsByMicropost(post.id);
      setComments(data);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = async () => {
    const next = !commentsOpen;
    setCommentsOpen(next);

    if (next) {
      await loadComments();
    }
  };

  const handleToggleLike = async () => {
    try {
      setLikeLoading(true);
      const result = await toggleLike(post.id);
      setLiked(result.isLiked);
      setLikeCount(result.likeCount);
      await onChanged?.();
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCreateComment = async () => {
    if (!commentText.trim()) return;

    try {
      setCommentSaving(true);
      setCommentError('');
      await createComment(post.id, commentText.trim());
      setCommentText('');
      setCommentCount((prev) => prev + 1);
      await loadComments();
      await onChanged?.();
    } catch (err: any) {
      setCommentError(
        err?.response?.data?.message || 'Не удалось добавить комментарий'
      );
    } finally {
      setCommentSaving(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setCommentCount((prev) => Math.max(prev - 1, 0));
      await loadComments();
      await onChanged?.();
    } catch {
      setCommentError('Не удалось удалить комментарий');
    }
  };

  const handleDeletePost = async () => {
    const ok = window.confirm('Удалить этот пост?');
    if (!ok) return;

    try {
      setPostDeleting(true);
      await deleteMicropost(post.id);
      await onChanged?.();
    } finally {
      setPostDeleting(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 4,
        boxShadow: '0 12px 40px rgba(15, 23, 42, 0.06)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <Avatar
            sx={{ bgcolor: 'secondary.main', cursor: 'pointer' }}
            onClick={() => navigate(`/profile/${post.author.id}`)}
          >
            {post.author.login[0]?.toUpperCase()}
          </Avatar>

          <Box flex={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, cursor: 'pointer' }}
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                >
                  {post.author.name || post.author.login}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  @{post.author.login} • {formatDate(post.createdAt)}
                </Typography>
              </Box>

              {post.isOwner && (
                <IconButton
                  color="error"
                  onClick={handleDeletePost}
                  disabled={postDeleting}
                >
                  {postDeleting ? <LoaderCircle size={18} /> : <Trash2 size={18} />}
                </IconButton>
              )}
            </Stack>

            <Typography
              variant="body1"
              sx={{ mt: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {post.content}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button
                variant={liked ? 'contained' : 'text'}
                color={liked ? 'error' : 'inherit'}
                startIcon={<Heart size={18} />}
                onClick={handleToggleLike}
                disabled={likeLoading}
                sx={{ borderRadius: 999 }}
              >
                {likeCount}
              </Button>

              <Button
                variant={commentsOpen ? 'contained' : 'text'}
                startIcon={<MessageCircle size={18} />}
                onClick={handleToggleComments}
                sx={{ borderRadius: 999 }}
              >
                {commentCount}
              </Button>
            </Stack>

            <Collapse in={commentsOpen}>
              <Divider sx={{ my: 2 }} />

              <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  maxRows={4}
                  placeholder="Напиши комментарий..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />

                <IconButton
                  color="primary"
                  onClick={handleCreateComment}
                  disabled={commentSaving || !commentText.trim()}
                >
                  <Send size={18} />
                </IconButton>
              </Stack>

              {commentError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {commentError}
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                {commentsLoading ? (
                  <Typography color="text.secondary">Загрузка комментариев...</Typography>
                ) : comments.length === 0 ? (
                  <Typography color="text.secondary">
                    Пока нет комментариев
                  </Typography>
                ) : (
                  <List disablePadding>
                    {comments.map((comment) => (
                      <ListItem
                        key={comment.id}
                        disableGutters
                        secondaryAction={
                          comment.isOwner ? (
                            <IconButton
                              edge="end"
                              color="error"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          ) : null
                        }
                        sx={{ py: 1.25 }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}
                          >
                            {comment.userLogin[0]?.toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              flexWrap="wrap"
                            >
                              <Typography
                                variant="subtitle2"
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${comment.userId}`)}
                              >
                                {comment.userName || comment.userLogin}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                @{comment.userLogin}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                • {formatDate(comment.createdAt)}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Typography
                              variant="body2"
                              color="text.primary"
                              sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}
                            >
                              {comment.content}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            </Collapse>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};