import api from "../../libs/api";
import type { ApiResponse } from "../../types/api-response";

export const teamService = {
    createTeam: (teamData: FormData) => api.post<ApiResponse<null>>(`/teams/create`, teamData),
    joinTeam: (invitationCode: String) => api.post<ApiResponse<null>>(`/teams/join`, { 
        team_code: invitationCode
     })
}