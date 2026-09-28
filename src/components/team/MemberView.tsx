// MemberDetail.tsx
import React, { useState } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import type { TeamData } from "../../types/team";

type TimeLeft = { days: number; hours: number; mins: number; secs: number };

type Props = {
  team: TeamData;
  timeLeft: TimeLeft;
};

const MemberView: React.FC<Props> = ({ team, timeLeft }) => {
  const [copied, setCopied] = useState(false);

  const status = team?.status || "-";
  const guidebook = team?.competition?.url_guidebook || "#";
  const community = team?.competition?.url_community || "#";

  // sort & split leader / other members (taruh sebelum return)
  const members = team?.members ?? [];
  const sorted = [...members].sort((a, b) => {
    if (a.role_in_team?.toLowerCase() === "leader") return -1;
    if (b.role_in_team?.toLowerCase() === "leader") return 1;
    return 0;
  });
  const leader = sorted.find((m) => m.role_in_team?.toLowerCase() === "leader") ?? null;
  const otherMembers = sorted.filter((m) => m.role_in_team?.toLowerCase() !== "leader");

  const handleCopy = async () => {
    const code = team?.team_code || "";
    if (!code) {
      toast.error("Team code tidak tersedia.");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Team code disalin ke clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Gagal menyalin ke clipboard");
    }
  };

  return (
    <>
      <title>Dinacom</title>
      <meta name="description" content="Dinus Application Competition (DINACOM) - Member Detail" />
      <div className="">
        <div className="py-14 px-6 md:px-11">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-9">
            <div className="flex flex-col gap-5 bg-white rounded-2xl p-8">
              <div className="flex flex-col">
                <h2 className="text-xl font-bold text-black mb-4">Team Profile</h2>
                <h3 className="text-2xl mb-3 font-medium text-[#FF4800]">{team?.team_name || "-"}</h3>

                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-xl font-medium font-mono">
                    {team?.team_code || "-"}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copy code"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && <span className="text-xs text-green-600">Copied!</span>}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-bold">Leader</h4>
                {leader?.user ? (
                  <div>
                    <p className="text-xl font-medium">{leader.user.name}</p>
                    <p className="text-lg text-[#637381]">{leader.user.phone || "-"}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Data leader tidak tersedia</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <h4 className="text-xl font-bold">Members</h4>
                {otherMembers.length === 0 && <p className="text-sm text-gray-600">Belum ada anggota.</p>}
                <div className="flex flex-col gap-4">
                  {otherMembers.map((m) => (
                    <div key={m.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-[#282626] text-xl">{m.user?.name || m.id_user}</p>
                        <p className="text-lg text-[#637381]">{m.user?.phone || "-"}</p>
                      </div>
                      {/* Pada MemberDetail kita tidak tampilkan tombol hapus (hanya leader yang punya aksi) */}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-10">
                <h2 className="text-xl font-bold text-black mb-5 text-center md:text-left">Countdown</h2>

                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">{String(timeLeft.days).padStart(2, "0")}</div>
                    <div className="text-sm text-gray-600 mt-2">Days</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">{String(timeLeft.hours).padStart(2, "0")}</div>
                    <div className="text-sm text-gray-600 mt-2">Hours</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">{String(timeLeft.mins).padStart(2, "0")}</div>
                    <div className="text-sm text-gray-600 mt-2">Mins</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">{String(timeLeft.secs).padStart(2, "0")}</div>
                    <div className="text-sm text-gray-600 mt-2">Secs</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={community}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[15px] bg-[#FF4800] hover:bg-orange-600 text-white font-bold px-8 py-5 md:py-9 rounded-xl text-center"
                >
                  Community
                </a>
                <a
                  href={guidebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[15px] border-2 bg-white border-[#FF4800] text-black hover:bg-orange-50 font-bold px-8 py-5 md:py-9 rounded-xl text-center"
                >
                  Guidebook
                </a>
              </div>

              <div className="bg-white rounded-2xl p-10">
                <h2 className="text-xl font-semibold text-black mb-4">Announcement</h2>
                <div className="text-center p-10">
                  <p className="text-4xl font-bold text-[#FF4800]">
                    {status?.toUpperCase() === "QUALIFIED" ? "QUALIFIED" : status?.toUpperCase() || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </>
  );
};

export default MemberView;
