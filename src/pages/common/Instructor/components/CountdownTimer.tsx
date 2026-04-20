import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  onResend: () => void;
  isLoading?: boolean;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  duration,
  onComplete,
  onResend,
  isLoading = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      if (onComplete) onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const handleResend = () => {
    if (!canResend || isLoading) return;
    onResend();
    setTimeLeft(duration);
    setCanResend(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center">
      <p className="text-sm text-gray-500 mb-2">
        {canResend ? (
          "Didn't receive the code?"
        ) : (
          <>
            Resend code in <span className="font-bold text-gray-800">{formatTime(timeLeft)}</span>
          </>
        )}
      </p>
      <button
        type="button"
        disabled={!canResend || isLoading}
        onClick={handleResend}
        className={`text-sm font-bold transition-all ${
          canResend && !isLoading
            ? 'text-[#FF8A00] hover:text-orange-700 hover:underline'
            : 'text-gray-400 cursor-not-allowed'
        }`}
      >
        {isLoading ? 'Sending...' : 'Resend OTP'}
      </button>
    </div>
  );
};

export default CountdownTimer;
