import { createContext, useState, useContext, type ReactNode } from 'react';

type LoadingContextType = {
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    withLoading: <T>(promise: Promise<T>) => Promise<T>;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (loading: boolean) => {
        setIsLoading(loading);
    };

    const withLoading = async <T,>(promise: Promise<T>): Promise<T> => {
        try {
            setIsLoading(true);
            return await promise;
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
    };

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading, withLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within LoadingProvider');
    }
    return context;
};