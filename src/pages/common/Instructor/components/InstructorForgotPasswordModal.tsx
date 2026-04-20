import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Lock, Eye, EyeOff, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/hooks/useInstructorAuth';

interface InstructorForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'mobile' | 'otp' | 'reset';

const InstructorForgotPasswordModal = ({ isOpen, onClose }: InstructorForgotPasswordModalProps) => {
  const [step, setStep] = useState<Step>('mobile');
  const [mobile, setMobile] = useState('');
  const [mobileError, setMobileError] = useState('');

  // OTP state – 4-digit array for a premium UI, joined before sending
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  const [countdown, setCountdown] = useState(0);

  // Reset Password States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetError, setResetError] = useState('');

  // ─── TanStack Query Mutations ─────────────────────────────────────────────
  const forgotMutation = useForgotPasswordMutation();
  const resetMutation = useResetPasswordMutation();

  // ─── Countdown Timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // ─── OTP input helpers ────────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // keep only last char
    setOtp(newOtp);
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
    if (otpError) setOtpError('');
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // ─── Step 1: Send OTP ─────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    setMobileError('');
    if (!mobile) { setMobileError('Mobile number is required'); return; }
    if (!/^01[3-9]\d{8}$/.test(mobile)) {
      setMobileError('Enter a valid 11-digit mobile number (01XXXXXXXXX)');
      return;
    }

    try {
      await forgotMutation.mutateAsync({ mobile });
      toast.success('OTP sent! Check your mobile.');
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setMobileError(err.message || 'Failed to send OTP.');
      toast.error(err.message || 'Failed to send OTP.');
    }
  };

  // ─── Step 2: Move to reset form after entering OTP ───────────────────────
  const handleOtpNext = () => {
    const code = otp.join('');
    if (code.length !== 4) { setOtpError('Enter the complete 4-digit OTP.'); return; }
    setOtpError('');
    setStep('reset');
  };

  // ─── Resend OTP ────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    try {
      await forgotMutation.mutateAsync({ mobile });
      toast.success('OTP resent!');
      setCountdown(60);
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend OTP.');
    }
  };

  // ─── Step 3: Reset Password (OTP + new password in one call) ─────────────
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');

    if (!newPassword || !confirmPassword) { setResetError('Both password fields are required'); return; }
    if (newPassword !== confirmPassword) { setResetError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setResetError('Password must be at least 6 characters'); return; }

    const otpCode = otp.join('');

    try {
      await resetMutation.mutateAsync({
        mobile,
        otp: otpCode,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      toast.success('Password reset successful! Please login with your new password.');
      handleClose();
    } catch (err: any) {
      setResetError(err.message || 'Failed to reset password. Please try again.');
      toast.error(err.message || 'Failed to reset password.');
    }
  };

  // ─── Handle Close ─────────────────────────────────────────────────────────
  const handleClose = () => {
    setStep('mobile');
    setMobile('');
    setMobileError('');
    setOtp(['', '', '', '']);
    setOtpError('');
    setNewPassword('');
    setConfirmPassword('');
    setResetError('');
    setCountdown(0);
    forgotMutation.reset();
    resetMutation.reset();
    onClose();
  };

  const formattedMobile = mobile.length === 11
    ? `${mobile.slice(0, 4)}-${mobile.slice(4, 8)}-${mobile.slice(8)}`
    : mobile;

  const isSendingOtp = forgotMutation.isPending;
  const isResetting = resetMutation.isPending;

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
              <div className="flex items-center gap-3">
                {step !== 'mobile' && (
                  <button
                    onClick={() => setStep(step === 'reset' ? 'otp' : 'mobile')}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 text-gray-500" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {step === 'mobile' && 'Forgot Password'}
                    {step === 'otp' && 'Verify OTP'}
                    {step === 'reset' && 'Reset Password'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {step === 'mobile' && 'Enter your registered mobile number'}
                    {step === 'otp' && 'Enter the OTP sent to your mobile'}
                    {step === 'reset' && 'Create a new secure password'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex gap-1.5 px-6 pt-5">
              {(['mobile', 'otp', 'reset'] as Step[]).map((s, i) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    ['mobile', 'otp', 'reset'].indexOf(step) >= i ? 'bg-[#FF8A00]' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">

                {/* ── Step 1: Mobile Input ─────────────────────────── */}
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
                      <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          placeholder="01XXXXXXXXX"
                          value={mobile}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 11);
                            setMobile(value);
                            if (mobileError) setMobileError('');
                          }}
                          className={`w-full pl-10 pr-4 py-3.5 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
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

                    <motion.button
                      onClick={handleSendOTP}
                      disabled={isSendingOtp}
                      className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={{ scale: isSendingOtp ? 1 : 1.02 }}
                      whileTap={{ scale: isSendingOtp ? 1 : 0.98 }}
                    >
                      {isSendingOtp ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending OTP...
                        </span>
                      ) : 'Send OTP'}
                    </motion.button>
                  </motion.div>
                )}

                {/* ── Step 2: OTP Verification ─────────────────────── */}
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
                      <h3 className="text-lg font-bold text-gray-900 mb-1">Verify Your Mobile</h3>
                      <p className="text-gray-500 text-sm">Enter 4-digit OTP sent to</p>
                      <p className="text-gray-800 font-bold mt-1">+88 {formattedMobile}</p>
                    </div>

                    {otpError && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100"
                      >
                        {otpError}
                      </motion.div>
                    )}

                    {/* 4-box OTP Input */}
                    <div className="flex justify-center gap-3">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          maxLength={1}
                          ref={el => otpRefs.current[index] = el}
                          value={digit}
                          onChange={e => handleOtpChange(index, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(index, e)}
                          className="w-14 h-16 text-center text-3xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF8A00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,138,0,0.1)] outline-none transition-all"
                          autoFocus={index === 0}
                        />
                      ))}
                    </div>

                    <motion.button
                      onClick={handleOtpNext}
                      disabled={otp.join('').length !== 4}
                      className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all disabled:opacity-70"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue
                    </motion.button>

                    {/* Countdown & Resend */}
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
                      {countdown > 0 ? (
                        <p className="text-sm text-gray-500">
                          Resend in{' '}
                          <span className="font-bold text-[#FF8A00]">0:{countdown.toString().padStart(2, '0')}</span>
                        </p>
                      ) : (
                        <motion.button
                          onClick={handleResendOTP}
                          disabled={isSendingOtp}
                          className="text-[#FF8A00] hover:text-orange-700 font-bold text-sm transition-colors disabled:opacity-50"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ── Step 3: Reset Password ───────────────────────── */}
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
                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => { setNewPassword(e.target.value); if (resetError) setResetError(''); }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${resetError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
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

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); if (resetError) setResetError(''); }}
                          className={`w-full pl-10 pr-12 py-3.5 border ${resetError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] focus:border-[#FF8A00] outline-none transition-all`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {resetError && (
                        <p className="text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {resetError}
                        </p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isResetting}
                      className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                      whileHover={{ scale: isResetting ? 1 : 1.02 }}
                      whileTap={{ scale: isResetting ? 1 : 0.98 }}
                    >
                      {isResetting ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Resetting Password...
                        </span>
                      ) : 'Reset Password'}
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

export default InstructorForgotPasswordModal;
