import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  duration?: number;
  onComplete: () => void;
  onResend: () => void;
  isLoading?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 60,
  onComplete,
  onResend,
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-center mt-6">
      <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
      
      <AnimatePresence mode="wait">
        {timeLeft > 0 ? (
          <motion.p
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500"
          >
            Resend available in{' '}
            <span className="font-bold text-[#FF8A00]">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </span>
          </motion.p>
        ) : (
          <motion.button
            key="resend"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={onResend}
            disabled={isLoading}
            className="inline-flex items-center gap-2 text-[#FF8A00] hover:text-orange-700 font-bold text-sm transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg 
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            Resend OTP
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountdownTimer;
