import { Link, useNavigate } from "react-router-dom";
import { SquarePen } from "lucide-react";
import { toast } from "react-toastify";
import { generateFileLink } from "../../libs/generate-file-link";
import { useDataUser } from "../../context/GlobalDataUser";

export default function Profile() {
  const navigate = useNavigate();

  const { user } = useDataUser();

  const handleEdit = () => {
    navigate("/dashboard/profile/edit");
  };

  if (user.loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loader">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600">Loading...</p>
    </div>
  )

  if (user.error) {
    navigate("/login");
    toast.error("Please log in to access your profile.", {
      position: "top-right",
    });
    return null;
  }

  return (
    <div className="flex justify-center items-center  py-14 px-11">
      <div className="bg-white shadow-md rounded-2xl w-[800px] p-10">
        <h1 className="text-2xl font-semibold mb-8 text-center text-gray-800">
          Profile
        </h1>

        {/* TAMPILAN DATA (READ-ONLY) */}
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">Name</label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              {user.data?.name}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Email
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              {user.data?.email}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone Number
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              {user.data?.phone}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Education Level
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              {user.data?.education_level}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 mb-1 font-medium">
              Education Institution
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              {user.data?.institution}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Twibbon
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              <Link to={user.data?.url_twibbon ?? ""} target="_blank" className="text-blue-600 underline text-sm">
                Twibbon
              </Link>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">KTM</label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              <Link to={generateFileLink(user.data?.url_ktm ?? "")} target="_blank" className="text-blue-600 underline text-sm">
                KTM
              </Link>
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Proof of Following Instagram DNCC
            </label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              <Link to={generateFileLink(user.data?.url_proof_follow_instagram_dncc ?? "")} target="_blank" className="text-blue-600 underline text-sm">
                Proof of Following Instagram DNCC
              </Link>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">KTM</label>
            <div className="w-full border border-gray-200 rounded-lg p-3 bg-white text-gray-600 opacity-75">
              <Link to={generateFileLink(user.data?.url_proof_follow_instagram_dinacom ?? "")} target="_blank" className="text-blue-600 underline text-sm">
                Proof of Following Instagram Dinacom
              </Link>
            </div>
          </div>
        </div>

        {/* Tombol Edit */}
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#E85002] hover:bg-[#e13d00] text-white font-medium transition"
          >
            <SquarePen size={18} />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
