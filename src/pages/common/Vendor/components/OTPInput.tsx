import React, { useState, useRef, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: string;
}

/**
 * Reusable OTP Input Component
 * Features:
 * - Auto-focus next input on type
 * - Backspace navigates to previous
 * - Paste support (fills all inputs)
 * - Auto-submits when complete
 * - Only accepts numbers
 */
const OTPInput: React.FC<OTPInputProps> = ({ 
  length = 4, 
  onComplete, 
  disabled = false,
  error 
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    const cleanValue = value.replace(/[^0-9]/g, '').substring(0, 1);
    
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all digits are filled
    if (newOtp.every(digit => digit !== '') && newOtp.length === length) {
      const otpCode = newOtp.join('');
      onComplete(otpCode);
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').substring(0, length);
    
    if (pastedData.length === length) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      
      // Focus last input
      inputRefs.current[length - 1]?.focus();
      
      // Trigger completion
      onComplete(pastedData);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={index === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`w-14 h-16 text-center text-2xl font-bold bg-gray-50 border-2 rounded-xl focus:outline-none transition-all disabled:opacity-50 ${
              error 
                ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' 
                : 'border-gray-200 focus:border-[#FF8A00] focus:bg-white focus:ring-4 focus:ring-orange-100'
            }`}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 text-center flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default OTPInput;
