import React, { useState } from "react";
import * as Yup from "yup";
import { useTeamActions } from "../../hooks/useTeamActions";
import LoadingModal from "../../components/LoadingModal";
import { toast } from "react-toastify";
import { useDataUser } from "../../context/GlobalDataUser";

const MemberForm: React.FC = () => {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  const { createTeam, loading, error, success, reset } = useTeamActions()
  const { user } = useDataUser();

  const [form, setForm] = useState({
    team_name: "",
    institution: user.data?.education_level || "",
    name_advisor: ""
  });

  const createTeamSchema = Yup.object().shape({
    team_name: Yup.string().required("Team name required").max(50, "Team name too long"),
    institution: Yup.string()
      .required("Institution required")
      .oneOf(["SMA", "Mahasiswa"], "Invalid institution"),
    name_advisor: Yup.string()
      .nullable()
      .max(100, "Advisor name too long"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({
      ...errors,
      [e.target.name]: ""
    })
  };

  const handleSubmit = (e: React.FormEvent) => {
    setForm({ ...form, institution: user.data?.education_level || "" });
    setErrors({});

    e.preventDefault();


    createTeamSchema.validate(form, { abortEarly: false })
      .then(async () => {
        const formData = new FormData();

        formData.append("team_name", form.team_name)
        formData.append("category", user.data?.education_level || form.institution || "")
        formData.append("name_advisor", form.name_advisor)


        try {
          await createTeam(formData);
        } catch (err: any) {
          toast.error(err.message || "Failed to create team. Please try again.", {
            position: "top-right",
          });
        }
      })
      .catch((validationError: Yup.ValidationError) => {
        const formErrors: { [key: string]: string } = {};
        validationError.inner.forEach((err) => {
          if (err.path) {
            formErrors[err.path] = err.message;
          }
        });
        setErrors(formErrors);
      });
  };

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
          <div className="text-lg">Error loading user data: {user.error}</div>
        </div>
      </div>
    );
  }





  return (
    <>
      <title>Dinacom</title>

      <div className="flex relative w-full min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute top-0 right-0">
          <img src="/bg-form.png" alt="" className="w-full" />
        </div>

        <div className="absolute font-jakarta bottom-8 left-8 text-9xl font-extrabold italic text-transparent [-webkit-text-stroke:1px_rgba(255,72,0,0.3)] select-none">
          Leader
        </div>

        {/* Form Container */}
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-xl shadow-xl w-[500px] flex flex-col items-center">
          <h1 className="text-2xl font-medium mb-6 text-center text-black">
            Complete the Form Below
          </h1>

          <form className="w-full space-y-4">
            <div>
              <label className="block text-base font-medium text-black mb-2">Team's Name</label>
              <input
                onChange={handleChange}
                name="team_name"
                type="text"
                className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.team_name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                  }`}
                placeholder="Team's Name"
              />
              {errors.team_name && (
                  <p className="text-red-500 text-sm mt-1">{errors.team_name}</p>
                )}
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-2">Institution</label>
              <select
                defaultValue={form.institution || (user.data?.education_level === "SMA" ? "SMA" : "Mahasiswa")}
                onChange={handleChange}
                name="institution"
                className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.institution
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                  }`}
                  disabled
              >
                {/* default value */}
                {user.data?.education_level === "SMA" ? (
                  <option value="SMA" selected>High School</option>
                ) : (
                  <option value="Mahasiswa" selected>College</option>
                )}
              </select>
              {errors.institution && (
                  <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
                )}
            </div>

            <div>
              <label className="block text-base font-medium text-black mb-2">Mentor's Name</label>
              <input
                onChange={handleChange}
                name="name_advisor"
                type="text"
                className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.name_advisor
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-300 focus:border-blue-600"
                  }`}
                placeholder="Mentor's Name"
              />
                {errors.name_advisor && (
                    <p className="text-red-500 text-sm mt-1">{errors.name_advisor}</p>
                  )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full ${loading ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-500"
                } text-white font-semibold py-2 rounded mt-4 transition-all cursor-pointer`}
            >
              {loading ? "Loading..." : "Create"}
            </button>
          </form>
        </div>
      </div>
      <LoadingModal
        isOpen={loading || success || !!error}
        status={loading ? "loading" : success ? "success" : "error"}
        loadingText="Creating your team...."  
        successText="Success create your team!"
        errorText={error || "Failed to create team. Please try again."}
        onClose={() => {
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </>
  );
};

export default MemberForm;
