import React from 'react';
import { Mail, Smartphone } from 'lucide-react';

interface LoginTabsProps {
  selectedMethod: 'email' | 'mobile';
  onMethodChange: (method: 'email' | 'mobile') => void;
}

export const LoginTabs: React.FC<LoginTabsProps> = ({ selectedMethod, onMethodChange }) => {
  return (
    <div className="bg-gray-100 p-1.5 rounded-xl mb-6">
      <div className="flex gap-2">
        {/* Email Tab */}
        <button
          type="button"
          onClick={() => onMethodChange('email')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedMethod === 'email'
              ? 'bg-white text-orange-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Mail className="w-5 h-5" />
          <span>Email</span>
        </button>

        {/* Mobile Tab */}
        <button
          type="button"
          onClick={() => onMethodChange('mobile')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
            selectedMethod === 'mobile'
              ? 'bg-white text-orange-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Smartphone className="w-5 h-5" />
          <span>Mobile</span>
        </button>
      </div>
    </div>
  );
};
