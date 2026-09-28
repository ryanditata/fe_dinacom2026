// LeaderDetail.tsx
import React, { useRef, useState } from "react";
import { Copy, Trash2, ChevronRight, Upload, ChevronDown } from "lucide-react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import type { TeamData } from "../../types/team";
import { usePaymentActions } from "../../hooks/usePaymentActions";
import LoadingModal from "../LoadingModal";
import { useSubmissionActions } from "../../hooks/useSubmissionActions";
import { toast } from "react-toastify";
import { generateFileLink } from "../../libs/generate-file-link";
import { mutate } from "swr";

type TimeLeft = { days: number; hours: number; mins: number; secs: number };

type Props = {
  team: TeamData;
  timeLeft: TimeLeft;
  onRefresh?: () => Promise<void> | void;
};

const fileLabel = (
  url?: string | null,
  type?: "proposal" | "originality" | "repo_github"
) => {
  if (!url) return "-";
  try {
    const last = url.split("/").pop() || url;
    const extMatch = last.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
    const ext = extMatch ? extMatch[1] : "pdf";
    if (type === "proposal") return `proposal.${ext}`;
    if (type === "repo_github") return `repository link`;
    return `originalityletter.${ext}`;
  } catch {
    return type === "proposal" ? "proposal.pdf" : "originalityletter.pdf";
  }
};

