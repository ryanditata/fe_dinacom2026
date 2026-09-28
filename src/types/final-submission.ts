export interface FinalSubmission {
    team_id: string;
    current_step: number;
    submission: Submission;
    settings: SettingSubmission;
}

interface Submission {
    id: string;
    id_team: string;
    link_repo?: string | null;
    link_youtube?: string | null;
    link_pitchdeck?: string | null;
    link_result_first_progress?: string | null;
    link_result_second_progress?: string | null;
    link_result_final?: string | null;
    progress_details?: DetailProgress[];
    created_at: string;
    updated_at: string;
}



export interface DetailProgress {
    id?: string;
    id_final_submission?: string;
    link_commit: string;
    description: string;
    type_progress: "first_progress" | "second_progress" | "final";
    created_at?: string;
    updated_at?: string;
}

interface SettingSubmission {
    is_open_start: boolean;
    is_open_first_progress: boolean;
    is_open_second_progress: boolean;
    is_open_final: boolean;
}