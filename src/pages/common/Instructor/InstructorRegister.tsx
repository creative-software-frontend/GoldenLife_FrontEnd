import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ArrowLeft,
  User, Phone, MapPin, Building2, CheckCircle2, Smartphone, X
} from "lucide-react";
import { toast } from "react-toastify";
import Logo from "../Logo";
import InstructorRegisterRightSideContent from "./components/InstructorRegisterRightSideContent";
import {
  useInstructorRegisterMutation,
  useVerifyRegisterOtpMutation,
  useSendLoginOtpMutation,
} from "@/hooks/useInstructorAuth";

const InstructorRegister = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP & Auth States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // 4-digit OTP
  const [userId, setUserId] = useState<number | null>(null);
  const [otpError, setOtpError] = useState("");
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Inline Field Errors State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    experience: "",
    address: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

  // ─── TanStack Query Mutations ─────────────────────────────────────────────
  const registerMutation = useInstructorRegisterMutation();
  const verifyOtpMutation = useVerifyRegisterOtpMutation();
  const resendOtpMutation = useSendLoginOtpMutation();

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Full name is required.";
    if (!formData.subject.trim()) newErrors.subject = "Subject/Expertise is required.";
    if (!formData.experience) newErrors.experience = "Please select your experience level.";
    if (!formData.address.trim()) newErrors.address = "Address is required.";

    const mobileRegex = /^01[3-9]\d{8}$/;
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 11-digit mobile number (e.g., 017XXXXXXXX).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = "You must accept the terms";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- SUBMIT REGISTRATION ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const data = await registerMutation.mutateAsync({
        name: formData.name,
        subject: formData.subject,
        experience: formData.experience,
        address: formData.address,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (data.user_id) {
        setUserId(data.user_id);
      }

      toast.success("Application submitted! Please verify your mobile.");
      setShowOtpModal(true);
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  // --- OTP HANDLERS ---
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = async () => {
    setOtpError("");
    try {
      await resendOtpMutation.mutateAsync({ mobile: formData.mobile });
      toast.success("OTP resent successfully!");
    } catch (error: any) {
      setOtpError(error.message || "Failed to resend OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Enter the complete 4-digit OTP.");
      return;
    }

    if (!userId) {
      setOtpError("User ID not found. Please register again.");
      return;
    }

    setOtpError("");

    try {
      await verifyOtpMutation.mutateAsync({ user_id: userId, otp: otpCode });
      toast.success("Account verified! Please login.");
      navigate("/instructor/login", {
        state: {
          message: "Account verified! Please login.",
          mobile: formData.mobile
        }
      });
    } catch (error: any) {
      setOtpError(error.message || "Invalid OTP. Please try again.");
    }
  };

  const experienceLevels = [
    "Beginner (0-2 years)", "Intermediate (2-5 years)", "Professional (5-10 years)", "Expert (10+ years)"
  ];

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full pl-10 pr-4 py-3.5 border rounded-xl outline-none transition-all shadow-sm ";
    return fieldErrors[fieldName]
      ? baseClass + "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50"
      : baseClass + "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
  };

  const isSubmitting = registerMutation.isPending;
  const isVerifying = verifyOtpMutation.isPending;
  const isResending = resendOtpMutation.isPending;

  return (
    <>
      <div className="h-screen flex flex-col lg:flex-row shadow-2xl overflow-hidden">
        {/* Left Side: Registration Form */}
        <div className="w-full lg:w-1/2 flex flex-col items-center bg-gray-50/50 p-4 lg:py-12 md:py-8 py-6 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            {/* Navigation Bar */}
            <div className="w-full flex items-center justify-between mb-10">
              <Link
                to="/"
                className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
              >
                <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>

              <div className="flex flex-col items-center transform scale-125 md:scale-150 ">
                <Link to="/">
                  <Logo />
                </Link>
              </div>

              <div className="w-24 hidden md:block"></div> {/* Spacer for symmetry */}
            </div>

            {/* REGISTRATION CARD */}
            <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
              <div className="px-8 pt-10 pb-6 text-center">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Instructor Registration</h2>
                <p className="text-gray-500 text-sm mt-2">Become a Golden Life Instructor and share your knowledge</p>
              </div>

              <div className="px-6 sm:px-10 pb-12">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  {registerMutation.isError && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium text-center">
                      {registerMutation.error?.message}
                    </div>
                  )}

                  {/* Row 1: Full Name & Subject */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.name ? 'text-red-400' : 'text-gray-400'}`} />
                        <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className={getInputClass('name')} />
                      </div>
                      {fieldErrors.name && <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">{fieldErrors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Subject / Expertise *</label>
                      <div className="relative">
                        <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.subject ? 'text-red-400' : 'text-gray-400'}`} />
                        <input type="text" name="subject" placeholder="e.g. Mathematics, Programming" value={formData.subject} onChange={handleChange} className={getInputClass('subject')} />
                      </div>
                      {fieldErrors.subject && <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">{fieldErrors.subject}</p>}
                    </div>
                  </div>

                  {/* Row 2: Experience & Mobile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Experience Level *</label>
                      <div className="relative">
                        <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.experience ? 'text-red-400' : 'text-gray-400'}`} />
                        <select name="experience" value={formData.experience} onChange={handleChange} className={`${getInputClass('experience')} appearance-none ${!formData.experience ? 'text-gray-500' : 'text-gray-900'}`}>
                          <option value="" disabled>Select experience level</option>
                          {experienceLevels.map(type => (
                            <option key={type} value={type} className="text-gray-900">{type}</option>
                          ))}
                        </select>
                      </div>
                      {fieldErrors.experience && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.experience}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Mobile Number *</label>
                      <div className="relative">
                        <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.mobile ? 'text-red-400' : 'text-gray-400'}`} />
                        <input type="tel" name="mobile" placeholder="017XXXXXXXX" value={formData.mobile} onChange={handleChange} className={getInputClass('mobile')} />
                      </div>
                      {fieldErrors.mobile && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.mobile}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                      <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                    </div>
                    {fieldErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.email}</p>}
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Address *</label>
                    <div className="relative">
                      <MapPin className={`absolute left-3 top-3 w-5 h-5 ${fieldErrors.address ? 'text-red-400' : 'text-gray-400'}`} />
                      <textarea name="address" rows={2} placeholder="Full Address" value={formData.address} onChange={handleChange} className={`${getInputClass('address')} resize-none`} />
                    </div>
                    {fieldErrors.address && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{fieldErrors.address}</p>}
                  </div>

                  {/* Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Password *</label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.password ? 'text-red-400' : 'text-gray-400'}`} />
                        <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} className={`${getInputClass('password')} pr-12`} />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none">
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {fieldErrors.password && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.password}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} />
                        <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} className={`${getInputClass('confirmPassword')} pr-12`} />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 outline-none">
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      {fieldErrors.confirmPassword && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.confirmPassword}</p>}
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="pt-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox" name="acceptTerms" id="acceptTerms"
                        checked={formData.acceptTerms} onChange={handleChange} disabled={isSubmitting}
                        className="h-5 w-5 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00] cursor-pointer"
                      />
                      <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer select-none">
                        I accept the <span className="text-[#FF8A00] font-medium hover:underline">Terms & Conditions</span>
                      </label>
                    </div>
                    {fieldErrors.acceptTerms && <p className="text-xs text-red-500 font-medium mt-1.5">{fieldErrors.acceptTerms}</p>}
                  </div>

                  {/* Submit */}
                  <div className="pt-4">
                    <button
                      type="submit" disabled={isSubmitting}
                      className="w-full bg-[#FF8A00] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Apply as Instructor <ArrowRight className="w-5 h-5" /></>}
                    </button>
                  </div>
                </form>

                <p className="text-center text-gray-600 mt-6">
                  Already have an instructor account? <Link to="/instructor/login" className="text-[#FF8A00] font-bold hover:underline transition-all">Sign In</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Content */}
        <InstructorRegisterRightSideContent />
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 sm:p-10 relative shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-2 text-center relative">
                <button onClick={() => setShowOtpModal(false)} className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Mobile</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Enter the 4-digit code sent to <br />
                  <span className="font-bold text-gray-800">{formData.mobile || "+8801XXXXXXXXX"}</span>
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="pt-6">
                {otpError && <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-xl text-center text-sm font-medium border border-red-100">{otpError}</div>}
                <div className="flex justify-center gap-3 sm:gap-4 mb-8">
                  {otp.map((data, index) => (
                    <input
                      key={index} type="text" maxLength={1}
                      ref={el => otpInputRefs.current[index] = el}
                      value={data}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      className="w-14 h-16 sm:w-16 text-center text-3xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF8A00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,138,0,0.1)] outline-none transition-all"
                      required autoFocus={index === 0}
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={isVerifying || otp.join("").length !== 4}
                  className="w-full bg-[#FF8A00] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg disabled:opacity-70"
                >
                  {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Verify & Proceed <CheckCircle2 className="w-5 h-5" /></>}
                </button>
                <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isVerifying || isResending}
                    className="text-[#FF8A00] hover:underline transition-colors font-medium disabled:opacity-50"
                  >
                    {isResending ? 'Sending...' : 'Resend OTP'}
                  </button>
                </p>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );

};

export default InstructorRegister;
