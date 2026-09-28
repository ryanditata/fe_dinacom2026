import { useState } from "react";
import { mutate } from "swr";
import { submissionService } from "../services/submission/submission-service";

export const useSubmissionActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const saveSubmission = async (teamId: string, submissionData: FormData) => {
    setLoading(true);
    setError(null);
     try {
      const response = await submissionService.saveSubmission(
        teamId,
        submissionData
      );
      if (response.data.meta.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
    } finally {
      mutate('user-profile')
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
    saveSubmission,
    reset
  };
};
