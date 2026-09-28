// pages/EditProfile.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import * as Yup from "yup";
import { useUserActions } from "../../hooks/useUserActions";
import { toast } from "react-toastify";
import LoadingModal from "../../components/LoadingModal";
import { generateFileLink } from "../../libs/generate-file-link";
import { useDataUser } from "../../context/GlobalDataUser";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    educationLevel: "Mahasiswa",
    institution: "",
    twibbon: "",
    ktm: null as File | null,
    proof_follow_instagram_dncc: null as File | null,
    proof_follow_instagram_dinacom: null as File | null,
  });

  const { user } = useDataUser();
  const { saveProfile, loading: saving, error: saveError, success, reset } = useUserActions();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const SUPPORTED_FORMATS = ["image/png", "image/jpeg", "image/jpg"];

  const profileSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string().required("Phone number is required"),
    educationLevel: Yup.string().required("Education level is required"),
    institution: Yup.string().required("Institution is required"),
    twibbon: Yup.string().url("Invalid URL").required("Twibbon URL is required"),
    ktm: Yup.mixed()
      .nullable()
      .test("fileSize", "KTM file size must be less than 2MB", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),

    proof_follow_instagram_dncc: Yup.mixed()
      .nullable()
      .test("fileSize", "File size must be less than 2MB", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),

    proof_follow_instagram_dinacom: Yup.mixed()
      .nullable()
      .test("fileSize", "File size must be less than 2MB", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
        if (!value) return true;
        const file = value as File;
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "ktm" | "proof_follow_instagram_dncc" | "proof_follow_instagram_dinacom") => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, [field]: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {

    setErrors({});

    e.preventDefault();
    profileSchema.validate(form, { abortEarly: false })
      .then(async () => {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("education_level", form.educationLevel);
        formData.append("institution", form.institution);
        formData.append("url_twibbon", form.twibbon);
        if (form.ktm) {
          formData.append("ktm", form.ktm);
        }
        if (form.proof_follow_instagram_dncc) {
          formData.append("proof_follow_instagram_dncc", form.proof_follow_instagram_dncc);
        }
        if (form.proof_follow_instagram_dinacom) {
          formData.append("proof_follow_instagram_dinacom", form.proof_follow_instagram_dinacom);
        }
        formData.append("_method", "PUT");
        try {
          saveProfile(formData);
        } catch (err: any) {
          toast.error(err.message || "Failed to complete profile.", {
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

  useEffect(() => {
    if (user) {
      setForm({
        email: user.data?.email || "",
        name: user.data?.name || "",
        phone: user.data?.phone || "",
        educationLevel: user.data?.education_level || "",
        institution: user.data?.institution || "",
        twibbon: user.data?.url_twibbon || "",
        ktm: null,
        proof_follow_instagram_dncc: null,
        proof_follow_instagram_dinacom: null
      });
    }
  }, [user]);

  if (user.loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loader">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600">Loading...</p>
    </div>
  )

  if (!user || user.error) {
    navigate("/login");
    toast.error("Please login to complete your profile.", {
      position: "top-right",
    });
    return null;
  }

  const handleCancel = () => {
    navigate("/dashboard/profile");
  };

  return (
    <div className="max-w-4xl mx-auto py-14 px-11">
      {/* Form Edit */}
      <div className="bg-white shadow-md rounded-2xl p-6">
        {/* Header di dalam kotak - posisi atas tengah */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Edit Profile</h1>
        </div>

        <form className="grid grid-cols-2 gap-6">
          {/* Name */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Eka Winando"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent placeholder-gray-400"
            />
          </div>

          {/* Email dan Phone Number bersampingan */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="winandoeka@gmail.com"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="085799999999"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent placeholder-gray-400"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Education Level dengan Dropdown */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Education Level
            </label>
            <select
              name="educationLevel"
              value={form.educationLevel}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent text-gray-900"
            >
              <option value="SMA">High School</option>
              <option value="Mahasiswa">College</option>
            </select>
            {errors.educationLevel && (
              <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>
            )}
          </div>

          {/* Education Institution */}
          <div className="col-span-2">
            <label className="block text-gray-700 mb-2 font-medium">
              Education Institution
            </label>
            <input
              name="institution"
              value={form.institution}
              onChange={handleChange}
              placeholder="Type here"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent placeholder-gray-400"
            />
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
            )}
          </div>

          {/* Twibbon dan KTM bersampingan */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Twibbon
              {user.data?.url_twibbon && (
                <Link to={user.data?.url_twibbon ?? ""} target="_blank" className="text-blue-600 underline text-sm ml-2">
                  <span>(View)</span>
                </Link>
              )
              }
            </label>
            <input
              name="twibbon"
              value={form.twibbon}
              onChange={handleChange}
              placeholder="Type here"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent placeholder-gray-400"
            />
            <a href={"https://drive.google.com/drive/folders/15OlU-t-SaIcUZLFOyPt8RxwhZtt54e48?usp=sharing"} target="_blank" className="text-blue-600 underline text-sm ml-2">
              <span>(View Template Twibbon)</span>
            </a>
            {errors.twibbon && (
              <p className="text-red-500 text-sm mt-1">{errors.twibbon}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Student ID Card
              {
                user.data?.url_ktm && (
                  <Link to={generateFileLink(user.data?.url_ktm ?? "")} target="_blank" className="text-blue-600 underline text-sm ml-2">
                    <span>
                      (View)
                    </span>
                  </Link>
                )
              }
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {form.ktm ? form.ktm.name : "No file chosen"}
                </span>
                <label htmlFor="ktm-upload" className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "ktm")}
                    className="hidden"
                    id="ktm-upload"
                    accept="image/*"
                  />
                  <Upload
                    className="text-gray-400 hover:text-gray-600"
                    size={20}
                  />
                </label>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              (File format: JPG/PNG, Max size: 2MB)
            </p>
            {errors.ktm && (
              <p className="text-red-500 text-sm mt-1">{errors.ktm}</p>
            )}
          </div>

          {/* Proof of Following Instagram DNCC and DINACOM */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Proof of Following Instagram DNCC
              {
                user.data?.url_proof_follow_instagram_dncc && (
                  <Link to={generateFileLink(user.data?.url_proof_follow_instagram_dncc ?? "")} target="_blank" className="text-blue-600 underline text-sm ml-2">
                    <span>
                      (View)
                    </span>
                  </Link>
                )
              }
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {form.proof_follow_instagram_dncc ? form.proof_follow_instagram_dncc.name : "File"}
                </span>
                <label htmlFor="proof-follow-instagram-dncc-upload" className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "proof_follow_instagram_dncc")}
                    className="hidden"
                    id="proof-follow-instagram-dncc-upload"
                    accept="image/*"
                  />
                  <Upload
                    className="text-gray-400 hover:text-gray-600"
                    size={20}
                  />
                </label>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              (File format: JPG/PNG, Max size: 2MB)
            </p>
            {errors.proof_follow_instagram_dncc && (
              <p className="text-red-500 text-sm mt-1">{errors.proof_follow_instagram_dncc}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Proof of Following Instagram Dinacom
              {
                user.data?.url_proof_follow_instagram_dinacom && (
                  <Link to={generateFileLink(user.data?.url_proof_follow_instagram_dinacom ?? "")} target="_blank" className="text-blue-600 underline text-sm ml-2">
                    <span>
                      (View)
                    </span>
                  </Link>
                )
              }
            </label>
            <div className="border border-gray-300 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {form.proof_follow_instagram_dinacom ? form.proof_follow_instagram_dinacom.name : "File"}
                </span>
                <label htmlFor="proof-follow-instagram-dinacom-upload" className="cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "proof_follow_instagram_dinacom")}
                    className="hidden"
                    id="proof-follow-instagram-dinacom-upload"
                    accept="image/*"
                  />
                  <Upload
                    className="text-gray-400 hover:text-gray-600"
                    size={20}
                  />
                </label>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              (File format: JPG/PNG, Max size: 2MB)
            </p>
            {errors.proof_follow_instagram_dinacom && (
              <p className="text-red-500 text-sm mt-1">{errors.proof_follow_instagram_dinacom}</p>
            )}
          </div>
        </form>

        {/* Tombol Save dan Cancel dengan ukuran sama */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={handleCancel}
            className="px-8 py-3 rounded-lg text-white font-medium bg-[#525252] hover:bg-[#404040] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-8 py-3 rounded-lg bg-[#E85002] hover:bg-[#e13d00] text-white font-medium transition"
          >
            Save
          </button>
        </div>
      </div>
      <LoadingModal
        isOpen={saving || success || !!saveError}
        status={saving ? "loading" : success ? "success" : "error"}
        loadingText="Saving your profile..."
        successText="Profile saved successfully!"
        errorText={saveError || "Failed to save profile. Please try again."}
        onClose={() => {
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </div>
  );
}
