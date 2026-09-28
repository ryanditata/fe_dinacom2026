import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

export const seminarService = {
    registerSeminar: (registrationData: FormData) => api.post<ApiResponse<null>>('/public/seminar', registrationData),
}