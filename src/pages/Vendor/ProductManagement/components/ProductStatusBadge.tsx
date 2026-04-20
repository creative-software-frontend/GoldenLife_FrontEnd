import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';
import { ProductStatusBadgeProps } from '../types';

export const ProductStatusBadge: React.FC<ProductStatusBadgeProps> = ({ status }) => {
  // Convert status to number for comparison (handles both string and number types)
  const statusNum = typeof status === 'string' ? parseInt(status, 10) : status;
  const isActive = statusNum === 1;
  
  return (
    <Badge
      variant={isActive ? 'default' : 'secondary'}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-all
        ${isActive 
          ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
          : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800'
        }
      `}
    >
      {isActive ? (
        <CheckCircle2 className="w-3.5 h-3.5" />
      ) : (
        <XCircle className="w-3.5 h-3.5" />
      )}
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </Badge>
  );
};
