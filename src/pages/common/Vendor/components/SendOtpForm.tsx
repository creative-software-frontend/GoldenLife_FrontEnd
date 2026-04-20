import React, { useState } from 'react';
import { Mail, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SendOtpFormProps {
  loginMethod: 'email' | 'mobile';
  onSendOtp: (credential: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const SendOtpForm: React.FC<SendOtpFormProps> = ({
  loginMethod,
  onSendOtp,
  isLoading,
  error,
}) => {
  const [credential, setCredential] = useState('');
  const [fieldError, setFieldError] = useState('');

  const validateCredential = (value: string): boolean => {
    if (!value.trim()) {
      setFieldError(loginMethod === 'email' ? 'Email is required' : 'Mobile number is required');
      return false;
    }

    if (loginMethod === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setFieldError('Please enter a valid email address');
        return false;
      }
    } else {
      const mobileRegex = /^01[3-9]\d{8}$/;
      if (!mobileRegex.test(value)) {
        setFieldError('Enter a valid 11-digit mobile number (e.g., 017XXXXXXXX)');
        return false;
      }
    }

    setFieldError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔵 [SendOtpForm] Form submitted');
    console.log('🔵 [SendOtpForm] Credential value:', credential);
    console.log('🔵 [SendOtpForm] Login method:', loginMethod);
    
    if (!validateCredential(credential)) {
      console.log('❌ [SendOtpForm] Validation failed');
      return;
    }

    console.log('✅ [SendOtpForm] Validation passed, calling onSendOtp...');

    try {
      await onSendOtp(credential);
      console.log('✅ [SendOtpForm] onSendOtp completed successfully');
    } catch (error) {
      console.error('❌ [SendOtpForm] onSendOtp error:', error);
      // Error is handled by parent component
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Clear errors when user types
    if (fieldError) setFieldError('');
    
    // Limit mobile to 11 digits
    if (loginMethod === 'mobile' && value.length > 11) {
      setCredential(value.slice(0, 11));
    } else {
      setCredential(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Input Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {loginMethod === 'email' ? 'Email Address' : 'Mobile Number'}
        </label>
        
        <div className="relative">
          {loginMethod === 'email' ? (
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          ) : (
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          
          <Input
            type={loginMethod === 'email' ? 'email' : 'tel'}
            placeholder={loginMethod === 'email' ? 'example@email.com' : '017XXXXXXXX'}
            value={credential}
            onChange={handleInputChange}
            className={`pl-10 pr-4 py-3 ${fieldError ? 'border-red-500 focus:ring-red-200' : ''}`}
            disabled={isLoading}
          />
        </div>

        {/* Field Error */}
        {fieldError && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {fieldError}
          </p>
        )}
      </div>

      {/* API Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Sending OTP...</span>
          </>
        ) : (
          <>
            <span>Send OTP</span>
          </>
        )}
      </button>

      {/* Info Text */}
      <p className="text-center text-sm text-gray-500 mt-4">
        We'll send you a verification code to this {loginMethod}
      </p>
    </form>
  );
};