const LeaderView: React.FC<Props> = ({ team, timeLeft, onRefresh }) => {
  const [copied, setCopied] = useState(false);

  // Payment modal & form state
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [senderName, setSenderName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [submissions, setSubmissions] = useState(
    [] as {
      title: string;
      file?: string | null;
      status: "not-uploaded" | "accepted" | "pending";
    }[]
  );

  // Upload submission modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadType, setUploadType] = useState<
    "proposal" | "originality" | "repo_github"
  >("proposal");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadFileInputRef = useRef<HTMLInputElement | null>(null);

  const [repoUrl, setRepoUrl] = useState<string>(team?.url_repo_github || "");
  const [_, setPresentationUrl] = useState<string>(
    team?.url_presentation || ""
  );

  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  const {
    savePayment,
    loading: paymentLoading,
    success: paymentSuccess,
    error: paymentError,
    reset: resetPayment,
  } = usePaymentActions();

  const {
    loading: submissionLoading,
    success: submissionSuccess,
    error: submissionError,
    reset: resetSubmission,
  } = useSubmissionActions();

  const navigate = useNavigate();

  React.useEffect(() => {
    const proposalUrl = team?.url_proposal ?? null;
    const statementUrl = team?.url_statement_originality ?? null;

    const subs: {
      title: string;
      file?: string | null;
      status: "not-uploaded" | "accepted" | "pending";
    }[] = [
      {
        title: "Project Proposal",
        file: proposalUrl,
        status: proposalUrl ? "accepted" : "not-uploaded",
      },
      {
        title: "Originality Statement",
        file: statementUrl,
        status: statementUrl ? "accepted" : "not-uploaded",
      },
      {
        title: "GitHub Repository URL",
        file: team?.url_repo_github || null,
        status: team?.url_repo_github ? "accepted" : "not-uploaded",
      },
    ];

    setSubmissions(subs);
    setRepoUrl(team?.url_repo_github || "");
    setPresentationUrl(team?.url_presentation || "");
  }, [team?.id]);

  const handleCopy = async () => {
    const code = team?.team_code || "";
    if (!code) {
      toast.error("Team code tidak tersedia.");
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Team code disalin ke clipboard");
    } catch (err) {
      console.error("Copy failed:", err);
      toast.error("Gagal menyalin ke clipboard");
    }
  };

  const openPaymentModal = () => {
    setSenderName("");
    setBankName("");
    setAccountNumber("");
    setProofFile(null);
    setFormErrors({});
    setPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    if (!paymentLoading) setPaymentModalOpen(false);
  };

  const handleBrowseFile = () => fileInputRef.current?.click();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setProofFile(f);
      setFormErrors((p) => ({ ...p, proofFile: "" }));
    }
  };

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const f = ev.dataTransfer.files?.[0] ?? null;
    if (f) setProofFile(f);
  };

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) =>
    ev.preventDefault();

  const validatePaymentForm = () => {
    const e: { [k: string]: string } = {};
    if (!senderName.trim()) e.senderName = "Sender's Name wajib diisi";
    if (!bankName.trim()) e.bankName = "Bank Name wajib diisi";
    if (!accountNumber.trim()) e.accountNumber = "Account's Number wajib diisi";
    if (!proofFile) e.proofFile = "Payment's Proof wajib diunggah";
    if (proofFile && proofFile.size > 10 * 1024 * 1024)
      e.proofFile = "Ukuran file max 10MB";
    return e;
  };

  const handleSavePayment = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!team?.id) {
      toast.error("Team ID tidak ditemukan.");
      return;
    }

    const errs = validatePaymentForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const fd = new FormData();
    fd.append("account_name", senderName);
    fd.append("bank_name", bankName);
    fd.append("account_number", accountNumber);

    if (proofFile) fd.append("payment_proof", proofFile);

    try {
      await savePayment(team.id, fd);
      setPaymentModalOpen(false);
      mutate("user-profile");
    } catch (err) {
      toast.error(err as string || "Terjadi kesalahan saat menyimpan payment.");
    }
  };

  const openUploadModal = () => {
    setSelectedFile(null);
    setUploadType("proposal");
    setUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    if (!submissionLoading) {
      setUploadModalOpen(false);
      setSelectedFile(null);
    }
  };

  const handleUploadFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        toast.error("Hanya file PDF yang diperbolehkan untuk submission.", {
          position: "top-right",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimum 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        toast.error("Hanya file PDF yang diperbolehkan untuk submission.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimum 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadSubmit = async () => {
    
    toast.error("Submissions are currently closed for this competition.");

    return;


  //   if (!team?.id) {
  //     toast.error("Team ID not found.");
  //     return;
  //   }

  //   const fd = new FormData();

  //   fd.append("presentation_url", presentationUrl || "");

  //   if (uploadType === "proposal" || uploadType === "originality") {
  //     if (!selectedFile) {
  //       toast.error("Please select a file to upload.");
  //       return;
  //     }

  //     if (selectedFile.size > 10 * 1024 * 1024) {
  //       toast.error("File size exceeds the maximum limit of 10MB.");
  //       return;
  //     }

  //     if (uploadType === "proposal") {
  //       fd.append("proposal_file", selectedFile);
  //     } else if (uploadType === "originality") {
  //       fd.append("statement_originality_file", selectedFile);
  //     }
  //   }

  //   if (uploadType === "repo_github") {
  //     if (!repoUrl.trim()) {
  //       toast.error("Please enter the GitHub repository URL.");
  //       return;
  //     }

  //     if (
  //       !repoUrl
  //         .trim()
  //         .match(
  //           /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/
  //         )
  //     ) {
  //       toast.error("Please enter a valid GitHub repository URL.");
  //       return;
  //     }
  //     fd.append("url_repo_github", repoUrl.trim());
  //   }


  //  try {
  //     await saveSubmission(team.id, fd);
  //     setUploadModalOpen(false);
  //     await mutate("user-profile", undefined, { revalidate: true });
  //   } catch (err) {
  //     toast.error(
  //       err as string || "Terjadi kesalahan saat mengunggah submission."
  //     );
  //   }


    


    
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!team?.id) {
      toast.error("Team ID tidak ditemukan.");
      return;
    }

    if (!confirm("Hapus anggota dari tim? Aksi ini tidak bisa dibatalkan."))
      return;

    try {
      setDeletingMemberId(memberId);
      const token = Cookies.get("token") || Cookies.get("_dinacom_token");
      if (!token) {
        toast.error("Token tidak ditemukan. Silakan login ulang.");
        navigate("/login");
        return;
      }

      const res = await fetch(
        `https://dev-be-dinacom.dnccudinus.org/api/v1/teams/${team.id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const body = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          body?.meta?.message ||
          `Gagal menghapus anggota (status ${res.status})`;
        toast.error(msg);
        console.error("Delete member failed:", body);
        return;
      }

      if (body?.meta?.success) {
        toast.success(body.meta.message || "Member berhasil dihapus");
        // locally update team members is optional; prefer refetch via onRefresh
        if (onRefresh) await onRefresh();
      } else {
        toast.error(body?.meta?.message || "Gagal menghapus anggota");
      }
    } catch (err) {
      console.error("Remove member error:", err);
      toast.error("Terjadi kesalahan saat menghapus anggota");
    } finally {
      setDeletingMemberId(null);
    }
  };

  // prepare UI pieces
  const members = team?.members ?? [];
  const sorted = [...members].sort((a, b) => {
    if (a.role_in_team?.toLowerCase() === "leader") return -1;
    if (b.role_in_team?.toLowerCase() === "leader") return 1;
    return 0;
  });
  const leader =
    sorted.find((m) => m.role_in_team?.toLowerCase() === "leader") ?? null;
  const otherMembers = sorted.filter(
    (m) => m.role_in_team?.toLowerCase() !== "leader"
  );
  const guidebook = team?.competition?.url_guidebook || "#";
  const community = team?.competition?.url_community || "#";

  // payment proof url: accept multiple possible keys from different backends
  const paymentProofUrl =
    team?.payment?.url_payment_proof ||
    team?.payment?.payment_proof_url ||
    team?.payment?.url_payment_proof ||
    null;

  const getModalStatus = () => {
    if (paymentLoading || submissionLoading) return "loading";
    if (paymentSuccess || submissionSuccess) return "success";
    if (paymentError || submissionError) return "error";
    return "loading";
  };

  const handleCloseLoadingModal = () => {
    resetPayment();
    resetSubmission();
  };

  const isModalOpenLoadingPayment =
    paymentLoading || paymentSuccess || !!paymentError;
  const isModalOpenLoadingSubmission =
    submissionLoading || submissionSuccess || !!submissionError;

  return (
    <>
      <title>Dinacom - Leader</title>
      <meta
        name="description"
        content="Leader dashboard - manage team, submissions and payments"
      />
      <div className="py-14 px-6 md:px-11">
        <div className="w-full bg-gray-100">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-9">
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-8">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-bold text-black mb-4">
                      Team Profile
                    </h2>
                    <h3 className="text-2xl mb-3 font-medium text-[#FF4800]">
                      {team?.team_name || "-"}
                    </h3>

                    <div className="flex items-center gap-4">
                      <span className="text-gray-600 text-xl font-medium font-mono">
                        {team?.team_code || "-"}
                      </span>
                      <button
                        onClick={handleCopy}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {copied && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-bold">Leader</h4>
                    {leader?.user ? (
                      <div>
                        <p className="text-xl font-medium">
                          {leader.user.name}
                        </p>
                        <p className="text-lg text-[#637381]">
                          {leader.user.phone || "-"}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Data leader tidak tersedia
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-bold">Members</h4>
                    {otherMembers.length === 0 && (
                      <p className="text-sm text-gray-600">
                        Belum ada anggota.
                      </p>
                    )}
                    <div className="flex flex-col gap-4">
                      {otherMembers.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <p className="text-[#282626] text-xl">
                              {m.user?.name || m.id_user}
                            </p>
                            <p className="text-lg text-[#637381]">
                              {m.user?.phone || "-"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              className={`text-gray-400 hover:text-red-500 inline-flex items-center`}
                              disabled={deletingMemberId === m.id}
                              title="Hapus anggota"
                            >
                              {deletingMemberId === m.id ? (
                                <svg
                                  className="w-5 h-5 animate-spin text-red-500"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                  ></path>
                                </svg>
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* card payment */}
              <div className="bg-white flex flex-col rounded-2xl gap-3 p-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Payment Status</h2>

                  {paymentProofUrl ? (
                    <span className="px-3 py-1 rounded-md text-md font-semibold bg-green-100 text-green-700">
                      Uploaded
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-md text-md font-semibold bg-yellow-100 text-yellow-800">
                      Not Uploaded
                    </span>
                  )}
                </div>

                <button className="cursor-pointer inline-flex font-semibold items-center gap-2 text-[#5773F8]">
                  <span>Payment Guide</span>
                  <ChevronRight className="text-[#5773F8]" />
                </button>

                <p className="text-[#637381]">
                  Please transfer the payment to:
                </p>
                <h3 className="text-2xl font-bold text-[#FF4800]">
                  DIAN NUSWANTORO
                </h3>
                <div className="flex flex-col gap-1 w-full text-[#637381]">
                  <p className="font-medium text-base">Bank Jateng</p>
                  <p className="text-lg font-semibold tracking-wide">
                    3099070268 
                  </p>
                  <p className="text-sm">a.n. Kemahasiswaan Udinus</p>
                </div>

                <div className="w-full flex justify-end items-center gap-4">
                  {paymentProofUrl && (
                    <a
                      href={generateFileLink(paymentProofUrl)}
                      className=" bg-white border text-sm border-none underline text-blue-600"
                      target="_blank"
                      title="Preview payment proof"
                    >
                      Preview
                    </a>
                  )}

                  <button
                    disabled={!!paymentProofUrl}
                    onClick={openPaymentModal}
                    className={`bg-[#FF4800] ml-auto hover:bg-orange-600 text-white px-7 py-3 rounded-md${
                      paymentProofUrl
                        ? " opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl p-10">
                <h2 className="text-xl font-bold mb-5">Countdown</h2>
                <div className="flex justify-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">
                      {String(timeLeft.days).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Days</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Hours</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">
                      {String(timeLeft.mins).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Mins</div>
                  </div>
                  <div className="text-[32px] font-bold text-[#FF4800]">:</div>
                  <div className="text-center">
                    <div className="text-2xl md:text-[32px] font-bold text-[#FF4800]">
                      {String(timeLeft.secs).padStart(2, "0")}
                    </div>
                    <div className="text-sm text-gray-600 mt-2">Secs</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <a
                  href={community}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[15px] bg-[#FF4800] hover:bg-orange-600 text-white font-bold px-8 py-5 md:py-9 rounded-xl text-center"
                >
                  Community
                </a>
                <a
                  href={guidebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 text-[15px] border-2 bg-white border-[#FF4800] text-black hover:bg-orange-50 font-bold px-8 py-5 md:py-9 rounded-xl text-center"
                >
                  Guidebook
                </a>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Submission</h2>
                  <button
                    onClick={openUploadModal}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#FF4800] text-white hover:bg-[#e64000] transition-colors"
                  >
                    <span>Upload</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {submissions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-start justify-between gap-4 rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{s.title}</h3>
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-500">
                            {fileLabel(
                              s.file,
                              i === 0
                                ? "proposal"
                                : i === 1
                                ? "originality"
                                : "repo_github"
                            )}
                          </p>

                          {s.file && (
                            <a
                              href={
                                s.title === "GitHub Repository URL"
                                  ? s.file
                                  : generateFileLink(s.file)
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 underline text-sm"
                            >
                              View File
                            </a>
                          )}
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-md text-sm font-semibold whitespace-nowrap ${
                          s.status === "accepted"
                            ? "bg-[#3EBF3E]/20 text-[#3EBF3E]"
                            : s.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-[#ED2129]/20 text-[#ED2129]"
                        }`}
                      >
                        {s.status === "accepted"
                          ? "Accepted"
                          : s.status === "pending"
                          ? "Pending"
                          : "Not Uploaded"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-10">
                <h2 className="text-xl font-bold mb-4">Announcement</h2>
                <div className="text-center py-10">
                  <p className="text-4xl font-bold text-[#FF4800]">
                    {(team?.status || "—").toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {paymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closePaymentModal}
            ></div>
            <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl">
              <h3 className="text-xl font-semibold text-center mb-4">
                Payment Form
              </h3>

              <form onSubmit={handleSavePayment}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sender's Name
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => {
                        setSenderName(e.target.value);
                        setFormErrors((p) => ({ ...p, senderName: "" }));
                      }}
                      placeholder="Type here"
                      className={`w-full px-5 py-3 rounded-md border placeholder:text-[#9CA3AF] ${
                        formErrors.senderName
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    />
                    {formErrors.senderName && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.senderName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => {
                        setBankName(e.target.value);
                        setFormErrors((p) => ({ ...p, bankName: "" }));
                      }}
                      className={`w-full px-5 py-3 rounded-md border placeholder:text-[#9CA3AF] ${
                        formErrors.bankName
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Type here"
                    />
                    {formErrors.bankName && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.bankName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Account's Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => {
                        setAccountNumber(e.target.value);
                        setFormErrors((p) => ({ ...p, accountNumber: "" }));
                      }}
                      className={`w-full px-5 py-3 rounded-md border placeholder:text-[#9CA3AF] ${
                        formErrors.accountNumber
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                      placeholder="Type here"
                    />
                    {formErrors.accountNumber && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Payment's Proof (gambar / pdf)
                    </label>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className={`flex items-center justify-between gap-4 px-4 py-3 rounded-md border ${
                        formErrors.proofFile
                          ? "border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex-1 text-sm text-gray-500">
                        {proofFile ? proofFile.name : "File"}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleBrowseFile}
                          className="p-2 rounded hover:bg-gray-100"
                        >
                          <Upload className="text-[#9CA3AF]" />
                        </button>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={onFileChange}
                    />
                    {formErrors.proofFile && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.proofFile}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 justify-center mt-6">
                  <button
                    type="button"
                    onClick={closePaymentModal}
                    className="px-6 py-2 rounded-md bg-gray-600 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 font-medium w-full rounded-md bg-[#FF4800] text-white"
                  >
                    {"Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload Submission Modal */}
        {uploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeUploadModal}
            ></div>
            <div className="relative z-10 w-full max-w-md bg-white rounded-2xl flex flex-col p-9 gap-9 shadow-2xl">
              <h3 className="text-2xl text-center font-bold">Upload File</h3>

              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Upload Type
                </label>
                <div className="relative">
                  <select
                    value={uploadType}
                    onChange={(e) =>
                      setUploadType(
                        e.target.value as
                          | "proposal"
                          | "originality"
                          | "repo_github"
                      )
                    }
                    className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF4800] focus:border-transparent appearance-none"
                    disabled={submissionLoading}
                  >
                    <option value="proposal">Project Proposal</option>
                    <option value="originality">Originality Statement</option>
                    <option value="repo_github">GitHub Repository URL</option>
                  </select>

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {uploadType === "repo_github" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      GitHub Repository URL
                    </label>
                    <input
                      type="text"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="Type here"
                      className="w-full px-5 py-3 rounded-md border border-gray-200 placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>
              ) : (
                <div
                  onDrop={handleUploadDrop}
                  onDragOver={handleUploadDragOver}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-[#FF4800] transition-colors"
                >
                  {selectedFile ? (
                    <div className="space-y-2">
                      <div className="text-4xl">📄</div>
                      <p className="text-sm font-medium text-gray-700">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-[#FF4800] hover:underline"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="flex  flex-col items-center gap-3">
                      <p className="text-sm text-gray-600">Drag File</p>
                      <p className="text-sm text-gray-500">or</p>
                      <label className="w-full cursor-pointer inline-block px-6 py-2 bg-[#FF4800] text-white rounded-md hover:bg-[#e64000] transition-colors">
                        <span className="font-medium">
                          Browse File (PDF only)
                        </span>
                        <input
                          ref={uploadFileInputRef}
                          type="file"
                          className="hidden"
                          onChange={handleUploadFileSelect}
                          accept=".pdf,application/pdf"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeUploadModal}
                  className="flex-1 px-4 py-2 font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUploadSubmit}
                  className="flex-1 px-4 py-2 font-medium rounded-md bg-[#FF4800] text-white hover:bg-[#e64000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {"Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        <LoadingModal
          isOpen={isModalOpenLoadingPayment}
          status={getModalStatus()}
          loadingText="Memproses pembayaran..."
          successText="Pembayaran berhasil disimpan!"
          errorText={paymentError || "Pembayaran gagal! Silakan coba lagi."}
          onClose={handleCloseLoadingModal}
          showCloseButton={true}
          autoCloseDuration={3000}
        />

        <LoadingModal
          isOpen={isModalOpenLoadingSubmission}
          status={getModalStatus()}
          loadingText="Memproses pengiriman..."
          successText="Pengiriman berhasil disimpan!"
          errorText={submissionError || "Pengiriman gagal! Silakan coba lagi."}
          onClose={handleCloseLoadingModal}
          showCloseButton={true}
          autoCloseDuration={3000}
        />
      </div>
    </>
  );
};

export default LeaderView;
