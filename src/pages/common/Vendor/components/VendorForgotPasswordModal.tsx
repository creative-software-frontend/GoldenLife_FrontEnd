import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Lock, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import OTPInput from './OTPInput';

interface VendorForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'mobile' | 'otp' | 'reset';

const VendorForgotPasswordModal = ({ isOpen, onClose }: VendorForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Reset Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // Countdown Timer
  const startCountdown = () => {
    setCountdown(60);
    setShowCountdown(true);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    setError('');

    // Validation
    if (!mobile) {
      setError('Mobile number is required');
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(mobile)) {
      setError('Enter a valid 11-digit mobile number (01XXXXXXXXX)');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/password/forgot`,
        null,
        {
          params: { mobile },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        setUserId(response.data.user_id);
        toast.success('OTP sent successfully! Please check your mobile.');
        setStep('otp');
        startCountdown();
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (otpCode: string) => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/password/verify-otp`,
        null,
        {
          params: {
            mobile,
            otp: otpCode,
            user_id: userId
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        setOtp(otpCode);
        toast.success('OTP verified successfully!');
        setStep('reset');
      } else {
        throw new Error(response.data?.message || 'Invalid OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Both password fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/password/reset`,
        null,
        {
          params: {
            mobile,
            otp,
            password: newPassword,
            password_confirmation: confirmPassword
          },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        toast.success('Password reset successful! Please login with your new password.');
        handleClose();
      } else {
        throw new Error(response.data?.message || 'Failed to reset password');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/password/forgot`,
        null,
        {
          params: { mobile },
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data?.success) {
        toast.success('OTP resent successfully!');
        startCountdown();
      } else {
        throw new Error(response.data?.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend OTP';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Close
  const handleClose = () => {
    setStep('mobile');
    setMobile('');
    setUserId(null);
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    onClose();
  };

  // Format mobile for display
  const formattedMobile = mobile.length === 11
    ? `${mobile.slice(0, 4)}-${mobile.slice(4, 8)}-${mobile.slice(8)}`
    : mobile;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {step === 'mobile' && 'Forgot Password'}
                  {step === 'otp' && 'Verify OTP'}
                  {step === 'reset' && 'Reset Password'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {step === 'mobile' && 'Enter your mobile number'}
                  {step === 'otp' && 'Enter the OTP sent to your mobile'}
                  {step === 'reset' && 'Create a new password'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {/* Step 1: Mobile Input */}
                {step === 'mobile' && (
                  <motion.div
                    key="mobile-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
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
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setMobile(value);
                            if (error) setError('');
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${error ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
                        />
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {error}
                        </p>
                      )}
                    </div>

                    <motion.button
                      onClick={handleSendOTP}
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
                        'Send OTP'
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: OTP Verification */}
                {step === 'otp' && (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 bg-orange-100 text-[#FF8A00] flex items-center justify-center rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        Verify Your Mobile
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Enter 4-digit OTP sent to
                      </p>
                      <p className="text-gray-800 font-bold mt-1">
                        +88 {formattedMobile}
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
                      >
                        {error}
                      </motion.div>
                    )}

                    <OTPInput
                      length={4}
                      onComplete={handleVerifyOTP}
                      disabled={isLoading}
                      error={error || undefined}
                    />

                    {/* Countdown & Resend */}
                    <div className="text-center mt-6">
                      <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend available in{' '}
                          <span className="font-bold text-[#FF8A00]">
                            0:{countdown.toString().padStart(2, '0')}
                          </span>
                        </p>
                      ) : (
                        <motion.button
                          onClick={handleResendOTP}
                          disabled={isLoading}
                          className="text-[#FF8A00] hover:text-orange-700 font-bold text-sm transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isLoading ? 'Sending...' : 'Resend OTP'}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Reset Password */}
                {step === 'reset' && (
                  <motion.form
                    key="reset-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (error) setError('');
                          }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${error ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (error) setError('');
                          }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${error ? 'border-red-500' : 'border-gray-300'
                            } rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {error && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {error}
                        </p>
                      )}
                    </div>

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
                          Resetting Password...
                        </span>
                      ) : (
                        'Reset Password'
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VendorForgotPasswordModal;
