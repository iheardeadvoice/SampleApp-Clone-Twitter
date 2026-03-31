import { Box, CircularProgress } from '@mui/material';

type ButtonLoaderProps = {
    size?: number;
    color?: string;
};

export const ButtonLoader = ({ size = 20, color = '#fff' }: ButtonLoaderProps) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={size} sx={{ color }} />
    </Box>
);