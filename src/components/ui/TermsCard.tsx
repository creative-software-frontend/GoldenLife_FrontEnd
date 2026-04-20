// src/components/ui/TermsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TermsCardProps {
  title: string;
  children: React.ReactNode;
  variants?: any; // Optional variants for animation
}

const TermsCard: React.FC<TermsCardProps> = ({ title, children, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Arrow Icon */}
        <div className="flex-shrink-0 mt-1">
          <svg className="w-6 h-6 text-[#FF9100]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
        
        {/* Content */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">{title}</h2>
          <div className="text-gray-600 leading-relaxed text-base space-y-2">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TermsCard;