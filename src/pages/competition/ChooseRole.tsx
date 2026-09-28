import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaderIcon from "../../assets/leader.svg";
import MemberIcon from "../../assets/member.svg";
import CardBG from "../../assets/card.svg";

type UserRole = "leader" | "member";

export default function ChooseRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    localStorage.setItem("userRole", role);

    if (role === "leader") {
      navigate("/dashboard/competition/form-leader");
    } else {
      navigate("/dashboard/competition/join");
    }
  };

  const baseClass =
    "relative cursor-pointer w-[260px] h-[340px] flex flex-col items-center justify-center transition-all duration-300";

  return (
    <div className="w-full h flex flex-col items-center py-14 px-11">
      <h1 className="text-3xl font-bold mb-2">Choose Your Role</h1>
      <p className="text-gray-500 mb-10 text-center">
        Lorem ipsum dolor sit amet ansir wlao euqip
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Leader Card */}
        <div
          onClick={() => handleSelect("leader")}
          className={`
            ${baseClass}
            ${
              selectedRole === "leader"
                ? "scale-105 drop-shadow-xl"
                : "hover:scale-105"
            }
          `}
        >
          {/* Card Always Visible */}
          <img
            src={CardBG}
            alt="Card Background"
            className="absolute inset-0 w-full h-full z-0"
          />

          {/* Icon */}
          <img src={LeaderIcon} alt="Leader" className="w-40 mb-4 z-10" />

          <p className="text-center text-orange-500 font-bold text-xl z-10">
            LEADER
          </p>
        </div>

        {/* Member Card */}
        <div
          onClick={() => handleSelect("member")}
          className={`
            ${baseClass}
            ${
              selectedRole === "member"
                ? "scale-105 drop-shadow-xl"
                : "hover:scale-105"
            }
          `}
        >
          {/* Card Always Visible */}
          <img
            src={CardBG}
            alt="Card Background"
            className="absolute inset-0 w-full h-full z-0"
          />

          <img src={MemberIcon} alt="Member" className="w-40 mb-4 z-10" />

          <p className="text-center text-orange-500 font-bold text-xl z-10">
            MEMBER
          </p>
        </div>
      </div>
    </div>
  );
}
