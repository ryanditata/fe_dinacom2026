import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/auth-service";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const navigate = useNavigate()


  const [loading, setLoading] = useState(false);

  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      setLoading(true);
      
      await loginSchema.validate({ email, password }, { abortEarly: false })

      const data = await authService().login(email, password);

      if (data == "failed") {
        toast.error(data.message || "Failed to login, please try again!",{
          position: "top-right"
        });
      } else {
        toast.success("Login successful!", {
          position:"top-right"
        });
        navigate('/dashboard/competition');
      }
    } catch (err: any) {
      if (err.inner) {
        const fieldErrors: any = {};
        err.inner.forEach((e: any) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        toast.error(err.meta?.message ?? "Error logging in",{
          position:"top-right"
        })
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      field: "email" | "password"
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F5F5F5]">
      <form
        onSubmit={handleLogin}
        noValidate
        className="bg-white shadow-lg rounded-xl p-8 w-100"
      >
        <div className="flex justify-center mb-8">
          <img
            src="/logo_dinacom.png"
            alt="logo"
            className="w-48 object-contain"
          />
        </div>

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
        </div>

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

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full ${
            loading ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-500"
          } text-white font-semibold py-2 rounded mt-4 transition-all cursor-pointer`}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm text-blue-700 mt-8 ">
          <a href="/reset-password">Forget Password?</a>
        </p>

        <p className="text-center text-sm text-gray-700 mt-2">
          Don’t have an account yet?{" "}
          <a href="/register" className="text-blue-700 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
