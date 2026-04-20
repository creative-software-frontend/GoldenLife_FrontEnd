// src/components/vendor/RegisterForm.tsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Store, Loader2, ArrowLeft,
  User, Phone, MapPin, Building2, AlertCircle, CheckCircle2, Smartphone, X
} from "lucide-react";
import Logo from "../Logo";

// Scroll Animation Variants
const scrollVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const RegisterForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // OTP & Auth States
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]); // 4-digit OTP
  const [isVerifying, setIsVerifying] = useState(false);
  const [apiToken, setApiToken] = useState(""); // <-- State to hold the API token
  const [otpError, setOtpError] = useState("");
  const [userId, setUserId] = useState<number | null>(null); // Store user_id from registration
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // API Feedback States
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Added for Toast

  // Inline Field Errors State
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: "",
    shopName: "",
    businessType: "",
    address: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false
  });

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
    if (errorMessage) setErrorMessage("");
  };

  // --- VALIDATION LOGIC ---
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Owner name is required.";
    if (!formData.shopName.trim()) newErrors.shopName = "Shop name is required.";
    if (!formData.businessType) newErrors.businessType = "Please select a business type.";
    if (!formData.address.trim()) newErrors.address = "Business address is required.";

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

    setIsLoading(true);
    setErrorMessage("");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.goldenlifeltd.com";
      const endpoint = `${baseUrl}/api/vendor/register`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          shop_name: formData.shopName,
          business_type: formData.businessType,
          address: formData.address,
          mobile: formData.mobile,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (response.status === 403 || response.status === 429) {
        throw new Error("Too many attempts. Your IP is temporarily blocked.");
      }

      if (!response.ok) {
        if (data.errors) {
          const firstErrorKey = Object.keys(data.errors)[0];
          throw new Error(data.errors[firstErrorKey][0]);
        }
        throw new Error(data.message || "Failed to register. Please try again.");
      }

      // Capture the token if the backend returns it immediately upon registration
      if (data.token) {
        setApiToken(data.token);
      }

      // Capture user_id if returned (needed for OTP verification)
      if (data.user_id) {
        setUserId(data.user_id);
        console.log('✅ [Register] User ID captured:', data.user_id);
      }

      setSuccessMessage("Account created successfully! OTP sent.");


      // Show the OTP modal!
      setShowOtpModal(true);

    } catch (error: any) {
      console.error("Registration Error:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
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

  // --- RESEND OTP ---
  const handleResendOtp = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.goldenlifeltd.com";
      const endpoint = `${baseUrl}/api/vendor/register/send-otp?mobile=${encodeURIComponent(formData.mobile)}`;

      console.log('🔵 [Register] Resending OTP to:', formData.mobile);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        }
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage("OTP resent successfully!");

        console.log('✅ [Register] OTP resent successfully');
      } else {
        setOtpError(data.message || "Failed to resend OTP");
      }
    } catch (error: any) {
      console.error('❌ [Register] Failed to resend OTP:', error);
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  // --- VERIFY OTP & SAVE TO SESSION STORAGE ---
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      setOtpError("Enter the complete 4-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const baseUrl = import.meta.env.VITE_API_URL || "https://admin.goldenlifeltd.com";

      // Use user_id from state (captured during registration)
      if (!userId) {
        throw new Error("User ID not found. Please register again.");
      }

      const endpoint = `${baseUrl}/api/vendor/verify-otp`;
      const queryParams = `?user_id=${userId}&otp=${encodeURIComponent(otpCode)}`;

      console.log('🔵 [Register] Verifying OTP:', { userId, otp: otpCode });
      console.log('📍 [Register] Endpoint:', endpoint + queryParams);

      const response = await fetch(endpoint + queryParams, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        }
      });

      const data = await response.json();
      console.log('📥 [Register] Verification Response:', data);

      if (!response.ok) {
        throw new Error(data.message || "Invalid OTP. Please try again.");
      }

      if (data.success) {
        setSuccessMessage("Account verified successfully! ");

        // DO NOT auto-login - redirect to login page
        navigate("/vendor/dashboard", {
          state: {
            message: "Account verified! ",
            mobile: formData.mobile
          }
        });
      } else {
        throw new Error(data.message || "Verification failed");
      }
    } catch (error: any) {
      console.error('❌ [Register] Verification Error:', error);
      setOtpError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const businessTypes = [
    "Electronics", "Fashion", "Home & Living",
    "Food & Beverage", "Health & Beauty", "Other"
  ];

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full pl-10 pr-4 py-3.5 border rounded-xl outline-none transition-all shadow-sm ";
    return fieldErrors[fieldName]
      ? baseClass + "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50/50"
      : baseClass + "border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200";
  };

  return (
    <>
      {/* --- SUCCESS TOAST OVERLAY --- */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 24, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-0 left-1/2 z-[200] flex items-center gap-3 bg-gray-900 text-white px-6 py-3.5 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="font-medium text-sm tracking-wide">{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen w-full bg-gray-50/50 py-10 px-4 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">

          {/* LOGO SECTION */}
          <div className="mb-10 transform scale-150">
            <Link to="/">
              <Logo />
            </Link>
          </div>

          {/* REGISTRATION CARD */}
          <div className="w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="px-8 pt-10 pb-6 text-center">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Create Vendor Account</h2>
              <p className="text-gray-500 text-sm mt-2">Join Golden Life and start selling today</p>
            </div>

            <div className="px-6 sm:px-10 pb-12">
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {errorMessage && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-medium text-center">
                    {errorMessage}
                  </div>
                )}

                {/* Row 1: Owner Name & Shop Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Owner Name *</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.name ? 'text-red-400' : 'text-gray-400'}`} />
                      <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} className={getInputClass('name')} />
                    </div>
                    {fieldErrors.name && <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">{fieldErrors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Shop / Business Name *</label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.shopName ? 'text-red-400' : 'text-gray-400'}`} />
                      <input type="text" name="shopName" placeholder="My Awesome Store" value={formData.shopName} onChange={handleChange} className={getInputClass('shopName')} />
                    </div>
                    {fieldErrors.shopName && <p className="text-xs text-red-500 font-medium mt-1.5 ml-1">{fieldErrors.shopName}</p>}
                  </div>
                </div>

                {/* Row 2: Business Type & Mobile Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Business Type *</label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.businessType ? 'text-red-400' : 'text-gray-400'}`} />
                      <select name="businessType" value={formData.businessType} onChange={handleChange} className={`${getInputClass('businessType')} appearance-none ${!formData.businessType ? 'text-gray-500' : 'text-gray-900'}`}>
                        <option value="" disabled>Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type} className="text-gray-900">{type}</option>
                        ))}
                      </select>
                    </div>
                    {fieldErrors.businessType && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.businessType}</p>}
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

                {/* Full Width: Email Address */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${fieldErrors.email ? 'text-red-400' : 'text-gray-400'}`} />
                    <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} className={getInputClass('email')} />
                  </div>
                  {fieldErrors.email && <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.email}</p>}
                </div>

                {/* Full Width: Address */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">Business Address *</label>
                  <div className="relative">
                    <MapPin className={`absolute left-3 top-3 w-5 h-5 ${fieldErrors.address ? 'text-red-400' : 'text-gray-400'}`} />
                    <textarea name="address" rows={2} placeholder="Street, City, State, ZIP" value={formData.address} onChange={handleChange} className={`${getInputClass('address')} resize-none`} />
                  </div>
                  {fieldErrors.address && <p className="text-red-500 text-xs font-medium mt-1 ml-1">{fieldErrors.address}</p>}
                </div>

                {/* Row 3: Passwords */}
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
                    {fieldErrors.confirmPassword ? (
                      <p className="text-red-500 text-xs font-medium mt-1.5 ml-1">{fieldErrors.confirmPassword}</p>
                    ) : (
                      formData.password && formData.confirmPassword && (
                        <p className={`text-xs font-medium mt-2 ml-1 ${formData.password === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                          {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                      )
                    )}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox" name="acceptTerms" id="acceptTerms"
                      checked={formData.acceptTerms} onChange={handleChange} disabled={isLoading}
                      className="h-5 w-5 text-[#FF8A00] border-gray-300 rounded focus:ring-[#FF8A00] cursor-pointer"
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer select-none">
                      I accept the <span className="text-[#FF8A00] font-medium hover:underline">Terms & Conditions</span>
                    </label>
                  </div>
                  {fieldErrors.acceptTerms && <p className="text-xs text-red-500 font-medium mt-1.5">{fieldErrors.acceptTerms}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-[#FF8A00] text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/30 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Register Account <ArrowRight className="w-5 h-5" /></>}
                  </button>
                </div>
              </form>

              <p className="text-center text-gray-600 mt-6">
                Already have a vendor account? <Link to="/vendor/login" className="text-[#FF8A00] font-bold hover:underline transition-all">Sign In</Link>
              </p>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <Link
                  to="/instructor/register"
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow"
                >
                  <span>Are you an instructor ?</span>
                  <span className="text-[#FF8A00] font-bold">instructor here</span>
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
            </div>
          </div>
        </div>
      </div>

      {/* --- OTP MODAL OVERLAY --- */}
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
                      className="w-14 h-16 sm:w-16 sm:h-18 text-center text-3xl font-black bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#FF8A00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,138,0,0.1)] outline-none transition-all"
                      required autoFocus={index === 0}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || otp.join("").length !== 4}
                  className="w-full bg-[#FF8A00] text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-[0.98] flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:active:scale-100"
                >
                  {isVerifying ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Verify & Proceed <CheckCircle2 className="w-5 h-5" /></>}
                </button>

                <p className="text-center text-sm text-gray-500 mt-6 font-medium">
                  Didn't receive the code?{' '}
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isVerifying}
                    className="text-[#FF8A00] hover:underline hover:text-orange-700 transition-colors font-medium disabled:opacity-50"
                  >
                    Resend OTP
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

export default RegisterForm;