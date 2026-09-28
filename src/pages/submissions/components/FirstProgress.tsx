import {  useState } from "react";
import type { DetailProgress } from "../../../types/final-submission";
import { useFinalSubmissionActions } from "../../../hooks/useFinalSubmissionActions";
import LoadingModal from "../../../components/LoadingModal";
import { generateFileLink } from "../../../libs/generate-file-link";

interface FirstProgressProps {
  progressData?: DetailProgress[] | null;
  resultDocument?: string | null;
  current_step?: number;
  team_id: string;
}

export default function FirstProgress({ progressData, team_id, current_step, resultDocument }: FirstProgressProps) {
  const [commits, setCommits] = useState<DetailProgress[]>(
    progressData && progressData.length > 0
      ? progressData
      : [{ link_commit: "", description: "", type_progress: "first_progress", created_at: "", updated_at: "" }]
  );
  

  const [document, setDocument] = useState<File | null>(null)
  const {
    loading, error, submitProgress, success, reset
  } = useFinalSubmissionActions();


  const addCommit = () => {
    setCommits([
      ...commits,
      { link_commit: "", description: "", type_progress: "first_progress", created_at: "", updated_at: "" },
    ]);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDocument(file);
    }
  }

  const updateCommit = (index: number, field: "link_commit" | "description", value: string) => {
    const updatedCommits = [...commits];
    updatedCommits[index] = {
      ...updatedCommits[index],
      [field]: value,
    };
    setCommits(updatedCommits);
  };

  const removeCommit = (index: number) => {
    setCommits(commits.filter((_, idx) => idx !== index));
  };

  //List Ketentuan
  const policyCommit = {
    policies: [
      "Tambahkan URL commit GitHub beserta deskripsi fitur yang telah diimplementasikan.",
      "Pastikan commit bersifat public dan dapat diakses oleh juri.",
      "Sertakan deskripsi yang jelas untuk setiap perubahan kode.",
    ],
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("result_document", document as Blob);
      formData.append("progress", JSON.stringify(commits));

      submitProgress(formData, team_id);
    } catch (err) {
      console.error("Error submitting first progress:", err);
    }
  }


  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        {/* Submissions Policy */}
        <div className="mb-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-base font-semibold text-orange-800">Submissions Policy</p>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-orange-700">
                {policyCommit.policies.map((policy, index) => (
                  <li key={index}>{policy}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>


        {/* Upload Hasil PDF */}
        {
          resultDocument ? (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Hasil Dokumen PDF
              </label>
              <a href={
                generateFileLink(resultDocument)
              } target="_blank" rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                Lihat Dokumen Hasil
              </a>
            </div>
          ) : (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Hasil
              </label>
              <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-medium text-gray-600 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>{document ? document.name : "Upload file PDF"}</span>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
              <p className="mt-2 text-xs text-gray-500">
                Upload file PDF berisi screenshot hasil pengerjaan
              </p>
            </div>
          )
        }

        <div className="space-y-4">
          {/* List Commit */}
          {commits.map((commit, index) => (
            <div
              key={commit.id}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Commit {index + 1}
                </span>
                {commits.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCommit(index)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  {/* URL Commit */}
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    URL GitHub Commit
                  </label>
                  {
                    current_step && current_step >= 2 && commit.link_commit ? (
                      <a href={commit.link_commit} target="_blank" rel="noopener noreferrer"
                        className="text-blue-600 underline text-sm"
                      >{commit.link_commit}</a>
                    ) : (
                      <input
                    type="url"
                    value={commit.link_commit}
                    defaultValue={commit.link_commit}
                    onChange={(e) => updateCommit(index, "link_commit", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:ring-2"
                    placeholder="https://github.com/username/repo/commit/..."
                  />
                    )
                  }
                </div>

                <div>
                  {/* Deskripsi */}
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Deskripsi
                  </label>
                  {
                    current_step && current_step >= 2 && commit.description ? (
                      <p className="text-sm text-gray-800">
                        {commit.description}
                      </p>
                    ) : (
                      <textarea
                    value={commit.description}
                    defaultValue={commit.description}
                    onChange={(e) =>
                      updateCommit(index, "description", e.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none ring-orange-500 focus:ring-2"
                    placeholder="Deskripsikan fitur yang telah diimplementasikan"
                    rows={3}
                  />
                    )
                  }
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tambah Commit */}


        {
          !(current_step && current_step >= 2) && (
            <>
              <button
                type="button"
                onClick={addCommit}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Tambah Commit
              </button>
              <div className="mt-6">
          <button 
            onClick={handleSubmit}
            className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
          >
            Submit First Progress
          </button>
        </div>
            </>
          )
        }

      </div>
      <LoadingModal
        isOpen={loading || success || !!error}
        status={loading ? "loading" : success ? "success" : "error"}
        loadingText="Submitting your first progress..."
        successText="First progress submitted successfully!"
        errorText={error || "Failed to submit first progress. Please try again."}
        onClose={() => {
          reset()
        }}
        showCloseButton={true}
        autoCloseDuration={3000}
      />
    </>
  );
}
