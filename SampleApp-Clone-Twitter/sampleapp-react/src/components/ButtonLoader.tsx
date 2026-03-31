import { CircularProgress } from '@mui/material';

type ButtonLoaderProps = {
    size?: number;
    color?: string;
};

export const ButtonLoader = ({ size = 20, color = '#fff' }: ButtonLoaderProps) => (
    <CircularProgress size={size} sx={{ color }} />
);