import { useEffect, useState } from "react";
import Start from "./components/Start";
import FirstProgress from "./components/FirstProgress";
import SecondProgress from "./components/SecondProgress";
import Final from "./components/Final";
import { useUserProfile } from "../../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import type { DetailProgress } from "../../types/final-submission";

export default function Submissions() {
  const [activeTab, setActiveTab] = useState(1);
  const { data, error, loading } = useUserProfile();
  const [firstProgress, setFirstProgress] = useState<DetailProgress[]>([]);
  const [secondProgress, setSecondProgress] = useState<DetailProgress[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!data || error)) {
      navigate("/login");
    }

    setActiveTab(
      data && data.team && data.team.final_submission_meta?.current_step || 1
    );

    setSteps(prevSteps =>
      prevSteps.map(step => {
        if (data && data.team && data.team.final_submission_meta) {
          const setting = data.team.final_submission_meta.settings;
          if (step.tabNumber === 2) {
            return { ...step, is_open: setting.is_open_first_progress || false };
          } else if (step.tabNumber === 3) {
            return { ...step, is_open: setting.is_open_second_progress || false };
          } else if (step.tabNumber === 4) {
            return { ...step, is_open: setting.is_open_final || false };
          }
        }
        return step;
      })
    )

    const progressData = data?.team?.final_submission_meta?.submission?.progress_details ?? [];
    const first = progressData.filter((item) => item.type_progress === "first_progress");
    const second = progressData.filter((item) => item.type_progress === "second_progress");

    if (first.length > 0) {
      setFirstProgress(first);
    }

    if (second.length > 0) {
      setSecondProgress(second);
    }







  }, [data, error, loading, navigate]);



  const [steps, setSteps] = useState([
    {
      no: "01",
      title: "Start",
      tabNumber: 1,
      is_open: true,
    },
    {
      no: "02",
      title: "First Progress",
      tabNumber: 2,
      is_open: false,
    },
    {
      no: "03",
      title: "Second Progress",
      tabNumber: 3,
      is_open: false,
    },
    {
      no: "04",
      title: "Final",
      tabNumber: 4,
      is_open: false,
    },
  ]);

  const handleNext = () => {
    if (activeTab < 4) {
      const currentStep = steps.find(step => step.tabNumber === activeTab);
      if (currentStep && currentStep.is_open) {
        if (steps[activeTab].is_open) {
          setActiveTab((prev) => prev + 1);
        }
      }
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <Start 
          team_id={data?.team?.id || ""}
          link_repository={data?.team?.final_submission_meta?.submission?.link_repo || null}
          current_step={data?.team?.final_submission_meta?.current_step || 0}
        />;
      case 2:
        return <FirstProgress progressData={firstProgress} team_id={data?.team?.id || ""} current_step={data?.team?.final_submission_meta?.current_step || 1} resultDocument={data?.team?.final_submission_meta?.submission?.link_result_first_progress ?? null} />;
      case 3:
        return <SecondProgress progressData={secondProgress} team_id={data?.team?.id || ""} current_step={data?.team?.final_submission_meta?.current_step || 1} resultDocument={data?.team?.final_submission_meta?.submission?.link_result_second_progress ?? null} />;
      case 4:
        return <Final 
          link_youtube={data?.team?.final_submission_meta?.submission?.link_youtube || null}
          link_pitchdeck={data?.team?.final_submission_meta?.submission?.link_pitchdeck || null}
          link_result_final={data?.team?.final_submission_meta?.submission?.link_result_final || null}
          current_step={data?.team?.final_submission_meta?.current_step || 1}
          team_id={data?.team?.id || ""}
        />;
      default:
        return <Start link_repository={data?.team?.final_submission_meta?.submission?.link_repo || null} team_id={data?.team?.id || ""} current_step={data?.team?.final_submission_meta?.current_step || 1} />;
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="min-h-screen flex flex-col items-center justify-center">
          <div className="loader">
            <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!data || error) {
    navigate("/login");
  }

  if (data && data.is_leader === false) {
    return <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-semibold mb-4">
        Access Denied
      </h2>
      <p className="text-gray-600">
        You do not have permission to access this page.
      </p>
    </div>;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-6 py-10">
      <div className="mx-auto w-full max-w-6xl">
        {/* Tabbar */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, idx) => (
              <button
                key={s.no}
                disabled={activeTab === s.tabNumber || !s.is_open}
                onClick={() => setActiveTab(s.tabNumber)}
                className={
                  `relative flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-gray-50 ${!s.is_open ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ` +
                  (activeTab === s.tabNumber
                    ? "bg-orange-50"
                    : "bg-white")
                }
              >
                {idx !== 0 && (
                  <div className="absolute left-0 top-1/2 hidden h-[2px] w-6 -translate-x-4 -translate-y-1/2 bg-gray-200 lg:block" />
                )}

                <div
                  className={
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors " +
                    (activeTab === s.tabNumber
                      ? "bg-orange-50 text-orange-600 ring-2 ring-orange-500"
                      : "bg-gray-100 text-gray-500 ring-1 ring-gray-200")
                  }
                >
                  {s.no}
                </div>
                <div className="min-w-0">
                  <div
                    className={
                      "truncate text-sm font-semibold transition-colors " +
                      (activeTab === s.tabNumber
                        ? "text-orange-600"
                        : "text-gray-700")
                    }
                  >
                    {s.title}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {renderTabContent()}
        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
            disabled={activeTab === 1}
            className={
              "rounded-xl px-6 py-3 text-sm font-semibold transition-colors " +
              (activeTab === 1
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300")
            }
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={activeTab === 4}
            className={
              "rounded-xl px-6 py-3 text-sm font-semibold transition-colors " +
              (activeTab === 4 || steps[activeTab].is_open === false
                ? "cursor-not-allowed bg-gray-100 text-gray-400"
                : "bg-orange-500 text-white hover:bg-orange-600")
            }
          >
            {
              activeTab === 4 ? "Selesai" : "Selanjutnya"
            }
          </button>
        </div>
      </div>
    </div>
  );
}