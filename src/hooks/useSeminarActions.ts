import { useState } from "react";
import { seminarService } from "../services/seminar/seminar-service";
import { toast } from "react-toastify";


export const useSeminarActions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);


    const registerSeminar = async (registrationData: FormData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await seminarService.registerSeminar(
                registrationData
            );
            if (response.data.meta.success) {
                setSuccess(true);
                toast.success("Seminar registration successful!");
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
        success,
        registerSeminar,
        reset,
    };
};
