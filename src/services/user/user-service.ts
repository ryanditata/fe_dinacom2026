import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";
import type { UserInfo } from "../../types/user";

export const userService = {
    getUserProfile: async (): Promise<ApiResponse<UserInfo>> => {
        try {
            const { data, status } = await api.get<ApiResponse<UserInfo>>(`/user/profile`);
            if (status !== 200) {
                throw new Error(data.meta.message || "Internal Server Error");
            }
            return data;
        } catch (err: any) {    
            if (err.response) {
                throw new Error(err.response.data?.message || "Internal Server Error");
            }
            throw err;
        }
    },

    saveProfile: async (userData: FormData) => await api.post<ApiResponse<null>>(`/user/update`, userData),
}