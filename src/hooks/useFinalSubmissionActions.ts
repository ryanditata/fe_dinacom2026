import  { mutate } from "swr";
import { useState } from "react";
import { finalSubmissionService } from "../services/submission/final-submission-service";

interface finalPayload {
    link_youtube: string | null;
    link_pitchdeck: string | null;
    link_result_final: string | null;
}

export const useFinalSubmissionActions = () => {
 const [loading, setLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);
   const [success, setSuccess] = useState<boolean>(false);

   const submitStart = async (linkRepo: string, teamId: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await finalSubmissionService.start(teamId, linkRepo);
        if (response.data.meta.success) {
          setSuccess(true);
          mutate(`user-profile`);
        }
      } catch (err: any) {
        setError(err.response?.data?.meta?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const submitProgress = async (formData: FormData, teamId: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await finalSubmissionService.progress(teamId, formData);
        if (response.data.meta.success) {
          setSuccess(true);
          mutate(`user-profile`);
        }
      } catch (err: any) {
        setError(err.response?.data?.meta?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    const submitFinal = async (formData: finalPayload, teamId: string) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const response = await finalSubmissionService.final(teamId, formData);
        if (response.data.meta.success) {
          setSuccess(true);
          mutate(`user-profile`);
        }
      } catch (err: any) {
        setError(err.response?.data?.meta?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };


 
   const reset = () => {
     setLoading(false);
     setError(null);
     setSuccess(false);
   };

  return {
    loading,
    error,
    submitStart,
    submitProgress,
    submitFinal,
    success,
    reset
  };
};
