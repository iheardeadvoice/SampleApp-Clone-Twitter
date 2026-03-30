import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

export const LoadingSpinner = () => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="200px" gap={2}>
    <CircularProgress />
    <Typography color="text.secondary">Загрузка...</Typography>
  </Box>
);