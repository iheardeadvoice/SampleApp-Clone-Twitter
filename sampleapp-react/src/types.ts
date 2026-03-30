export type User = {
    id: number;
    name: string;
    login: string;
    token?: string;
};

export type LoginData = {
    login: string;
    password: string;
};

export type RegisterData = {
    login: string;
    password: string;
    name?: string;
};