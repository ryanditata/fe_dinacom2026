import { useState } from "react";
import { paymentService } from "../services/team/payment-service";
import { mutate } from "swr";

export const usePaymentActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const savePayment = async (teamId: string, paymentData: FormData) => {
    setLoading(true);
    setError(null);
     try {
      const response = await paymentService.savePayment(
        teamId,
        paymentData
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
    savePayment,
    reset
  };
};
