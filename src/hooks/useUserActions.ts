import { useState } from "react";
import { mutate } from "swr";
import { userService } from "../services/user/user-service";

export const useUserActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const saveProfile = async (userData: FormData) => {
    setLoading(true);
    setError(null);
     try {
      const response = await userService.saveProfile(
        userData
      );
      if (response.data.meta.success) {
        setSuccess(true);
        mutate('user-profile')
      }
    } catch (err: any) {
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
    saveProfile,
    reset
  };
};
