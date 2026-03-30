// Временная заглушка (пока нет эндпоинта на бэкенде)
export const checkLoginUnique = async (login: string): Promise<boolean> => {
    console.log('Checking login uniqueness:', login);
    // Всегда возвращаем true, так как эндпоинт еще не реализован
    return true;
};