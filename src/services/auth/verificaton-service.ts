import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

export const verificationService = {
    verifyEmail: (token: string) => api.get<ApiResponse<null>>(`/auth/verify-email/${token}`),
    requestResetPassword: (email: string) => api.post<ApiResponse<null>>(`/auth/reset-password`, { email }),
    verifyResetToken: (token: string, {
        password,
        passwordConfirmation
    }: {
        password: string;
        passwordConfirmation: string;
    }
    ) => api.put<ApiResponse<null>>(`/auth/verify-reset-password/${token}`, {
        password,
        password_confirmation: passwordConfirmation,
    }),
    resendVerificationEmail: (email: string) => api.post<ApiResponse<null>>(`/auth/resend-verification-email`, { email }),

}