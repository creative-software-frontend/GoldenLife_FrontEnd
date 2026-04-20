// src/components/CookieCard.tsx
import React from 'react';

interface CookieCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const CookieCard: React.FC<CookieCardProps> = ({ title, desc, icon }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="w-12 h-12 bg-orange-50 text-[#FF9100] rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#FF9100] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
};

export default CookieCard;