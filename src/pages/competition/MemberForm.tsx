import React, { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useTeamActions } from "../../hooks/useTeamActions";
import LoadingModal from "../../components/LoadingModal";

const MemberForm: React.FC = () => {
  const [invitationCode, setInvitationCode] = useState("");
  const [errors, setErrors] = useState<{ invitationCode?: string }>({});

  const joinSchema = Yup.object().shape({
    invitationCode: Yup.string()
      .required("Invitation code must be filled")
      .min(8, "Invitation code is too short"),
  });

  const { joinTeam, loading, error, success, reset } = useTeamActions()


  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    joinSchema.validate({ invitationCode }, { abortEarly: false })
      .then(async () => {


        try {
          await joinTeam(invitationCode);
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

  return (
    <>
      <title>Dinacom</title>

      <div className="flex relative w-full min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute top-0 right-0">
          <img src="/bg-form.png" alt="" className="w-full" />
        </div>

        <div className="absolute font-jakarta bottom-8 left-8 text-9xl font-extrabold italic text-transparent [-webkit-text-stroke:1px_rgba(255,72,0,0.3)] select-none">
          MEMBER
        </div>

        <div className="flex flex-col p-10 bg-white z-10 rounded-2xl w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-10 text-center">
            Enter the Invitation Code
          </h1>

          <form onSubmit={handleJoin}>
            <div>
              <label className="block text-base font-medium text-black mb-2">
                Invitation Code
              </label>

              <input
                type="text"
                placeholder="Masukkan Invitation Code"
                value={invitationCode}
                onChange={(e) => {
                  setInvitationCode(e.target.value);
                  setErrors((prev) => ({ ...prev, invitationCode: undefined }));
                }}
                className={`w-full placeholder-gray-500 rounded border px-3 py-2 focus:outline-none ${errors.invitationCode
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-blue-600"
                  }`}
              />

              {errors.invitationCode && (
                <p className="text-red-500 text-xs mt-1">{errors.invitationCode}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? "bg-orange-300" : "bg-orange-600 hover:bg-orange-500"
                } text-white font-semibold py-2 rounded mt-4 transition-all cursor-pointer`}
            >
              {loading ? "Loading..." : "Join"}
            </button>
          </form>
        </div>
      </div>
      <LoadingModal
        isOpen={loading || success || !!error}
        status={loading ? "loading" : success ? "success" : "error"}
        loadingText="Joining team..."
        successText="Success join your team!"
        errorText={error || "Failed to join team. Please try again."}
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
