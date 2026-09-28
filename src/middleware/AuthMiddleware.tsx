import { Navigate, Outlet } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

const AuthMiddleware = () => {
  const { data, loading, error } = useUserProfile();

  if (loading) return <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loader">
          <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600">Loading...</p>
    </div>;

  if (error || !data) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthMiddleware;
