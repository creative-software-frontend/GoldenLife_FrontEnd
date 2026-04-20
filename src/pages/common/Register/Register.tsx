import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Smartphone, Mail, User, Lock, TicketCheck, ShieldCheck, Loader2, AlertCircle, RefreshCcw, X } from 'lucide-react';
import Logo from '../Logo';
import { cn } from "@/lib/utils";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref') || '';
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Registration States
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  // OTP Modal States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isResent, setIsResent] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    refer_code: refCode,
    password: '',
    password_confirmation: '',
    acceptTerms: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let finalValue = value;

    // Limit mobile number to 11 digits and only allow numbers
    if (name === 'mobile') {
      finalValue = value.replace(/\D/g, '').slice(0, 11);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : finalValue
    }));

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) { newErrors.name = 'Full name is required'; isValid = false; }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) { newErrors.email = 'Valid email is required'; isValid = false; }
    if (!formData.mobile || !/^01\d{9}$/.test(formData.mobile)) { newErrors.mobile = 'Enter valid 11-digit mobile (01XXXXXXXXX)'; isValid = false; }
    if (!formData.refer_code.trim()) { newErrors.refer_code = 'Referral code is required'; isValid = false; }
    if (formData.password.length < 8) { newErrors.password = 'Password must be at least 8 characters'; isValid = false; }
    if (formData.password !== formData.password_confirmation) { newErrors.password_confirmation = 'Passwords must match'; isValid = false; }
    if (!formData.acceptTerms) { newErrors.acceptTerms = 'You must accept the terms'; isValid = false; }
    setErrors(newErrors);
    return isValid;
  };

  // 1. Register API Call
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const response = await fetch(`${baseURL}/api/student/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email,
          mobile: formData.mobile,
          refer_code: formData.refer_code,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const firstError = Object.values(data.errors)[0] as string[];
          throw new Error(firstError[0]);
        }
        throw new Error(data.message || 'Registration failed.');
      }

      // Store User ID for OTP step
      if (data.user_id) {
        setUserId(data.user_id);
      } else if (data.data?.user_id) {
        setUserId(data.data.user_id);
      }

      setOtp(["", "", "", ""]); // Reset OTP inputs
      setShowOtpModal(true);
      setResendTimer(5);
    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify OTP API Call
  // 2. Verify OTP API Call
  const handleOtpSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Enter 4-digit code.");
      return;
    }

    setIsOtpLoading(true);
    setOtpError('');

    try {
      let response;
      if (isResent) {
        response = await fetch(`${baseURL}/api/login/verify-otp?mobile=${formData.mobile}&otp=${otpCode}`, {
          method: 'POST',
          headers: { 'Accept': 'application/json' }
        });
      } else {
        response = await fetch(`${baseURL}/api/student/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            user_id: userId,
            otp: otpCode
          }),
        });
      }

      const data = await response.json();
      console.log("OTP API Response:", data); // Add this line!

      if (response.ok) {
        // --- ADD THIS BLOCK ---
        // Save the authentication token so the dashboard knows you are logged in.
        // Make sure 'data.token' matches whatever your API actually returns (e.g., data.data.token, data.access_token)
        const token = data.token || data.data?.token;
        const user = data.user || data.data?.user;
        const student = data.student || data.data?.student;

        if (token) {
          setOtp(["", "", "", ""]);
          setShowOtpModal(false);
          handleAuthSuccess(token, user, student);
        } else {
          throw new Error("Verification successful but no token received.");
        }
        // ----------------------


      } else {
        throw new Error(data.message || "Invalid OTP Code.");
      }
    } catch (error: any) {
      setOtpError(error.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setOtpError('');
    try {
      const response = await fetch(`${baseURL}/api/login/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mobile: formData.mobile
        }),
      });

      const data = await response.json();
      
      if (response.ok || data.success) {
        setOtp(["", "", "", ""]);
        setResendTimer(5);
        setIsResent(true);
      } else {
        throw new Error(data.message || "Failed to resend OTP.");
      }
    } catch (error: any) {
      setOtpError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^0-9]/g, "").substring(0, 1);
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);
    if (cleanValue && index < 3) otpInputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };
  const handleAuthSuccess = (token: string, user?: any, student?: any) => {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + (1 * 24 * 60 * 60 * 1000));

    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; secure; samesite=strict`;
    sessionStorage.setItem('student_session', JSON.stringify({
      token: token,
      user: user,
      student: student,
      expiry: expirationDate.getTime()
    }));

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 transition-transform hover:scale-105"><Logo /></div>

      <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden">
        <div className="p-8 md:p-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 font-medium mt-2">Join Golden Life to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                <AlertCircle size={18} /> {apiError}
              </div>
            )}

            <InputGroup label="Full Name" name="name" value={formData.name} error={errors.name} icon={<User size={18} />} onChange={handleChange} placeholder="John Doe" disabled={isLoading} required />

            <InputGroup label="Email Address" name="email" type="email" value={formData.email} error={errors.email} icon={<Mail size={18} />} onChange={handleChange} placeholder="john@example.com" disabled={isLoading} required />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Mobile Number" name="mobile" type="tel" value={formData.mobile} error={errors.mobile} icon={<Smartphone size={18} />} onChange={handleChange} placeholder="017XXXXXXXX" disabled={isLoading} required maxLength={11} />
              <InputGroup label="Referral Code" name="refer_code" value={formData.refer_code} error={errors.refer_code} icon={<TicketCheck size={18} />} onChange={handleChange} placeholder="Enter code here" disabled={isLoading} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <InputGroup label="Password" name="password" type={showPassword ? 'text' : 'password'} value={formData.password} error={errors.password} icon={<Lock size={18} />} onChange={handleChange} placeholder="••••••••" disabled={isLoading} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <InputGroup label="Confirm Password" name="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={formData.password_confirmation} error={errors.password_confirmation} icon={<Lock size={18} />} onChange={handleChange} placeholder="••••••••" disabled={isLoading} required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[42px] text-slate-400 hover:text-slate-600 transition-colors">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                <span className="text-sm text-slate-600 font-medium">I accept the Terms & Conditions</span>
              </label>
              {errors.acceptTerms && <p className="text-xs text-red-500 font-bold ml-8">{errors.acceptTerms}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-[#FF8A00] hover:bg-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
              {isLoading ? "Creating Account..." : "Register Now"}
            </button>

            <p className="text-center text-slate-500 font-medium pb-2">
              Already a member? <Link to="/login" className="text-orange-500 font-bold hover:underline">Login here</Link>
            </p>

            {/* --- NEW VENDOR AND INSTRUCTOR REGISTER LINKS --- */}
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/vendor/register"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-200 rounded-2xl text-sm font-bold text-slate-600 transition-all duration-300 w-full sm:w-auto shadow-sm"
              >
                <span>Become a Vendor?</span>
                <span className="text-orange-500">Register</span>
              </Link>
              
              <Link
                to="/instructor/register"
                className="group flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-2xl text-sm font-bold text-slate-600 transition-all duration-300 w-full sm:w-auto shadow-sm"
              >
                <span>Become an Instructor?</span>
                <span className="text-indigo-600">Register</span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* REAL OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-10 relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowOtpModal(false)} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-50 p-2 rounded-full transition-all">
              <X size={20} />
            </button>

            <div className="text-center space-y-2 mb-8">
              <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100 shadow-inner">
                <ShieldCheck className="text-orange-500 w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">Verify OTP</h2>
              <p className="text-slate-500 font-medium text-sm px-4">Code sent to <span className="text-slate-900 font-bold">{formData.mobile}</span></p>
            </div>

            {otpError && <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-center text-xs font-bold border border-red-100 italic">{otpError}</div>}

            <div className="flex justify-center gap-3 mb-10">
              {otp.map((digit, index) => (
                <input
                  key={index} type="text" maxLength={1}
                  ref={el => otpInputRefs.current[index] = el}
                  value={digit} onChange={e => handleOtpChange(index, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(index, e)}
                  className="w-14 h-16 text-center text-2xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-orange-500 outline-none transition-all"
                />
              ))}
            </div>

            <div className="space-y-4">
              <button onClick={handleOtpSubmit} disabled={isOtpLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                {isOtpLoading ? <Loader2 className="animate-spin" /> : "Verify & Continue"}
              </button>

              <button
                onClick={handleResendOtp}
                disabled={isLoading || resendTimer > 0}
                className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-orange-500 font-bold text-xs py-2 transition-colors disabled:opacity-50 disabled:hover:text-slate-400 disabled:cursor-not-allowed"
              >
                <RefreshCcw size={14} className={isLoading ? "animate-spin" : ""} /> 
                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputGroup = ({ label, icon, error, required, ...props }: any) => (
  <div className="space-y-1.5 flex-1">
    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative group">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors">{icon}</span>
      <input {...props} required={required} className={cn("w-full pl-11 pr-4 py-3.5 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-semibold text-slate-700", error ? "border-red-200 bg-red-50 focus:border-red-500" : "border-transparent focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5")} />
    </div>
    {error && <p className="text-[10px] text-red-500 font-bold ml-1">{error}</p>}
  </div>
);

export default Register;