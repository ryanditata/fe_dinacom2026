import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

interface finalPayload {
    link_youtube: string | null;
    link_pitchdeck: string | null;
    link_result_final: string | null;
}

export const finalSubmissionService = {
    start: (teamId: string, link_repo: string) => api.post<ApiResponse<null>>(`/teams/${teamId}/final-submission/start`, { 
        link_repo
     }),

    progress: (teamId: string, formData: FormData) => api.post<ApiResponse<null>>(`/teams/${teamId}/final-submission/progress`, formData),

    final: (teamId: string, payload: finalPayload) => api.put<ApiResponse<null>>(`/teams/${teamId}/final-submission`, payload),
     
}