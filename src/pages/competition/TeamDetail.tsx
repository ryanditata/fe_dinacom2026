// TeamDetail.tsx
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useDataUser } from "../../context/GlobalDataUser";
import LeaderView from "../../components/team/LeaderView";
import MemberView from "../../components/team/MemberView";

const parseIsoLike = (raw?: string | null) => {
  if (!raw) return null;
  const iso = raw.includes("T") ? raw : raw.replace(" ", "T");
  const d = new Date(iso);
  return isNaN(d.getTime()) ? null : d;
};

const calcTimeLeft = (deadlineStr?: string | null) => {
  if (!deadlineStr) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const d = parseIsoLike(deadlineStr);
  if (!d) return { days: 0, hours: 0, mins: 0, secs: 0 };
  const diff = Math.max(0, d.getTime() - Date.now());
  const secsTotal = Math.floor(diff / 1000);
  const days = Math.floor(secsTotal / (3600 * 24));
  const hours = Math.floor((secsTotal % (3600 * 24)) / 3600);
  const mins = Math.floor((secsTotal % 3600) / 60);
  const secs = secsTotal % 60;
  return { days, hours, mins, secs };
};


const TeamDetail: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  const { user } = useDataUser();

  const navigate = useNavigate();

  // keep countdown ticking here and pass to children
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const newLeft = calcTimeLeft(user?.data?.team?.competition?.deadline);
        // small optimization: only set when changed
        if (
          newLeft.days === prev.days &&
          newLeft.hours === prev.hours &&
          newLeft.mins === prev.mins &&
          newLeft.secs === prev.secs
        ) {
          return prev;
        }
        return newLeft;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  if (user.loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loader">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600">Loading...</p>
    </div>
    );
  }

  if (user.error) {
    return (
      <div className="">
        <div className="w-full flex items-center justify-center p-12">
          <div className="max-w-xl bg-white rounded-2xl p-8 shadow">
            <h2 className="text-xl font-semibold mb-4">Kesalahan</h2>
            <p className="text-sm text-red-600">{user.error?.message}</p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded"
              >
                Muat ulang
              </button>
              <button
                onClick={() => navigate("/login")}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
              >
                Ke Halaman Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.data?.team) {
    return (
      <div className="flex bg-[#F5F5F5] min-h-screen">
        <div className="w-full flex items-center justify-center p-12">
          <div className="text-lg">Data tim tidak tersedia.</div>
        </div>
      </div>
    );
  }

  if (user.data.is_leader) {
    return <LeaderView team={user.data.team} timeLeft={timeLeft} onRefresh={user.mutateUser} />;
  }

  return <MemberView team={user.data.team} timeLeft={timeLeft} />;
};

export default TeamDetail;
