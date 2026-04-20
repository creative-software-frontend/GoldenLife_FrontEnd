import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Loader2, CheckCircle2, X } from 'lucide-react';
import OTPInput from './OTPInput';
import CountdownTimer from './CountdownTimer';

interface OTPVerificationModalProps {
  mobile: string;
  userId: number;
  onVerify: (userId: number, otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSuccess: () => void;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  mobile,
  userId,
  onVerify,
  onResend,
  isLoading,
  error,
  onClose,
  onSuccess,
}) => {
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showCountdown, setShowCountdown] = useState(true);

  const handleOtpComplete = async (otpCode: string) => {
    setOtpError(null);

    try {
      await onVerify(userId, otpCode);
      onSuccess();
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResend = async () => {
    setOtpError(null);
    setShowCountdown(false);

    try {
      await onResend();
      setShowCountdown(true);
    } catch (err: any) {
      setOtpError(err.message || 'Failed to resend OTP');
    }
  };

  // Format mobile for display
  const formattedMobile = mobile.length === 11 
    ? `${mobile.slice(0, 4)}-${mobile.slice(4, 8)}-${mobile.slice(8)}`
    : mobile;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-orange-100 text-[#FF8A00] flex items-center justify-center rounded-full mb-4">
            <Smartphone className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">
            Verify Your Mobile
          </h2>
          <p className="text-gray-500 text-sm">
            Enter 4-digit OTP sent to
          </p>
          <p className="text-gray-800 font-bold mt-1">
            +88 {formattedMobile}
          </p>
        </div>

        {/* Error Message */}
        {otpError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100 mb-4"
          >
            {otpError}
          </motion.div>
        )}

        {/* OTP Input */}
        <OTPInput
          length={4}
          onComplete={handleOtpComplete}
          disabled={isLoading}
          error={otpError || undefined}
        />

        {/* Verify Button */}
        <motion.button
          onClick={() => {
            // Auto-triggered by OTP input
          }}
          disabled={true}
          className="w-full bg-[#FF8A00] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all mt-6 opacity-70 cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </span>
          ) : (
            'Verify & Continue'
          )}
        </motion.button>

        {/* Countdown Timer & Resend */}
        {showCountdown && (
          <CountdownTimer
            duration={60}
            onComplete={() => {}}
            onResend={handleResend}
            isLoading={isLoading}
          />
        )}

        {/* Success Indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            <CheckCircle2 className="w-4 h-4 inline mr-1" />
            Registration successful! Please verify your mobile number.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPVerificationModal;
