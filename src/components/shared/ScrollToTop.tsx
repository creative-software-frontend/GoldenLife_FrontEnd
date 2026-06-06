import { useState, useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setVisible(scrollTop > 300);
      setProgress(pct);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG circle progress ring
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <button
      id="scroll-to-top-btn"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Back to Top"
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #C9A84C, #f5d98b)',
        boxShadow: '0 4px 24px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.18)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.85)',
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 0.35s cubic-bezier(.4,0,.2,1), transform 0.35s cubic-bezier(.4,0,.2,1)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          '0 8px 32px rgba(201,168,76,0.6), 0 2px 12px rgba(0,0,0,0.22)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-3px) scale(1.08)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.boxShadow =
          '0 4px 24px rgba(201,168,76,0.45), 0 2px 8px rgba(0,0,0,0.18)';
        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0) scale(1)';
      }}
    >
      {/* Progress ring */}
      <svg
        width="52"
        height="52"
        viewBox="0 0 52 52"
        style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
      >
        {/* Track */}
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2.5"
        />
        {/* Progress */}
        <circle
          cx="26" cy="26" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.15s linear' }}
        />
      </svg>

      {/* Arrow icon */}
      <svg
        width="18" height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#08081a"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  );
};

export default ScrollToTop;
