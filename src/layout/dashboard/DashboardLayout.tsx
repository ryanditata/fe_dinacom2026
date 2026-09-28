// layout/dashboard/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { GlobalDataUserProvider } from "../../context/GlobalDataUser";

const DashboardLayout = () => {
  return (
    <>
      <title>Dinacom</title>
      <meta
        name="description"
        content="Dinus Application Competition (DINACOM) adalah kompetisi teknologi informasi nasional yang diselenggarakan oleh Dian Nuswantoro Computer Club."
      />
      <meta
        name="keywords"
        content="Dinacom, Dinus Application Competition, kompetisi teknologi informasi, lomba IT, universitas dian nuswantoro, dcc udinus"
      />
      <meta name="author" content="Dian Nuswantoro Computer Club (DNCC)" />
      <div className="flex bg-[#F5F5F5] min-h-screen">
        <Sidebar />
        <div className="flex-1 mt-8 md:mt-0 md:ml-[250px] overflow-y-auto min-h-screen w-full bg-gray-100">
            <Outlet />
          </div>
      </div>
    </>
  );
};

const AppLayoutUser: React.FC = () => {
  return (
    <GlobalDataUserProvider>
      <DashboardLayout />
    </GlobalDataUserProvider>
  );
};

export default AppLayoutUser;
