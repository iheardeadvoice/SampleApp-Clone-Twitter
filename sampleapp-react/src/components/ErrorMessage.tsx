import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';
import { RefreshCw } from 'lucide-react';

type Props = {
  message: string;
  onRetry?: () => void;
};

export const ErrorMessage = ({ message, onRetry }: Props) => (
  <Alert
    severity="error"
    action={
      onRetry && (
        <Button color="inherit" size="small" onClick={onRetry} startIcon={<RefreshCw size={18} />}>
          Повторить
        </Button>
      )
    }
  >
    <AlertTitle>Ошибка</AlertTitle>
    {message}
  </Alert>
);