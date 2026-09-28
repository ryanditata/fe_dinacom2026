import { useState } from "react";
import * as Yup from "yup";
import { useAuthActions } from "../../hooks/useAuthActions";
import { useParams } from "react-router-dom";

const VerifyReset = () => {

    const { token } = useParams<{ token: string }>();

    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState<{ password?: string; passwordConfirmation?: string }>({});
    const { verifyResetToken, loading } = useAuthActions();

    const loginSchema = Yup.object().shape({
        password: Yup.string()
            .min(8, "Password must be at least 8 characters")
            .required("Password must be filled"),
        passwordConfirmation: Yup.string()
            .required("Password confirmation must be filled"),
    });

    const handleVerifyReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        try {
            let payload = {
                password: password,
                passwordConfirmation: passwordConfirmation
            }
            await loginSchema.validate({ password, passwordConfirmation }, { abortEarly: false });
            if (!token) return;
            verifyResetToken(token, payload);
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
        } catch (err: any) {
            if (err.inner) {
                const fieldErrors: any = {};
                err.inner.forEach((e: any) => {
                    fieldErrors[e.path] = e.message;
                });
                setErrors(fieldErrors);
            }        
        }
    };

     const handleChange =
        (setter: React.Dispatch<React.SetStateAction<string>>, field: "password" | "passwordConfirmation") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
          setter(e.target.value);
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        };


    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
            <form onSubmit={handleVerifyReset} noValidate className="bg-white shadow-lg rounded-xl p-8 w-100">
                <div className="flex justify-center mb-8">
                    <img src="/logo_dinacom.png" alt="logo" className="w-48 object-contain" />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handleChange(setPassword, "password")}
                        className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.password
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-semibold mb-1">Password Confirmation</label>
                    <input
                        type="password"
                        placeholder="Password Confirmation"
                        value={passwordConfirmation}
                        onChange={handleChange(setPasswordConfirmation, "passwordConfirmation")}
                        className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.passwordConfirmation
                                ? "border-red-500 focus:border-red-500"
                                : "border-gray-300 focus:border-blue-600"
                            }`}
                    />
                    {errors.passwordConfirmation && <p className="text-red-500 text-sm mt-1">{errors.passwordConfirmation}</p>}
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
        </div>
    )
}

export default VerifyReset