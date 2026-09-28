export const generateFileLink = (path: string) => {
    return `${import.meta.env.VITE_API_FILES_URL}/${path}`;
};
