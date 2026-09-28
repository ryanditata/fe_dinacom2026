import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

export const paymentService = {
    savePayment: (teamId: string, paymentData: FormData) => api.post<ApiResponse<null>>(`/teams/${teamId}/payments`, paymentData),
}