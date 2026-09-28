import { useEffect } from "react";

type LoadingStatus = 'loading' | 'success' | 'error';

interface LoadingModalProps {
    isOpen?: boolean;
    status?: LoadingStatus;
    loadingText?: string;
    successText?: string;
    errorText?: string;
    onClose?: (() => void) | null;
    showCloseButton?: boolean;
    autoCloseDuration?: number | null;
}

const LoadingModal = ({
    isOpen = false,
    status = 'loading',
    loadingText = 'Mengirim...',
    successText = 'Berhasil Terikirim ke email!',
    errorText = 'Gagal mengirim! Silakan coba lagi.',
    onClose = null,
    showCloseButton = true,
    autoCloseDuration = null
}: LoadingModalProps) => {
    useEffect(() => {
        if (autoCloseDuration && status !== 'loading' && onClose) {
            const handler = onClose; // capture current reference to avoid narrowing issues in closures
            const timer = setTimeout(() => {
                handler && handler();
            }, autoCloseDuration);
            return () => clearTimeout(timer);
        }
    }, [status, autoCloseDuration, onClose]);

    if (!isOpen) return null;

    const renderIcon = () => {
        if (status === 'loading') {
            return (
                <div className="w-24 h-24 border-8 border-gray-200 border-t-orange-600 rounded-full animate-spin"></div>
            );
        }

        if (status === 'success') {
            return (
                <div className="w-24 h-24 border-8 border-green-500 rounded-full flex items-center justify-center animate-scaleIn">
                    <svg
                        className="w-12 h-12 text-green-500 animate-checkmark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                            className="animate-draw"
                        />
                    </svg>
                </div>
            );
        }

        if (status === 'error') {
            return (
                <div className="w-24 h-24 border-8 border-red-500 rounded-full flex items-center justify-center animate-scaleIn">
                    <svg
                        className="w-12 h-12 text-red-500 animate-checkmark"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M6 18L18 6M6 6l12 12"
                            className="animate-draw"
                        />
                    </svg>
                </div>
            );
        }
    };

    const getText = () => {
        if (status === 'loading') return loadingText;
        if (status === 'success') return successText;
        if (status === 'error') return errorText;
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-black opacity-20 z-80">

            </div>
            <div className="relative inset-0 z-100 h-full flex items-center justify-center p-4">
                <div className="">
                    <div className="bg-white rounded-2xl shadow-xl p-12 max-w-sm w-full text-center relative">
                        <div className="mb-6 flex justify-center">
                            {renderIcon()}
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            {getText()}
                        </h2>

                        {showCloseButton && status !== 'loading' && onClose && (
                            <button
                                onClick={() => onClose && onClose()}
                                className={`mt-6 px-6 py-2 text-white rounded-lg transition-colors ${status === 'success'
                                    ? 'bg-green-500 hover:bg-green-600'
                                    : 'bg-red-500 hover:bg-red-600'
                                    }`}
                            >
                                Tutup
                            </button>
                        )}
                    </div>

                    <style>{`
        @keyframes scaleIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes draw {
          0% {
            stroke-dasharray: 0, 100;
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dasharray: 100, 0;
            stroke-dashoffset: 0;
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-checkmark {
          animation: scaleIn 0.5s ease-out;
        }

        .animate-draw {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw 0.6s ease-out 0.3s forwards;
        }
      `}</style>
                </div>
            </div>

        </div>
    );
};

export default LoadingModal;