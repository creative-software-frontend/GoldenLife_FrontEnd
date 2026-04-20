import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      
      <div className="w-14 h-14 bg-[#FF9100]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#FF9100] transition-colors duration-300">
        <svg className="w-7 h-7 text-[#FF9100] group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      
      {/* TITLE */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF9100] transition-colors duration-300">
        {title}
      </h3>
      
      {/* DESCRIPTION */}
      <p className="text-gray-600 leading-relaxed mb-6">
        {description}
      </p>
      
      {/* LEARN MORE LINK */}
      <a href="#" className="inline-flex items-center text-[#FF9100] font-medium hover:text-[#E07B00] transition-colors group/link">
        Learn more 
        <svg className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}