import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Logo from '../Logo';
import RegistrationForm from './components/RegistrationForm';
import OtpVerificationModal from './components/OtpVerificationModal';

type RegistrationStep = 'form' | 'otp' | 'success';

const VendorRegisterWithOTP: React.FC = () => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  // State Management
  const [step, setStep] = useState<RegistrationStep>('form');
  const [userId, setUserId] = useState<number | null>(null);
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle Registration Submit
  const handleRegistrationSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        // Save user_id and mobile for OTP verification
        const newUserId = response.data.user_id;
        const mobileNumber = formData.get('mobile') as string;

        setUserId(newUserId);
        setMobile(mobileNumber);
        setStep('otp');
      } else {
        throw new Error(response.data?.message || 'Registration failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Verification
  const handleOtpVerification = async (userId: number, otpCode: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${baseURL}/api/vendor/verify-otp`,
        null, // No body!
        {
          params: {
            user_id: userId,
            otp: otpCode,
          },
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        setShowSuccess(true);
        setStep('success');

        // Auto-redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/vendor/login');
        }, 3000);
      } else {
        throw new Error(response.data?.message || 'OTP verification failed');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (!mobile || !userId) {
      throw new Error('Missing registration data');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Re-send OTP using the same registration endpoint
      const formData = new FormData();
      formData.append('name', ''); // Not needed for resend
      formData.append('mobile', mobile);
      formData.append('email', '');
      formData.append('password', '');
      formData.append('password_confirmation', '');

      const response = await axios.post(
        `${baseURL}/api/vendor/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to resend OTP');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend OTP';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Close Modal
  const handleCloseModal = () => {
    // Don't allow closing OTP modal easily
    // User must verify or wait
  };

  // Handle Success Close
  const handleSuccessClose = () => {
    navigate('/vendor/login');
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center mt-8 md:mt-12 mb-8 px-4">
      {/* Logo */}
      <div className="mb-8 transform scale-125 md:scale-150 origin-bottom">
        <Logo />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Vendor Registration</h2>
          <p className="text-gray-500 text-sm mt-2">Create your vendor account</p>
        </div>

        {/* Content */}
        <div className="px-8 pb-10">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="registration-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <RegistrationForm
                  onSubmit={handleRegistrationSubmit}
                  isLoading={isLoading}
                  error={error}
                />
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-6">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Registration Successful!
                </h3>
                <p className="text-gray-500 mb-6">
                  Your mobile number has been verified successfully.
                </p>
                <p className="text-sm text-gray-400">
                  Redirecting to login page...
                </p>
                <button
                  onClick={handleSuccessClose}
                  className="mt-6 bg-[#FF8A00] text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-all"
                >
                  Go to Login
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Login Link */}
          {step === 'form' && (
            <p className="text-center text-gray-600 pt-6 mt-8 border-t border-gray-100">
              Already have a vendor account?{' '}
              <Link
                to="/vendor/login"
                className="text-[#FF8A00] font-bold hover:underline"
              >
                Login here
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {step === 'otp' && userId && (
          <OtpVerificationModal
            mobile={mobile}
            userId={userId}
            onVerify={handleOtpVerification}
            onResend={handleResendOtp}
            isLoading={isLoading}
            error={error}
            onClose={handleCloseModal}
            onSuccess={() => { }} // Handled in handleOtpVerification
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VendorRegisterWithOTP;
