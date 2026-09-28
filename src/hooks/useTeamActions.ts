import { useState } from "react";
import { mutate } from "swr";
import { teamService } from "../services/team/team-service";
import { useNavigate } from "react-router-dom";

export const useTeamActions = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const createTeam = async (teamData: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.createTeam(
        teamData
      );
      if (response.data.meta.success) {
        await mutate('user-profile')
        setSuccess(true);
        navigate("/dashboard/competition/team-detail")
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
    } finally {
      setLoading(false)
    }
  }

  const joinTeam = async (invitationCode: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.joinTeam(
        invitationCode
      );
      if (response.data.meta.success) {
        await mutate('user-profile')
        setSuccess(true);
        navigate("/dashboard/competition/team-detail")
      }
    } catch (err: any) {
      const teamCodeError = err.response?.data?.errors?.team_code;

      if (teamCodeError) {
        setError("Invitation code invalid");
        return;
      }

      setError(err.response?.data?.meta?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    loading,
    error,
    success,
    createTeam,
    joinTeam,
    reset
  };
};
