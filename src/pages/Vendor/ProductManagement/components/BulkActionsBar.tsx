import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BulkActionsBarProps } from '../types';

export const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  onClearSelection,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-background border border-border shadow-lg rounded-xl px-4 py-3 flex items-center gap-4">
        <span className="text-sm font-medium text-foreground">
          <span className="font-bold text-primary">{selectedCount}</span> product{selectedCount > 1 ? 's' : ''} selected
        </span>
        
        <div className="h-4 w-px bg-border" />
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-8 text-xs"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
