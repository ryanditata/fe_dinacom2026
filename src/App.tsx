import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/register";
import NotFound from './pages/NotFound'
import DashboardLayout from './layout/dashboard/DashboardLayout'
import Verify from "./pages/auth/Verify";
import RequestReset from "./pages/auth/RequestReset";
import VerifyReset from "./pages/auth/VerifyReset";
import Profile from "./pages/profile/Profile";
import EditProfile from "./pages/profile/EditProfile";
import CompleteProfile from "./pages/profile/CompleteProfile";
import Submissions from "./pages/submissions/Submissions";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import MemberForm from "./pages/competition/MemberForm";
import TeamDetail from "./pages/competition/TeamDetail";
import ChooseRole from "./pages/competition/ChooseRole";
import FormLeader from "./pages/competition/FormLeader";
import AuthMiddleware from "./middleware/AuthMiddleware";
import TeamMiddleware from "./middleware/TeamMiddleware";
import Competition from "./pages/competition/Competition";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ChooseCategorySeminar from "./pages/seminar/ChooseCategorySeminar";
import SingleRegisterSeminar from "./pages/seminar/SingleRegisterSeminar";
import BundlingRegisterSeminar from "./pages/seminar/BundlingRegisterSeminar";
import SuccessRegisterSeminar from "./pages/seminar/SuccessRegisterSeminar";

function App() {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Halaman utama */}
        <Route index element={<LandingPage />} />
        {/* Halaman Register */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/reset-password" element={<RequestReset />} />
        <Route path="/reset-password/:token" element={<VerifyReset />} />
        <Route path="/seminar/choose-category" element={<ChooseCategorySeminar />} />
        <Route path="/seminar/single-register" element={<SingleRegisterSeminar />} />
        <Route path="/seminar/bundling-register" element={<BundlingRegisterSeminar />} />
        <Route path="/seminar/success-register" element={<SuccessRegisterSeminar />} />

        <Route element={<AuthMiddleware />}>
          <Route element={<DashboardLayout />}>
            <Route index path="dashboard" element={<Navigate to="/dashboard/competition" />} />
            <Route path="dashboard/profile" element={<Profile />} />
            <Route path="dashboard/profile/edit" element={<EditProfile />} />

            <Route path="dashboard/competition" element={
              <Competition/>
            } />
            <Route path="dashboard/competition/choose-role" element={<ChooseRole />} />
            <Route path="dashboard/competition/join" element={<MemberForm />} />
            <Route path="dashboard/competition/form-leader" element={<FormLeader />} />

            <Route element={<TeamMiddleware />}>
              <Route path="dashboard/competition/team-detail" element={<TeamDetail />} />
            </Route>
            <Route path="dashboard/submissions" element={<Submissions />} />
          </Route>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          
        </Route>


        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
