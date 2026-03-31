import { Backdrop, CircularProgress, Typography } from '@mui/material';
import { useLoading } from '../contexts/LoadingContext';

type GlobalLoaderProps = {
    message?: string;
};

export const GlobalLoader = ({ message = 'Загрузка...' }: GlobalLoaderProps) => {
    const { isLoading } = useLoading();

    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: (theme) => theme.zIndex.drawer + 1,
                flexDirection: 'column',
                gap: 2,
            }}
            open={isLoading}
        >
            <CircularProgress color="inherit" size={50} />
            {message && <Typography variant="h6">{message}</Typography>}
        </Backdrop>
    );
};