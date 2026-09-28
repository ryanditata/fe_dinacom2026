import { useState } from "react";
import { useFinalSubmissionActions } from "../../../hooks/useFinalSubmissionActions";
import LoadingModal from "../../../components/LoadingModal";
import * as Yup from "yup";

interface StartProps {
  team_id: string;
  link_repository?: string | null;
  current_step?: number;
}


export default function Start({ link_repository, current_step, team_id }: StartProps) {
  const [linkRepo, setLinkRepo] = useState<string>(link_repository ?? "");

  const {
    loading, error, submitStart, success, reset
  } = useFinalSubmissionActions();

  const validationSchema = Yup.object().shape({
    linkRepo: Yup.string()
      .url("Masukkan URL yang valid")
      .required("URL Repository wajib diisi"),
  });

  const [errors, setErrors] = useState<{ linkRepo?: string }>({});

  const validateInput = async () => {
    try {
      await validationSchema.validate({ linkRepo });
      return true;
    } catch (validationError) {
      if (validationError instanceof Yup.ValidationError) {
        setErrors({ linkRepo: validationError.message });
      }
      return false;
    }
  };

  const handleSubmit = () => {
    try{
      setErrors({});
      validateInput().then((isValid) => {
        if (isValid) {
          submitStart(
            linkRepo,
            team_id,
          );
        }
      });
    } catch (error) {
      console.error("Submission error:", error);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-700">
          URL Repository GitHub
        </label>
        {
          current_step && current_step >= 1 && link_repository ? (
            <a href={link_repository} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline text-sm"
            >{link_repository}</a>
          ) : (
            <input
              type="url"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:bg-white focus:ring-2"
              placeholder="https://github.com/username/repository"
              value={linkRepo}
              onChange={(e) => {
                setErrors({});
                setLinkRepo(e.target.value);
              }}
            />
          )
        }
      </div>
      {errors.linkRepo && (
        <p className="mt-2 text-sm text-red-600">{errors.linkRepo}</p>
      )}
      { !(current_step && current_step >= 1) && (
        <div className="mt-6">
          <button 
            onClick={handleSubmit}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Submit Start
          </button>
        </div>
      )}
    </div>
    <LoadingModal
        isOpen={loading || success || !!error}
        status={loading ? "loading" : success ? "success" : "error"}
        loadingText="Submitting your start submission..."
        successText="Start submitted successfully!"
        errorText={error || "Failed to submit start. Please try again."}
        onClose={() => {
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </>
  );
}
