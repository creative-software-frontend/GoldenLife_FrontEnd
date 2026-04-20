import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../Logo';
import { useVendorOtp } from './hooks/useVendorOtp';
import OTPInput from './components/OTPInput';

type LoginMethod = 'mobile' | 'email';

const VendorLoginWithOTP: React.FC = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // --- Form States ---
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('mobile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ mobile: '', email: '', password: '' });
  const [errors, setErrors] = useState({ mobile: '', email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- OTP Modal States ---
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  // OTP Hook
  const { sendOtp, verifyOtp } = useVendorOtp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { mobile: '', email: '', password: '' };

    if (loginMethod === 'mobile') {
      if (!formData.mobile || !/^01\d{9}$/.test(formData.mobile)) {
        newErrors.mobile = 'Enter a valid mobile (01XXXXXXXXX)';
        isValid = false;
      }
    } else {
      if (!formData.email) {
        newErrors.email = 'Email required';
        isValid = false;
      }
      if (!formData.password) {
        newErrors.password = 'Password required';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  // --- 1. HANDLE LOGIN SUBMIT (Request OTP or Login via Email) ---
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    if (loginMethod === 'mobile') {
      try {
        // Send OTP using hook (query parameters)
        const response = await sendOtp(formData.mobile, 'mobile');

        if (response.success) {
          setUserId(response.user_id || null);
          setShowOtpModal(true);
          startCountdown();
        } else {
          throw new Error(response.message || "Failed to send OTP.");
        }
      } catch (err: any) {
        setApiError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // EMAIL LOGIN FLOW
      try {
        const response = await axios.post(`${baseURL}/api/vendor/login`, {
          email: formData.email,
          password: formData.password
        });

        if (response.data.token) {
          handleAuthSuccess(response.data.token);
        } else {
          throw new Error("No token received");
        }
      } catch (error: any) {
        setApiError(error.response?.data?.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- 2. VERIFY OTP (Using hook with query parameters) ---
  const handleOtpSubmit = async (otpCode: string) => {
    if (otpCode.length !== 4) {
      setOtpError("Enter 4-digit code.");
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');

    try {
      // Verify OTP using hook (query parameters: user_id & otp)
      const response = await verifyOtp(otpCode);

      if (response.success && response.token) {
        setShowOtpModal(false);
        handleAuthSuccess(response.token);
      } else {
        throw new Error("Verification successful but no token received.");
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || error.message || "Invalid OTP Code.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  // --- 3. RESEND OTP ---
  const handleResendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    setOtpError('');

    try {
      const response = await sendOtp(formData.mobile, 'mobile');

      if (response.success) {
        startCountdown();
        setOtpError('');
      } else {
        throw new Error(response.message || "Failed to resend OTP.");
      }
    } catch (err: any) {
      setOtpError(err.response?.data?.message || err.message || "Failed to resend OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Countdown Timer ---
  const startCountdown = () => {
    setCountdown(60);
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

  // --- Handle Auth Success ---
  const handleAuthSuccess = (token: string) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours

    sessionStorage.setItem('vendor_session', JSON.stringify({
      token: token,
      isVerified: true,
      expiry: expirationDate.getTime()
    }));

    document.cookie = `vendor_token=${token}; path=/; max-age=86400; SameSite=Strict; Secure`;

    navigate('/vendor/dashboard');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">
      <div className="mb-8 transform scale-125 md:scale-150 origin-bottom"><Logo /></div>

      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Login</h2>
          <p className="text-gray-500 text-sm mt-2">Access your vendor dashboard</p>
        </div>

        <div className="mx-8 mb-6 flex bg-gray-100 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setLoginMethod('mobile')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'mobile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            Mobile (OTP)
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'email' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'
              }`}
          >
            Email (Password)
          </button>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">
                {apiError}
              </div>
            )}

            {loginMethod === 'mobile' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                    } rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none transition-all`}
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                      } rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none`}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transform active:scale-95 transition-all disabled:opacity-70"
            >
              {isLoading ? "Processing..." : loginMethod === 'mobile' ? 'Login via OTP' : 'Login'}
            </button>

            <p className="text-center text-gray-600 pt-2">
              Don't have a vendor account? <Link to="/vendor/register" className="text-[#FF8A00] font-bold hover:underline">Apply Now</Link>
            </p>

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
              <Link
                to="/vendor/login"
                className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow"
              >
                <span>Use traditional login</span>
                <span className="text-[#FF8A00] font-bold">Click here</span>
                <svg
                  className="w-4 h-4 text-[#FF8A00] transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 relative">
            <button
              onClick={() => {
                setShowOtpModal(false);
                setOtpError('');
              }}
              className="absolute top-4 right-4 text-gray-400 p-2 hover:bg-gray-100 rounded-full"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 flex items-center justify-center rounded-full mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Verify Your Phone</h2>
              <p className="text-gray-500 mt-2 text-sm">
                Sent to <span className="font-bold text-gray-800">{formData.mobile}</span>
              </p>
            </div>

            {otpError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100 italic">
                {otpError}
              </div>
            )}

            <OTPInput
              length={4}
              onComplete={handleOtpSubmit}
              disabled={isOtpLoading}
              error={otpError}
            />

            <button
              onClick={(e) => {
                e.preventDefault();
                const otpInputs = document.querySelectorAll('input[maxlength="1"]');
                const otpCode = Array.from(otpInputs).map(input => (input as HTMLInputElement).value).join('');
                if (otpCode.length === 4) {
                  handleOtpSubmit(otpCode);
                }
              }}
              disabled={isOtpLoading}
              className="w-full bg-[#FF8A00] text-white font-bold text-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all mt-6 disabled:opacity-70"
            >
              {isOtpLoading ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Didn't receive the code? {' '}
              {countdown > 0 ? (
                <span className="text-gray-600">
                  Resend in <span className="font-bold text-[#FF8A00]">{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#FF8A00] font-bold hover:underline disabled:opacity-50"
                >
                  Resend
                </button>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorLoginWithOTP;
