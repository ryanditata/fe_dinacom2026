import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../hooks/useUserProfile";
import { toast } from "react-toastify";
import ConfirmationDialog from "./ConfirmationModal";
import { useAuthActions } from "../hooks/useAuthActions";
import { Phone } from 'lucide-react';

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const { logout, loading: logoutLoading } = useAuthActions();

  const isCompetitionActive = location.pathname.startsWith(
    "/dashboard/competition"
  );

  const { data, error, loading } = useUserProfile();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/",
      active: location.pathname === "/",
    },
    {
      label: "My Competition",
      path: "/dashboard/competition",
      active: isCompetitionActive,
    },
    {
      label: "Final Submissions",
      path: "/dashboard/submissions",
      active: location.pathname.includes("/submissions"),
    },
    {
      label: "Profile",
      path: "/dashboard/profile",
      active: location.pathname.includes("/profile"),
    },
  ];

  if (loading || logoutLoading)
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="loader">
          <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-6 text-gray-600">Loading...</p>
      </div>
    </div>;

  if (!data || error) {
    navigate("/login");
    toast.error("Please login to complete your profile.", {
      position: "top-right",
    });
    return null;
  }

  return (
    <>
      <div className="sm:hidden fixed top-0 left-0 right-0 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-50 shadow-sm">
        <div className="flex w-28">
          <img src="/dinacom-logo.svg" alt="Dinacom Logo" />
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 sm:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        ></div>
      )}

      <div
        className={`fixed sm:fixed top-0 left-0 z-50 bg-white flex flex-col justify-between 
          w-fit h-screen text-base font-medium border-r border-gray-200 overflow-y-auto 
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}
      >

        <div className="flex flex-col text-[#637381]">
          <div className="logo px-[35px] pb-[35px] pt-10">
            <img src="/dinacom-logo.svg" alt="dinacom-logo" />
          </div>

          <div className="flex flex-col">
            {menuItems.map((item, index) => {
              if (item.label === "Submissions" && data.is_leader === false) {
                return null;
              }
              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`
                  pl-[35px] py-2.5 flex w-full cursor-pointer hover:bg-[#FFEFE8] hover:border-r-4 hover:border-[#FF4800]
                  ${item.active
                      ? "bg-[#FFEFE8] border-r-4 border-[#FF4800] text-[#FF4800]"
                      : "text-[#637381]"
                    }
                  ${index === menuItems.length - 1 ? "mb-10" : ""}
                `}
                  onClick={() => setOpen(false)}
                  aria-current={item.active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              )
            })}

            <button
                className="px-[35px] pb-6 inline-flex cursor-pointer hover:bg-[#FFEFE8] hover:border-r-4 hover:border-[#FF4800] text-left"
                onClick={() => setIsOpen(true)}
              >
                <p className="w-full text-left border-t border-[#DFE4EA] pt-6">
                  Log out
                </p>
              </button>
          </div>
        </div>

        <div className="flex flex-col gap-10 items-center">
          <div className="flex w-full px-8">
            <div className="flex flex-col w-fit bg-[#FFF4F0] mb-8 border border-[#FFDDCD] rounded-md border-b-4 border-b-[#FF4800]">
              <Link to="https://wa.me/+6289666900321" target="_blank" className="flex flex-row gap-8 items-center justify-center cursor-pointer p-4">
                <Phone className="text-[#FF4800]" />
                <div className="flex flex-col">
                  <h1 className="text-black font-bold text-left">Zendry</h1>
                  <p className="text-[#637681] text-sm">089666900321</p>
                </div>
              </Link>
              <div className="border-t border-[#FFDDCD]"></div>
              <Link to="https://wa.me/+6281392130582" target="_blank" className="flex flex-row gap-8 items-center justify-center cursor-pointer p-4">
                <Phone className="text-[#FF4800]" />
                <div className="flex flex-col">
                  <h1 className="text-black font-bold text-left">Aldi</h1>
                  <p className="text-[#637681] text-sm">081392130582</p>
                </div>
              </Link>
            </div>
          </div>
          {/* <div className="flex flex-row px-[35px] pb-10 gap-[15px] cursor-pointer">
            <div className="flex justify-center items-center w-[50px] h-[50px] rounded-full bg-[#DFE4EA] overflow-hidden">
              <img className="w-8 h-8" src="/user-profile.png" alt="profile" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-medium">{data.name ?? "Guest"}</h3>
              <p className="text-[#637381] text-sm">{data.email ?? ""}</p>
            </div>
          </div> */}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={() => {
          logout();
        }}
        title={"Confirm Logout"}
        message={"Are you sure you want to logout?"}
        type="warning"
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
};

export default Sidebar;
