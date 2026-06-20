import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CountdownTimerProps {
  duration?: number;
  onComplete?: () => void;
  onResend: () => void;
  isLoading?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration = 5,
  onComplete,
  onResend,
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const handleResend = () => {
    if (isLoading) return;
    onResend();
    setTimeLeft(duration);
  };

  return (
    <div className="text-center my-4 flex justify-center items-center min-h-[24px]">
      <AnimatePresence mode="wait">
        {timeLeft > 0 ? (
          <motion.p
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-gray-500 font-medium"
          >
            Resend code in {timeLeft}s
          </motion.p>
        ) : (
          <motion.button
            key="resend"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleResend}
            disabled={isLoading}
            className="text-[#FF8A00] hover:text-orange-600 font-bold text-sm transition-all hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? 'Sending...' : 'Resend OTP'}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CountdownTimer;
