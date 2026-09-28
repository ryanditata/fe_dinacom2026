import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import * as Yup from "yup";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/auth-service";

const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const registerSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Confirm password does not match")
      .required("Confirm password is required"),
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await registerSchema.validate(
        { email, password, confirmPassword },
        { abortEarly: false }
      );

      setLoading(true);

      const data = await authService().register(
        email,
        password,
        confirmPassword
      );

      if (data == "failed") {
        toast.error(data.message || "Error registering, please try again!", {
          position: "top-right",
        });
      } else {
        toast.success(
          "Registration successful! Please check your email for verification.",
          {
            position: "top-right",
          }
        );
        localStorage.setItem("emailForVerification", email);
        navigate("/verify");
      }
    } catch (err: any) {
      // kalau error dari Yup (client-side)
      if (err.inner) {
        const fieldErrors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
        return;
      }

      if (err.errors) {
        const serverErrors = err.errors;
        const fieldErrors: Record<string, string> = {};
        Object.keys(serverErrors).forEach((key) => {
          fieldErrors[key] = serverErrors[key][0];
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form.", { position: "top-right" });
        return;
      }

      toast.error(err.meta?.message ?? "Error registering, please try again!", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>, field: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <form
        onSubmit={handleRegister}
        className="bg-white z-10 shadow-lg rounded-xl p-8 w-100"
      >
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
            className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${
              errors.email
                ? "border-red-500 focus:border-red-500"
                : "border-gray-300 focus:border-blue-600"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handleChange(setPassword, "password")}
              className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${
                errors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-orange-600 hover:text-orange-500"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange(setConfirmPassword, "confirmPassword")}
              className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${
                errors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-orange-600 hover:text-orange-500"
            >
              {showConfirm ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-500"
          } text-white font-semibold py-2 rounded mt-4 transition-all cursor-pointer`}
        >
          {loading ? "Processing..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-700 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-700 hover:underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
