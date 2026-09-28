import { useState } from "react";
import * as Yup from "yup";
import { useAuthActions } from "../../hooks/useAuthActions";
import { ToastContainer } from "react-toastify";

const RequestReset = () => {

    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const { requestResetPassword, loading } = useAuthActions();

    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email must be filled"),
    });

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            await loginSchema.validate({ email }, { abortEarly: false });
            requestResetPassword(email);
            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);
        } catch (err: any) {
            if (err.inner) {
                const fieldErrors: any = {};
                err.inner.forEach((e: any) => {
                    fieldErrors[e.path] = e.message;
                });
                setErrors(fieldErrors);
            } else {
                setErrors({ email: err.message });
            }
        }
    };

     const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>, field: "email") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setter(e.target.value);
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        };


    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
            <form onSubmit={handleRequestReset} noValidate className="bg-white shadow-lg rounded-xl p-8 w-100">
                <div className="flex justify-center mb-8">
                    <img src="/logo_dinacom.png" alt="logo" className="w-48 object-contain" />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={handleChange(setEmail, "email")}
                        className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.email
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>


                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full ${loading ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-500"
                        } text-white font-semibold py-2 rounded mt-4 transition-all cursor-pointer`}>
                    {loading ? "Loading..." : "Send"}
                </button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default RequestReset