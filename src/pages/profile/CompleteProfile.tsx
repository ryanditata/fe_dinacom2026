// pages/CompleteProfile.tsx
import { useEffect, useState } from "react";
import { data, useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import * as Yup from "yup";
import { useUserProfile } from "../../hooks/useUserProfile";
import { toast } from "react-toastify";
import { useUserActions } from "../../hooks/useUserActions";
import LoadingModal from "../../components/LoadingModal";



export default function CompleteProfile() {
  const navigate = useNavigate();

  const { data: userProfile, loading, error } = useUserProfile();
  const { saveProfile, loading: saving, error: saveError, success, reset } = useUserActions();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
      .required("KTM file is required")
      .test("fileSize", "KTM file size must be less than 2MB", (value) => {
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
        const file = value as File;
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),

    proof_follow_instagram_dncc: Yup.mixed()
      .required("Proof of following Instagram DNCC is required")
      .test("fileSize", "File size must be less than 2MB", (value) => {
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
        const file = value as File;
        return file && SUPPORTED_FORMATS.includes(file.type);
      }),

    proof_follow_instagram_dinacom: Yup.mixed()
      .required("Proof of following Instagram Dinacom is required")
      .test("fileSize", "File size must be less than 2MB", (value) => {
        const file = value as File;
        return file && file.size <= FILE_SIZE;
      })
      .test("fileFormat", "Only PNG, JPG, JPEG are allowed", (value) => {
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

    if (!userProfile) return;



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
          await saveProfile(formData);
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
    if (userProfile) {
      setForm({
        email: userProfile.email || "",
        name: userProfile.name || "",
        phone: userProfile.phone || "",
        educationLevel: userProfile.education_level || "",
        institution: userProfile.institution || "",
        twibbon: userProfile.url_twibbon || "",
        ktm: null,
        proof_follow_instagram_dncc: null,
        proof_follow_instagram_dinacom: null,
      });
    }
  }, [userProfile]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="loader">
        <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-gray-600">Loading...</p>
    </div>
  )

  if (!data || error) {
    navigate("/login");
    toast.error("Please login to complete your profile.", {
      position: "top-right",
    });
    return null;
  }

  if (userProfile?.name && userProfile.education_level && userProfile.institution) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header di dalam kotak */}
          <div className="text-center mb-8">
            {/* Logo DINACOM SVG */}
            <div className="flex justify-center mb-4">
              <svg width="200" height="32" viewBox="0 0 250 40" fill="none">
                <path
                  d="M0 31.7062L4.81332 20.87H1.36668V8.29305H10.2875C17.4676 8.29305 22.6824 13.1912 22.6824 19.9373V19.9996C22.6824 26.7832 17.4676 31.7062 10.2875 31.7062H0ZM10.2875 26.7034C14.3901 26.7034 17.1484 24.0348 17.1484 20.062V19.9996C17.1484 15.9894 14.3901 13.2959 10.2875 13.2959H6.7137V19.3737H10.9659L7.71128 26.7034H10.2875Z"
                  fill="#282626"
                />
                <path
                  d="M10.2872 9.04126H2.11452V20.1219H5.96517V12.5477H10.2872C14.8885 12.5477 17.8962 15.7101 17.8962 19.9997V20.062C17.8962 24.3516 14.8885 27.4516 10.2872 27.4516H6.54626L9.81582 20.1219H5.96517L1.15186 30.9581H10.2872C17.1755 30.9581 21.9339 26.1672 21.9339 19.9997V19.9373C21.9339 13.7673 17.1755 9.04126 10.2872 9.04126Z"
                  fill="#282626"
                />
                <path
                  d="M31.4188 8.29305H26.0693V31.7062H31.4188V8.29305Z"
                  fill="#282626"
                />
                <path
                  d="M30.6705 9.04126H26.8174V30.9581H30.6705V9.04126Z"
                  fill="#282626"
                />
                <path
                  d="M52.0315 31.7062L41.0581 17.5531V31.7062H35.7734V8.29305H40.4621L51.0888 22.0073V8.29305H56.3734V31.7062H52.0315Z"
                  fill="#282626"
                />
                <path
                  d="M51.8368 24.1945L40.0953 9.04126H36.5239V30.9581H40.3122V15.3659L52.4004 30.9581H55.6251V9.04126H51.8368V24.1945Z"
                  fill="#282626"
                />
                <path
                  d="M77.6692 31.7062L75.447 26.4141H66.0748L63.8303 31.7062H58.2363L68.5338 8.13594H73.6439L71.8408 12.7373H75.0829L83.3703 31.7062H77.6692ZM73.397 21.506L70.7485 15.3784L68.1148 21.506H73.397Z"
                  fill="#282626"
                />
                <path
                  d="M70.7458 13.4855L74.5366 22.2542H66.9899L70.7458 13.4855L72.5489 8.88415H69.0249L59.3809 30.9581H63.3263L65.5808 25.6659H75.9456L78.1678 30.9581H82.2379L74.6039 13.4855H70.7458Z"
                  fill="#282626"
                />
                <path
                  d="M94.7998 32.0828C93.2206 32.1007 91.6539 31.8008 90.1929 31.201C88.7319 30.6012 87.4065 29.7137 86.2954 28.5913C84.0842 26.3064 82.8636 23.2414 82.8987 20.062V19.9996C82.8987 13.1113 88.0661 7.91646 94.9195 7.91646C99.6206 7.91646 102.169 9.74452 104.045 11.5352L104.561 12.034L101.114 15.9968L100.548 15.4806C98.633 13.7348 96.9396 12.9867 94.8871 12.9867C91.206 12.9867 88.4328 15.9794 88.4328 19.9423V20.0046C88.4328 23.9949 91.221 27.0201 94.917 27.0201C97.3985 27.0201 98.9697 26.0225 100.698 24.4039L101.229 23.9051L104.721 27.4391L104.237 27.9628C101.606 30.8109 98.6928 32.0828 94.7998 32.0828Z"
                  fill="#282626"
                />
                <path
                  d="M94.9196 27.7633C90.7223 27.7633 87.6872 24.2892 87.6872 19.9996V19.9373C87.6872 15.6477 90.7572 12.2335 94.8897 12.2335C97.426 12.2335 99.274 13.2984 101.057 14.927L103.529 12.0764C101.431 10.0737 98.9897 8.66466 94.9196 8.66466C88.3131 8.66466 83.647 13.7673 83.647 19.9996V20.062C83.647 26.3542 88.4054 31.3346 94.7924 31.3346C98.865 31.3346 101.464 29.8632 103.686 27.4516L101.212 24.9576C99.3339 26.7009 97.5807 27.7633 94.9196 27.7633Z"
                  fill="#282626"
                />
                <path
                  d="M117.587 32.0828C110.646 32.0828 105.412 26.9153 105.412 20.062V19.9996C105.412 13.2236 110.786 7.91646 117.649 7.91646C124.593 7.91646 129.827 13.0839 129.827 19.9373V19.9996C129.827 26.7757 124.45 32.0828 117.587 32.0828ZM117.587 12.9817C113.801 12.9817 110.946 15.9744 110.946 19.9373V19.9996C110.946 23.9899 113.826 27.0151 117.649 27.0151C121.473 27.0151 124.291 24.0224 124.291 20.062V19.9996C124.291 15.9993 121.408 12.9817 117.587 12.9817Z"
                  fill="#282626"
                />
                <path
                  d="M117.649 8.66466C110.916 8.66466 106.16 13.862 106.16 19.9996V20.062C106.16 26.2295 110.856 31.3346 117.587 31.3346C124.318 31.3346 129.079 26.1372 129.079 19.9996V19.9373C129.079 13.7673 124.383 8.66466 117.649 8.66466ZM125.039 20.062C125.039 24.3192 122.004 27.7633 117.649 27.7633C113.295 27.7633 110.197 24.2568 110.197 19.9996V19.9373C110.197 15.6776 113.235 12.2335 117.587 12.2335C121.939 12.2335 125.039 15.74 125.039 19.9996V20.062Z"
                  fill="#282626"
                />
                <path
                  d="M132.995 31.7062V8.29305H138.254L145.873 20.1343H139.855L138.279 17.7725V31.7062H132.995Z"
                  fill="#282626"
                />
                <path
                  d="M137.845 9.04126L144.502 19.3861H140.257L137.531 15.3036V30.9581H133.743V9.04126H137.845Z"
                  fill="#282626"
                />
                <path
                  d="M150.687 31.7062V17.7127L146.898 23.4064H140.993L150.776 8.29305H156.034V31.7062H150.687Z"
                  fill="#282626"
                />
                <path
                  d="M155.285 9.04126V30.9581H151.435V15.2387L146.497 22.6582H142.367L151.183 9.04126H155.285Z"
                  fill="#282626"
                />
                <path
                  d="M170.474 33V29.1992L176.808 22.6746C178.054 21.3865 178.994 20.373 179.627 19.6339C180.282 18.8738 180.725 18.2403 180.958 17.7336C181.211 17.2268 181.338 16.7306 181.338 16.2449C181.338 15.3792 181.053 14.7035 180.483 14.2178C179.934 13.7111 179.237 13.4577 178.392 13.4577C177.526 13.4577 176.756 13.7111 176.08 14.2178C175.404 14.7035 174.908 15.4531 174.591 16.4666L170.315 15.073C170.569 13.8483 171.097 12.782 171.899 11.874C172.702 10.9661 173.673 10.2693 174.813 9.78361C175.953 9.27684 177.146 9.02345 178.392 9.02345C179.955 9.02345 181.327 9.29795 182.51 9.84696C183.692 10.396 184.611 11.1667 185.265 12.1591C185.92 13.1515 186.247 14.3129 186.247 15.6431C186.247 16.4878 186.099 17.3218 185.804 18.1453C185.508 18.9477 185.054 19.7712 184.442 20.6158C183.85 21.4393 183.08 22.3367 182.13 23.308L176.713 28.8825H186.469V33H170.474ZM199.097 33.3801C197.218 33.3801 195.56 32.8733 194.124 31.8598C192.71 30.8462 191.601 29.4209 190.799 27.5839C189.996 25.7469 189.595 23.6142 189.595 21.1859C189.595 18.7365 189.986 16.6039 190.767 14.788C191.569 12.972 192.678 11.5573 194.093 10.5438C195.528 9.53022 197.186 9.02345 199.065 9.02345C200.987 9.02345 202.655 9.53022 204.07 10.5438C205.505 11.5573 206.614 12.9826 207.395 14.8196C208.198 16.6356 208.599 18.7577 208.599 21.1859C208.599 23.6142 208.198 25.7469 207.395 27.5839C206.614 29.3998 205.505 30.8251 204.07 31.8598C202.655 32.8733 200.997 33.3801 199.097 33.3801ZM199.129 28.9458C200.1 28.9458 200.923 28.6397 201.599 28.0273C202.275 27.415 202.792 26.5281 203.151 25.3668C203.51 24.2054 203.69 22.8118 203.69 21.1859C203.69 19.56 203.51 18.177 203.151 17.0368C202.792 15.8754 202.264 14.9886 201.567 14.3762C200.892 13.7639 200.058 13.4577 199.065 13.4577C198.094 13.4577 197.27 13.7639 196.595 14.3762C195.919 14.9886 195.402 15.8754 195.043 17.0368C194.684 18.177 194.504 19.56 194.504 21.1859C194.504 22.7907 194.684 24.1738 195.043 25.3351C195.402 26.4965 195.919 27.3939 196.595 28.0273C197.292 28.6397 198.136 28.9458 199.129 28.9458ZM211.519 33V29.1992L217.854 22.6746C219.099 21.3865 220.039 20.373 220.672 19.6339C221.327 18.8738 221.77 18.2403 222.003 17.7336C222.256 17.2268 222.383 16.7306 222.383 16.2449C222.383 15.3792 222.098 14.7035 221.528 14.2178C220.979 13.7111 220.282 13.4577 219.437 13.4577C218.572 13.4577 217.801 13.7111 217.125 14.2178C216.449 14.7035 215.953 15.4531 215.636 16.4666L211.361 15.073C211.614 13.8483 212.142 12.782 212.944 11.874C213.747 10.9661 214.718 10.2693 215.858 9.78361C216.998 9.27684 218.191 9.02345 219.437 9.02345C221 9.02345 222.372 9.29795 223.555 9.84696C224.737 10.396 225.656 11.1667 226.31 12.1591C226.965 13.1515 227.292 14.3129 227.292 15.6431C227.292 16.4878 227.144 17.3218 226.849 18.1453C226.553 18.9477 226.099 19.7712 225.487 20.6158C224.896 21.4393 224.125 22.3367 223.175 23.308L217.759 28.8825H227.514V33H211.519ZM238.622 33.3801C236.996 33.3801 235.549 33.0422 234.283 32.3665C233.016 31.6697 232.023 30.7301 231.305 29.5476C230.587 28.3652 230.228 27.0349 230.228 25.5568C230.228 24.8178 230.302 24.0787 230.45 23.3397C230.598 22.6007 230.894 21.7877 231.337 20.9009C231.78 20.014 232.445 19.0005 233.332 17.8603L239.889 9.40353H245.748L237.798 19.5706L237.006 18.462C237.302 18.3142 237.587 18.1981 237.862 18.1136C238.136 18.0292 238.4 17.9658 238.653 17.9236C238.928 17.8814 239.213 17.8603 239.509 17.8603C240.966 17.8603 242.254 18.1875 243.373 18.8421C244.513 19.4967 245.4 20.3941 246.033 21.5343C246.688 22.6534 247.015 23.9204 247.015 25.3351C247.015 26.8765 246.656 28.2596 245.938 29.4843C245.22 30.6879 244.228 31.6381 242.961 32.3349C241.715 33.0317 240.269 33.3801 238.622 33.3801ZM238.622 28.9458C239.276 28.9458 239.857 28.798 240.364 28.5024C240.892 28.2068 241.314 27.7951 241.631 27.2672C241.947 26.7182 242.106 26.0953 242.106 25.3985C242.106 24.6805 241.947 24.0682 241.631 23.5614C241.314 23.0335 240.892 22.6218 240.364 22.3262C239.857 22.0305 239.276 21.8827 238.622 21.8827C237.988 21.8827 237.408 22.0305 236.88 22.3262C236.352 22.6218 235.93 23.0335 235.613 23.5614C235.296 24.0682 235.138 24.6805 235.138 25.3985C235.138 26.0953 235.296 26.7182 235.613 27.2672C235.93 27.7951 236.352 28.2068 236.88 28.5024C237.408 28.798 237.988 28.9458 238.622 28.9458Z"
                  fill="#FF4800"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Complete Profile
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Eka Winando"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Email
                </label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="winandoeka@gmail.com"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
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
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Education Level
              </label>
              <select
                name="educationLevel"
                value={form.educationLevel}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent text-gray-900"
              >
                <option>Select Education Level</option>
                <option value="Mahasiswa">College</option>
                <option value="SMA">High School</option>
              </select>
              {errors.educationLevel && (
                <p className="text-red-500 text-sm mt-1">{errors.educationLevel}</p>
              )}
            </div>

            {/* Education Institution */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Education Institution
              </label>
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                placeholder="Type here"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
              />
              {errors.institution && (
                <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
              )}
            </div>

            {/* Twibbon dan KTM bersampingan */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Twibbon
                </label>
                <input
                  name="twibbon"
                  value={form.twibbon}
                  onChange={handleChange}
                  placeholder="Type here"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#E85002] focus:border-transparent placeholder-gray-400"
                />
                <a href={"https://drive.google.com/drive/folders/15OlU-t-SaIcUZLFOyPt8RxwhZtt54e48?usp=sharing"} target="_blank" className="text-blue-600 underline text-xs">
                  <span>(View Template Twibbon)</span>
                </a>
                {errors.twibbon && (
                  <p className="text-red-500 text-sm mt-1">{errors.twibbon}</p>
                )}
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Student ID Card
                </label>
                <div className="border border-gray-300 rounded-lg p-3 py-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">
                      {form.ktm ? form.ktm.name : "File"}
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
            </div>

            {/* Proof of Following Instagram DNCC and DINACOM */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Proof of Following Instagram DNCC
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
                  (File format: JPG/PNG/JPEG, Max size: 2MB)
                </p>
                {errors.proof_follow_instagram_dinacom && (
                  <p className="text-red-500 text-sm mt-1">{errors.proof_follow_instagram_dinacom}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#E85002] hover:bg-[#d14802] text-white font-semibold py-4 px-6 rounded-lg transition-colors mt-8"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
      <LoadingModal
        isOpen={saving || success || !!saveError}
        status={saving ? "loading" : success ? "success" : "error"}
        loadingText="Saving your profile..."
        successText="Profile saved successfully!"
        errorText={saveError || "Failed to save profile. Please try again."}
        onClose={() => {
          if (success) {
            navigate("/dashboard");
          }
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </div>
  );
}
