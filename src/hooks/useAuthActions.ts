import { useState } from "react";
import { verificationService } from "../services/auth/verificaton-service";
import { toast } from "react-toastify";
import { authService } from "../services/auth/auth-service";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


export const useAuthActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const navigate = useNavigate();

  const verifyEmail = async (token: string) => {
    setLoading(true);

    try {
      const response = await verificationService.verifyEmail(token);
      if (response.data.meta.success) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const requestResetPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verificationService.requestResetPassword(email);
      if (response.data.meta.success) {
        setSuccess(true);
        toast.success("Success sending password reset", {
          position: "top-right"
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
      toast.error(err.response?.data?.meta?.message || "An error occurred", {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  }

  const verifyResetToken = async (token: string, payload: { password: string; passwordConfirmation: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verificationService.verifyResetToken(token, payload);
      if (response.data.meta.success) {
        setSuccess(true);
        toast.success("Success verifying reset token", {
          position: "top-right"
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
      toast.error(err.response?.data?.meta?.message || "An error occurred", {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  }

  const resendVerificationEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await verificationService.resendVerificationEmail(email);
      if (response.data.meta.success) {
        setSuccess(true);
        toast.success("Verification email resent successfully", {
          position: "top-right"
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
      toast.error(err.response?.data?.meta?.message || "An error occurred", {
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService().logout();
      if (response.data.meta.success) {
        setSuccess(true);
        Cookies.remove(import.meta.env.VITE_SITE_COOKIES);
        navigate("/login");
        toast.success("Logout successful", {
          position: "top-right"
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.meta?.message || "An error occurred");
      toast.error(err.response?.data?.meta?.message || "An error occurred", {
        position: "top-right"
      });
    }
    finally {
      setLoading(false);
    }
  }



  return {
    loading,
    error,
    success,
    verifyEmail,
    requestResetPassword,
    verifyResetToken,
    resendVerificationEmail,
    logout,
  };
};
