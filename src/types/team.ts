import type { FinalSubmission } from "./final-submission";
import type { UserInfo } from "./user";

export type MemberAPI = {
  id: string;
  id_user: string;
  role_in_team: string;
  joined_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user?: UserInfo | null;
};

export type CompetitionInfo = {
  id: string;
  name: string;
  url_community?: string | null;
  url_guidebook?: string | null;
  url_statement_originality_template?: string | null;
  deadline?: string | null; // "2026-08-31 23:59:59"
};

export type TeamData = {
  id?: string;
  team_name?: string;
  team_code?: string;
  category?: string;
  name_advisor?: string;
  url_statement_originality?: string | null;
  url_proposal?: string | null;
  url_repo_github?: string | null;
  url_presentation?: string | null;
  status?: string | null;
  notes?: string | null;
  competition?: CompetitionInfo | null;
  members?: MemberAPI[] | null;
  payment?: any | null;
  submission_status?: { proposal?: string; statement?: string } | null;
  final_submission_meta: FinalSubmission | null;
};