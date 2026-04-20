import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  loginMethod: 'email' | 'mobile';
}

export const OtpModal: React.FC<OtpModalProps> = ({
  isOpen,
  onClose,
  onVerify,
  onResend,
  isLoading,
  error,
  loginMethod,
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60); // 60 seconds countdown
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Debug log when modal receives isOpen prop
  useEffect(() => {
    console.log('🔵 [OtpModal] isOpen prop changed:', isOpen);
    if (isOpen) {
      console.log('✅ [OtpModal] Modal should be visible now');
    }
  }, [isOpen]);

  // Auto-focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Resend timer countdown
  useEffect(() => {
    if (isOpen && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [isOpen, resendTimer]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, 4);
    
    if (pastedData.length === 4) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input or verify button
      inputRefs.current[3]?.focus();
    }
  };

  // Handle verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    
    if (otpCode.length !== 4) {
      return;
    }

    try {
      await onVerify(otpCode);
      // Clear OTP on success (modal will close via parent)
      setOtp(['', '', '', '']);
    } catch (error) {
      // Error handled by parent
    }
  };

  // Handle resend
  const handleResend = async () => {
    if (!canResend) return;

    try {
      await onResend();
      // Reset timer
      setResendTimer(60);
      setCanResend(false);
      // Clear OTP inputs
      setOtp(['', '', '', '']);
      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      // Error handled by parent
    }
  };

  // Close modal and reset state
  const handleClose = () => {
    setOtp(['', '', '', '']);
    setResendTimer(60);
    setCanResend(false);
    onClose();
  };

  if (!isOpen) return null;

  const otpCode = otp.join('');
  const isComplete = otpCode.length === 4;

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Content */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all animate-in fade-in zoom-in-95 duration-200">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Account
            </h2>
            
            <p className="text-gray-500 text-sm">
              We've sent a 4-digit verification code to your {loginMethod}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            
            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* OTP Input Fields */}
            <div className="flex gap-3 justify-center mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-100 outline-none transition-all disabled:opacity-50"
                  disabled={isLoading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <Button
              type="submit"
              disabled={!isComplete || isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Verify & Continue</span>
                </>
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-sm transition-colors disabled:opacity-50"
                >
                  <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Resend Code
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Resend available in{' '}
                  <span className="font-bold text-orange-600">
                    {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
