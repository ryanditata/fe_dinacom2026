import api from "../../libs/api";

export const authService = () => {

    const BASE_URL_AUTH = `${import.meta.env.VITE_API_URL}/auth`

    const register = async (email: string, password: string, confirmPassword: string) => {
        const response = await fetch(
            `${BASE_URL_AUTH}/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    password_confirmation: confirmPassword,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            return data;
        }

        throw data;
    }

    const login = async (email: string, password: string) => {
        const response = await fetch(`${BASE_URL_AUTH}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        }

        throw data;
    }

    const logout = async () => api.post(`/auth/logout`);

    return {
        register,
        login,
        logout,
    }
}