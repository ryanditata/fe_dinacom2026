import { useState, useEffect } from 'react';
import { Mail, Clock, User } from 'lucide-react';
import { useAuthActions } from '../../hooks/useAuthActions';
import { Navigate } from 'react-router-dom';

export default function VerifyEmail() {
  const [countdown, setCountdown] = useState(30);
  const [email] = useState(localStorage.getItem("emailForVerification") || "your email");
  const { resendVerificationEmail, loading, error } = useAuthActions();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(30);
      resendVerificationEmail(email);
    }
  };

  if (error) {
    localStorage.removeItem("emailForVerification");
    return <Navigate to="/login" />;
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-2">
      <div className="w-full max-w-2xl">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo/Brand */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">
                <span className="text-gray-800">DINACOM</span>
                <span className="text-orange-500"> 2026</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
            Check your e-mail
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-center mb-2">
            We've sent an email to <span className="font-semibold text-gray-800">{email}</span>.
          </p>
          <p className="text-gray-600 text-center mb-6">
            It will expire shortly, so please verify it right now.
          </p>

          {/* Email Illustration */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Mail className="w-32 h-32 text-gray-300 stroke-1" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Resend Button */}
          <button
            onClick={handleResend}
            disabled={countdown > 0 || loading}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 mb-6 flex items-center justify-center space-x-2
              ${countdown > 0 || loading
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'}`}
          >
            {countdown > 0 ? (
              <>
                <Clock className="w-5 h-5" />
                <span>Resend in {countdown}s</span>
              </>
            ) : (
              <span>{loading ? "Resending..." : "Resend Verification Email"}</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Email not received?</span>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-3 flex flex-col">
            <p className="text-sm text-gray-600 text-center font-medium mb-3">
              Contact our support team:
            </p>
            
            <a href="https://wa.me/+6289666900321" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Zendry</p>
                    <p className="text-sm text-gray-600 truncate">089666900321</p>
                </div>
                </div>
            </a>

            <a href="https://wa.me/+6281392130582" target="_blank" rel="noopener noreferrer">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Aldi</p>
                    <p className="text-sm text-gray-600 truncate">081392130582</p>
                </div>
                </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}