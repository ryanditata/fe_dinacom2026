import { Navigate, Outlet } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";

const TeamMiddleware = () => {
  const { data } = useUserProfile();

  if(!data?.team) return <Navigate to="/dashboard/competition/choose-role" replace />;
  
  return <Outlet />;
};

export default TeamMiddleware;
