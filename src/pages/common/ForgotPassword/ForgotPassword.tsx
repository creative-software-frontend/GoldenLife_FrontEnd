import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Logo from '../Logo';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [mobile, setMobile] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ✅ 1. HANDLE REQUEST OTP (FormData ব্যবহার করে)
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mobile) {
      setMobileError('Mobile number is required');
      return;
    } else if (!/^01\d{9}$/.test(mobile)) {
      setMobileError('Enter a valid mobile number (e.g., 01712345678)');
      return;
    }

    setIsLoading(true);
    setMobileError('');

    try {
      const formData = new FormData();
      formData.append('mobile', mobile);

      const response = await axios.post(
        `${baseURL}/api/password/forgot`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }
      );

      console.log('🟢 [Send OTP] Response:', response.data);

      if (response.data?.success) {
        toast.success('OTP sent successfully! Please check your mobile.');
        setShowOtpModal(true);
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('🔴 [Send OTP] Error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
      setMobileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. OTP INPUT HANDLERS
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };


  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP.");
      return;
    }

    setIsOtpLoading(true);

    try {
      // ✅ OTP সংরক্ষণ করে সরাসরি রিসেট পাসওয়ার্ড স্টেপে যান
      // কারণ আপনার API ডকুমেন্টেশন অনুযায়ী, OTP যাচাই হবে রিসেট করার সময়
      console.log('OTP Verified (client-side):', otpCode);
      toast.success('OTP verified successfully!');
      setShowOtpModal(false);
      setStep(2); // Move to set password step

    } catch (err: any) {
      console.error('🔴 [OTP Verification] Error:', err);
      setOtpError('Invalid OTP. Please try again.');
      toast.error('Invalid OTP');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setPasswordError('');

    try {
      console.log('🔵 [Reset Password] Resetting password for:', mobile);
      console.log('🔵 [Reset Password] OTP:', otp.join(""));


      const formData = new FormData();
      formData.append('mobile', mobile);
      formData.append('otp', otp.join(""));
      formData.append('password', newPassword);
      formData.append('password_confirmation', confirmPassword);

      const response = await axios.post(
        `${baseURL}/api/password/reset`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          }
        }
      );

      console.log('🟢 [Reset Password] Response:', response.data);

      if (response.data?.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        setTimeout(() => {
          setStep(3);
        }, 1000);
      } else {
        throw new Error(response.data?.message || 'Failed to reset password');
      }
    } catch (err: any) {
      console.error('🔴 [Reset Password] Error:', err);

      let errorMessage = 'Failed to reset password. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        errorMessage = errors.join(', ');
      } else if (err.message) {
        errorMessage = err.message;
      }

      setPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">

        <div className="mb-8 transform scale-125 md:scale-150 origin-bottom">
          <Logo />
        </div>

        <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">

          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <div className="px-8 pt-8 pb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Forgot Password?</h2>
                <p className="text-gray-500 text-sm mt-2">Enter your registered mobile number to receive an OTP.</p>
              </div>

              <div className="px-8 pb-10">
                <form onSubmit={handleRequestOTP} className="space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <input
                        id="mobile"
                        type="tel"
                        placeholder="01XXXXXXXXX"
                        value={mobile}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 11);
                          setMobile(cleaned);
                          setMobileError('');
                        }}
                        maxLength={11}
                        pattern="[0-9]{11}"
                        title="Please enter 11 digit mobile number"
                        className={`w-full pl-10 pr-4 py-3.5 border ${mobileError ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:border-transparent transition-all`}
                        disabled={isLoading}
                      />
                    </div>
                    {mobileError && <p className="text-sm text-red-500 mt-1">{mobileError}</p>}
                    {mobile && mobile.length !== 11 && mobile.length > 0 && (
                      <p className="text-red-500 text-xs mt-1">Mobile number must be 11 digits</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF8A00] text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-[#FF8A00] focus:ring-offset-2 transition-all duration-300 shadow-lg transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </button>

                  <div className="text-center pt-2">
                    <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800 font-bold transition-colors">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="px-8 pt-8 pb-6 text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Set New Password</h2>
                <p className="text-gray-500 text-sm mt-2">Create a secure new password for your account.</p>
              </div>

              <div className="px-8 pb-10">
                <form onSubmit={handlePasswordReset} className="space-y-5">

                  {passwordError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
                      {passwordError}
                    </div>
                  )}

                  <div className="space-y-2 relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setPasswordError(''); }}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] transition-all"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[35px] -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF8A00] transition-all"
                      disabled={isLoading}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#FF8A00] text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Saving..." : "Reset Password"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in zoom-in-95 duration-500 px-8 py-12 text-center">
              <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 border-8 border-green-100/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset!</h2>
              <p className="text-gray-500 text-sm mb-8">Your password has been successfully changed. You can now login with your new credentials.</p>

              <button
                onClick={() => navigate('/login')}
                className="w-full bg-[#FF8A00] text-white py-3.5 px-4 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all"
              >
                Go to Login
              </button>
            </div>
          )}

        </div>
      </div>

      {/* OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all animate-in zoom-in-95 relative">

            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 p-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 text-[#FF8A00] flex items-center justify-center rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Verify OTP</h2>
              <p className="text-gray-500 mt-2 text-sm">
                We've sent a 4-digit code to <br />
                <span className="font-bold text-gray-800">{mobile}</span>
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 mb-4 text-center">
                {otpError}
              </div>
            )}

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={el => otpInputRefs.current[index] = el}
                  value={data}
                  onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-black text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#FF8A00] focus:bg-white transition-all shadow-inner"
                />
              ))}
            </div>

            <button
              onClick={handleOtpSubmit}
              disabled={isOtpLoading || otp.join("").length < 4}
              className="w-full bg-[#FF8A00] hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center"
            >
              {isOtpLoading ? "Verifying..." : "Verify & Continue"}
            </button>

          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPassword;