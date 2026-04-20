import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import Logo from '../Logo';
import MobileOTPTab from './components/MobileOTPTab';
import EmailPasswordTab from './components/EmailPasswordTab';
import InstructorForgotPasswordModal from './components/InstructorForgotPasswordModal';
import InstructorLoginRightSideContent from './components/InstructorLoginRightSideContent';
import {
  useInstructorLoginMutation,
  useSendLoginOtpMutation,
  useVerifyLoginOtpMutation,
} from '@/hooks/useInstructorAuth';

type ActiveTab = 'mobile' | 'email';

const InstructorLogin: React.FC = () => {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<ActiveTab>('mobile');

  // Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Store mobile for multi-step OTP (needed for verify step)
  const [loginMobile, setLoginMobile] = useState('');

  // ─── TanStack Query Mutations ─────────────────────────────────────────────
  const loginMutation = useInstructorLoginMutation();
  const sendOtpMutation = useSendLoginOtpMutation();
  const verifyOtpMutation = useVerifyLoginOtpMutation();

  // ─── Derived loading / error states for child components ─────────────────
  const isMobileLoading = sendOtpMutation.isPending || verifyOtpMutation.isPending;
  const mobileError = sendOtpMutation.error?.message || verifyOtpMutation.error?.message || null;

  const isEmailLoading = loginMutation.isPending;
  const emailError = loginMutation.error?.message || null;

  // ─── Handlers ────────────────────────────────────────────────────────────

  const handleSendOtp = async (mobile: string) => {
    setLoginMobile(mobile);
    sendOtpMutation.reset();
    verifyOtpMutation.reset();
    await sendOtpMutation.mutateAsync({ mobile });
    // On success, MobileOTPTab transitions to OTP input step
  };

  const handleVerifyOtp = async (otp: string) => {
    verifyOtpMutation.reset();
    const result = await verifyOtpMutation.mutateAsync({ mobile: loginMobile, otp });
    if (result.token) {
      toast.success('Login successful! Welcome back.');
      navigate('/instructor/dashboard');
    }
  };

  const handleEmailLogin = async (email: string, password: string) => {
    loginMutation.reset();
    const result = await loginMutation.mutateAsync({ email, password });
    if (result.token) {
      toast.success(`Welcome back, ${result.user?.name || 'Instructor'}!`);
      navigate('/instructor/dashboard');
    }
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    // Reset mutation states on tab switch
    loginMutation.reset();
    sendOtpMutation.reset();
    verifyOtpMutation.reset();
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row shadow-2xl overflow-hidden">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center bg-gray-50/50 p-4 lg:py-16 md:py-12 py-8 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-lg mx-auto flex flex-col items-center">
          {/* Navigation Bar */}
          <div className="w-full flex items-center justify-between mb-8">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors group"
            >
              <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Home</span>
            </Link>

            <div className="flex flex-col items-center transform scale-125 md:scale-150">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            <div className="w-24 hidden md:block"></div> {/* Spacer for symmetry */}
          </div>

          {/* Main Card */}
          <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Instructor Login</h2>
              <p className="text-gray-500 text-sm mt-2">Access your instructor dashboard</p>
            </div>

            {/* Tabs */}
            <div className="mx-8 mb-6 flex bg-gray-100 p-1.5 rounded-xl">
              <button
                type="button"
                onClick={() => handleTabChange('mobile')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'mobile'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Mobile (OTP)
              </button>
              <button
                type="button"
                onClick={() => handleTabChange('email')}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'email'
                  ? 'bg-black text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
                  }`}
              >
                Email (Password)
              </button>
            </div>

            {/* Tab Content */}
            <div className="px-8 pb-10">
              {activeTab === 'mobile' ? (
                <MobileOTPTab
                  onSendOtp={handleSendOtp}
                  onVerifyOtp={handleVerifyOtp}
                  isLoading={isMobileLoading}
                  error={mobileError}
                  onSuccess={() => { }}
                />
              ) : (
                <EmailPasswordTab
                  onLogin={handleEmailLogin}
                  isLoading={isEmailLoading}
                  error={emailError}
                  onForgotPassword={() => setShowForgotPassword(true)}
                />
              )}

              {/* Registration Link */}
              <p className="text-center text-gray-600 pt-6 mt-8 border-t border-gray-100">
                Don't have an instructor account?{' '}
                <Link
                  to="/instructor/register"
                  className="text-[#FF8A00] font-bold hover:underline"
                >
                  Apply Now
                </Link>
              </p>

              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center">
                <Link
                  to="/vendor/login"
                  className="group flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 shadow-sm hover:shadow"
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
              </div>
            </div>
          </div>

          {/* Forgot Password Modal */}
          <InstructorForgotPasswordModal
            isOpen={showForgotPassword}
            onClose={() => setShowForgotPassword(false)}
          />
        </div>
      </div>

      {/* Right Side: Visual Content */}
      <InstructorLoginRightSideContent />
    </div>
  );
};

export default InstructorLogin;
