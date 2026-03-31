import { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Eye, EyeOff } from 'lucide-react';

type FormInputProps = {
    label: string;
    name: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    required?: boolean;
    disabled?: boolean;
    endAdornment?: React.ReactNode;
};

export const FormInput = ({
    label,
    name,
    type = 'text',
    value = '',
    onChange,
    onBlur,
    error,
    touched,
    required,
    disabled,
    endAdornment,
}: FormInputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    const fieldType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const defaultEndAdornment = isPassword ? (
        <InputAdornment position="end">
            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </IconButton>
        </InputAdornment>
    ) : null;

    return (
        <TextField
            fullWidth
            label={label}
            name={name}
            type={fieldType}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            error={touched && !!error}
            helperText={touched && error}
            required={required}
            disabled={disabled}
            InputProps={{
                endAdornment: endAdornment || defaultEndAdornment,
            }}
        />
    );
};