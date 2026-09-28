import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

export const submissionService = {
    saveSubmission: (teamId: string, submissionData: FormData) => api.post<ApiResponse<null>>(`/teams/${teamId}/submission`, submissionData),
}