import { Alert, Button, Box } from '@mui/material';

type ErrorMessageProps = {
    message: string;
    onRetry?: () => void;
};

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => (
    <Alert
        severity="error"
        action={
            onRetry && (
                <Button color="inherit" size="small" onClick={onRetry}>
                    Повторить
                </Button>
            )
        }
        sx={{ mb: 2 }}
    >
        {message}
    </Alert>
);