import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

interface ForgotPasswordModalProps {
  onSendOtpSuccess: (mobile: string, userId?: number) => void;
  onClose: () => void;
}

const ForgotPasswordModal = ({ onSendOtpSuccess, onClose }: ForgotPasswordModalProps) => {
  const [mobile, setMobile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^01[3-9]\d{8}$/;
    return mobileRegex.test(mobile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!mobile) {
      setError('Please enter your mobile number');
      return;
    }

    if (!validateMobile(mobile)) {
      setError('Please enter a valid Bangladeshi mobile number (e.g., 01XXXXXXXXX)');
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 [Send OTP] Sending OTP to:', mobile);

      // ✅ সঠিক ফরম্যাটে ডাটা পাঠানো
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
        // Pass mobile and user_id (if available) to parent
        onSendOtpSuccess(mobile, response.data.user_id || undefined);
      } else {
        throw new Error(response.data?.message || 'Failed to send OTP');
      }
    } catch (err: any) {
      console.error('🔴 [Send OTP] Error:', err);

      const errorMessage = err.response?.data?.message ||
        err.message ||
        'Failed to send OTP. Please try again.';

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </div>
          <p className="text-gray-600">
            Enter your registered mobile number
          </p>
          <p className="text-sm text-gray-500">
            We'll send you an OTP to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number
            </label>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                if (error) setError(null);
              }}
              placeholder="01XXXXXXXXX"
              className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              Enter 11 digit Bangladeshi mobile number
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
              }`}
          >
            {isLoading ? (
              <>
                <span className="animate-spin">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </span>
                Sending OTP...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send OTP
              </>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordModal;