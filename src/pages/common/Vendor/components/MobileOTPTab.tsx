import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import OTPInput from './OTPInput';
import CountdownTimer from './CountdownTimer';

interface MobileOTPTabProps {
  onSendOtp: (mobile: string) => Promise<any>;
  onVerifyOtp: (otp: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
  onSuccess: () => void;
}

type MobileStep = 'input' | 'otp';

const MobileOTPTab: React.FC<MobileOTPTabProps> = ({
  onSendOtp,
  onVerifyOtp,
  isLoading,
  error,
  onSuccess,
}) => {
  const [step, setStep] = useState<MobileStep>('input');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);
  const [showCountdown, setShowCountdown] = useState(false);

  const validateMobile = (value: string): boolean => {
    if (!value.trim()) {
      setMobileError('Mobile number is required');
      return false;
    }

    const mobileRegex = /^01[3-9]\d{8}$/;
    if (!mobileRegex.test(value)) {
      setMobileError('Enter a valid 11-digit mobile number (01XXXXXXXXX)');
      return false;
    }

    setMobileError('');
    return true;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobile(mobile)) {
      return;
    }

    try {
      await onSendOtp(mobile);
      setStep('otp');
      setShowCountdown(true);
      setOtpError(null);
    } catch (err: any) {
      // Error handled by parent
    }
  };

  const handleOtpComplete = async (otpCode: string) => {
    setOtpError(null);

    try {
      await onVerifyOtp(otpCode);
      onSuccess();
    } catch (err: any) {
      setOtpError(err.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setOtpError(null);
    setShowCountdown(false);

    try {
      await onSendOtp(mobile);
      setShowCountdown(true);
    } catch (err: any) {
      // Error handled by parent
    }
  };

  const handleBackToInput = () => {
    setStep('input');
    setOtpError(null);
    setShowCountdown(false);
  };

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setMobile(value);
    if (mobileError) setMobileError('');
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'input' ? (
        <motion.form
          key="mobile-input"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleSendOtp}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={mobile}
                onChange={handleMobileChange}
                className={`w-full pl-10 pr-4 py-3.5 border ${
                  mobileError ? 'border-red-500' : 'border-gray-300'
                } rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
              />
            </div>
            {mobileError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {mobileError}
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending OTP...
              </span>
            ) : (
              'Login via OTP'
            )}
          </motion.button>
        </motion.form>
      ) : (
        <motion.div
          key="otp-verification"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBackToInput}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#FF8A00] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Change mobile number
          </button>

          {/* OTP Header */}
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 text-[#FF8A00] flex items-center justify-center rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Verify Your Phone
            </h3>
            <p className="text-gray-500 text-sm">
              Enter 4-digit OTP sent to{' '}
              <span className="font-bold text-gray-800">{mobile}</span>
            </p>
          </div>

          {/* Error Message */}
          {otpError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
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
              // This will be triggered by OTP auto-complete
            }}
            disabled={true}
            className="w-full bg-[#FF8A00] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all opacity-70 cursor-not-allowed"
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

          {/* Countdown Timer */}
          {showCountdown && (
            <CountdownTimer
              duration={60}
              onComplete={() => {}}
              onResend={handleResendOtp}
              isLoading={isLoading}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileOTPTab;
