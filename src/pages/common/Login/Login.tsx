import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../Logo';

type LoginMethod = 'mobile' | 'email';

const Login: React.FC = () => {
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
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Mobile number validation: only digits, max 11 characters
    if (name === 'mobile') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 11);
      setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

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
      if (!formData.email) { newErrors.email = 'Email required'; isValid = false; }
      if (!formData.password) { newErrors.password = 'Password required'; isValid = false; }
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
        // REAL API CALL: SEND OTP
        const response = await axios.post(`${baseURL}/api/login/send-otp`, {
          mobile: formData.mobile
        });

        if (response.status === 200 || response.data.success) {
          setShowOtpModal(true);
        } else {
          throw new Error(response.data.message || "Failed to send OTP.");
        }
      } catch (err: any) {
        setApiError(err.response?.data?.message || "Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    } else {
      // EMAIL LOGIN FLOW
      try {
        const response = await axios.post(`${baseURL}/api/student/login`, {
          email: formData.email,
          password: formData.password
        });
        handleAuthSuccess(response.data.token || response.data.data?.token);
      } catch (error: any) {
        setApiError(error.response?.data?.message || 'Invalid email or password.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- 2. VERIFY OTP (REAL API INTEGRATION) ---
  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Enter 4-digit code.");
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');

    try {
      // API call with query parameters: /api/login/verify-otp?mobile=...&otp=...
      const response = await axios.post(`${baseURL}/api/login/verify-otp`, null, {
        params: {
          mobile: formData.mobile,
          otp: otpCode
        }
      });

      const token = response.data.token || response.data.data?.token;

      if (token) {
        setOtp(["", "", "", ""]);
        setShowOtpModal(false);
        handleAuthSuccess(token);
      } else {
        throw new Error("Verification successful but no token received.");
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.message || "Invalid OTP Code.");
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleAuthSuccess = (token: string) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (1 * 24 * 60 * 60 * 1000));

    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
    sessionStorage.setItem('student_session', JSON.stringify({
      token: token,
      expiry: expirationDate.getTime()
    }));

    navigate('/dashboard');
  };

  // --- OTP Input Helpers ---
  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "").substring(0, 1);
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    if (cleanValue && index < 3) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpInputRefs.current[index - 1]?.focus();
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">
      <div className="mb-8 transform scale-125 md:scale-150 origin-bottom"><Logo /></div>

      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">Log in to your Golden Life account</p>
        </div>

        <div className="mx-8 mb-6 flex bg-gray-100 p-1.5 rounded-xl">
          <button type="button" onClick={() => setLoginMethod('mobile')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'mobile' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>Mobile (OTP)</button>
          <button type="button" onClick={() => setLoginMethod('email')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${loginMethod === 'email' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}>Email (Password)</button>
        </div>

        <div className="px-8 pb-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            {apiError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100 text-center">{apiError}</div>}

            {loginMethod === 'mobile' ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input
                  name="mobile"
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={11}
                  pattern="[0-9]{11}"
                  title="Please enter 11 digit mobile number"
                  className={`w-full px-4 py-3.5 border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none transition-all`}
                />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                {formData.mobile && formData.mobile.length !== 11 && formData.mobile.length > 0 && (
                  <p className="text-red-500 text-xs mt-1">Mobile number must be 11 digits</p>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input name="email" type="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} className={`w-full px-4 py-3.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none`} />
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
                      className={`w-full px-4 py-3.5 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl focus:ring-2 focus:ring-[#FF8A00] outline-none`}
                    />
                    {formData.password.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full bg-[#FF8A00] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-orange-600 shadow-lg transform active:scale-95 transition-all">
              {isLoading ? "Processing..." : loginMethod === 'mobile' ? 'Login via OTP' : 'Login'}
            </button>

            {/* Forgot Password Link */}
            <div className="text-center pt-2">
              <Link to="/forgot-password" className="text-sm text-gray-600 hover:text-[#FF8A00] font-medium transition-colors">
                Forgot Password?
              </Link>
            </div>

            <p className="text-center text-gray-600 pt-2">
              Don't have an account? <Link to="/register" className="text-[#FF8A00] font-bold hover:underline">Register</Link>
            </p>

            {/* --- NEW VENDOR AND INSTRUCTOR LOGIN LINKS --- */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/vendor/login"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow w-full sm:w-auto"
              >
                <span>Are you a vendor?</span>
                <span className="text-[#FF8A00] font-bold">Login here</span>
                <svg
                  className="w-4 h-4 text-[#FF8A00] transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              
              <Link
                to="/instructor/login"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow w-full sm:w-auto"
              >
                <span>Are you an instructor?</span>
                <span className="text-indigo-600 font-bold">Login here</span>
                <svg
                  className="w-4 h-4 text-indigo-600 transform group-hover:translate-x-1 transition-transform duration-300"
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
            <button onClick={() => setShowOtpModal(false)} className="absolute top-4 right-4 text-gray-400 p-2"><X size={20} /></button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-gray-900">Verify Your Phone</h2>
              <p className="text-gray-500 mt-2 text-sm">Sent to <span className="font-bold text-gray-800">{formData.mobile}</span></p>
            </div>

            {otpError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100 italic">{otpError}</div>}

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((data, index) => (
                <input
                  key={index} type="text" maxLength={1}
                  ref={el => otpInputRefs.current[index] = el}
                  value={data} onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF8A00] outline-none transition-all"
                />
              ))}
            </div>

            <button onClick={handleOtpSubmit} disabled={isOtpLoading} className="w-full bg-[#FF8A00] text-white font-bold text-lg py-4 rounded-xl shadow-lg active:scale-95 transition-all">
              {isOtpLoading ? "Verifying..." : "Verify & Continue"}
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Didn't receive the code? <button type="button" onClick={() => handleSubmit()} className="text-[#FF8A00] font-bold hover:underline">Resend</button>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default Login;