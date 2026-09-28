import { useState } from "react";
import * as Yup from "yup";
import { useFinalSubmissionActions } from "../../../hooks/useFinalSubmissionActions";
import LoadingModal from "../../../components/LoadingModal";

interface FinalProps {
  link_youtube: string | null;
  link_pitchdeck: string | null;
  link_result_final: string | null;
  current_step?: number;
  team_id?: string;
}




export default function Final({ link_youtube, link_pitchdeck, link_result_final, current_step, team_id }: FinalProps) {
  const [forms, setForms] = useState({
    link_youtube: link_youtube || '',
    link_pitchdeck: link_pitchdeck || '',
    link_result_final: link_result_final || '',
  });

  const [errors, setErrors] = useState<{
    link_youtube?: string;
    link_pitchdeck?: string;
    link_result_final?: string;
  }>({});

  const {
    loading, error, submitFinal, success, reset
  } = useFinalSubmissionActions();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForms((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  const validationSchema = Yup.object().shape({
    link_youtube: Yup.string().url('Masukkan URL yang valid').nullable(),
    link_pitchdeck: Yup.string().url('Masukkan URL yang valid').nullable(),
    link_result_final: Yup.string().url('Masukkan URL yang valid').nullable(),
  });

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(forms, { abortEarly: false });
      await submitFinal({
        link_youtube: forms.link_youtube || null,
        link_pitchdeck: forms.link_pitchdeck || null,
        link_result_final: forms.link_result_final || null,
      }, team_id || "team-id-placeholder");
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            validationErrors[error.path] = error.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  }



  return (
    <>
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="space-y-6">
        {/* Prototipe */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Prototipe Aplikasi 
          </label>
          {
           current_step && current_step >= 4 && link_result_final ? (
              <a href={link_result_final} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
              >{link_result_final}</a>
            ) : (
              <input
                type="url"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:bg-white focus:ring-2"
                placeholder="https://drive.google.com/... atau https://your-app.vercel.app atau link download .apk"
                name="link_result_final"
                value={forms.link_result_final}
                onChange={handleChange}
              />
            )
          }
          {errors.link_result_final && (
            <p className="mt-1 text-xs text-red-500">
              {errors.link_result_final}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Prototipe harus dapat dijalankan dan sesuai dengan solusi yang
            dipresentasikan (berupa website yang telah di-deploy atau aplikasi
            berbentuk .apk)
          </p>
        </div>


        {/* File Presentasi (Pitch Deck) */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            File Presentasi (Pitch Deck)
          </label>
          {
            current_step && current_step >= 4 && link_pitchdeck ? (
              <a href={link_pitchdeck} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
              >{link_pitchdeck}</a>
            ) : (
              <input
                type="url"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:bg-white focus:ring-2"
                placeholder="https://drive.google.com/..."
                name="link_pitchdeck"
                value={forms.link_pitchdeck}
                onChange={handleChange}
              />
            )
          }
          {errors.link_pitchdeck && (
            <p className="mt-1 text-xs text-red-500">
              {errors.link_pitchdeck}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Digunakan untuk presentasi final di hadapan dewan juri (sesuai
            ketentuan format dan jumlah slide)
          </p>
        </div>

        {/* Video Demo Aplikasi */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Video Demo Aplikasi
          </label>
          {
            current_step && current_step >= 4 && link_youtube ? (
              <a href={link_youtube} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
              >{link_youtube}</a>
            ) : (
              <input
                type="url"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:bg-white focus:ring-2"
                placeholder="https://youtube.com/..."
                name="link_youtube"
                value={forms.link_youtube}
                onChange={handleChange}
              />
            )
          }
          {errors.link_youtube && (
            <p className="mt-1 text-xs text-red-500">
              {errors.link_youtube}
            </p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Video singkat yang menampilkan cara kerja dan fitur utama aplikasi
          </p>
        </div>
      </div>
      {
        current_step && current_step < 4 && (
          <div className="mt-6">
          <button 
            onClick={handleSubmit}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Submit Final
          </button>
        </div>
        )
      }
    </div>
    <LoadingModal
        isOpen={loading || success || !!error}
        status={loading ? "loading" : success ? "success" : "error"}
        loadingText="Submitting your final submission..."
        successText="Final submission submitted successfully!"
        errorText={error || "Failed to submit final submission. Please try again."}
        onClose={() => {
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </>
  );
}
