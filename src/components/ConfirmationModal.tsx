
interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
}


const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan?",
  confirmText = "Ya",
  cancelText = "Batal",
  type = "info"
}: ConfirmationDialogProps) => {
  if (!isOpen) return null;

  const getIconColor = () => {
    switch (type) {
      case 'warning':
        return 'text-orange-500';
      case 'error':
        return 'text-red-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="fixed inset-0 bg-black opacity-50 z-10"></div>
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-fadeIn z-30">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-900">DINACOM</span>{' '}
            <span className="text-orange-500">2026</span>
          </h1>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`text-8xl ${getIconColor()}`}>
            <svg viewBox="0 0 100 100" className="w-24 h-24">
              <circle cx="30" cy="35" r="8" fill="currentColor" />
              <circle cx="30" cy="55" r="8" fill="currentColor" />
              <rect x="45" y="20" width="12" height="60" fill="currentColor" transform="rotate(15 51 50)" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>

    </div>
  );
};


export default ConfirmationDialog;
