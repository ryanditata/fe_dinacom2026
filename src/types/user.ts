import type { TeamData } from "./team";

export type UserInfo = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  institution?: string | null;
  education_level?: string | null;
  url_ktm?: string | null;
  url_twibbon?: string | null;
  url_proof_follow_instagram_dncc?: string | null;
  url_proof_follow_instagram_dinacom?: string | null;
  is_leader?: boolean;
  team?: TeamData | null;
};