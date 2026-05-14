import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Truck,
  PackageCheck,
  Clock,
  RotateCcw,
  Send
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OrderStatus } from '../types/instructor_order.types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdate: (status: OrderStatus) => Promise<void>;
  orderNo: string;
}

const statusOptions: { value: OrderStatus; label: string; icon: any; color: string; bg: string }[] = [
  { value: 'Order Placed', label: 'Order Placed', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { value: 'Processing', label: 'Processing', icon: RotateCcw, color: 'text-blue-600', bg: 'bg-blue-50' },
  { value: 'Packaging', label: 'Packaging', icon: PackageCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export const InstructorStatusUpdateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
  orderNo
}) => {
  const [loadingStatus, setLoadingStatus] = React.useState<OrderStatus | null>(null);

  const handleUpdate = async (status: OrderStatus) => {
    setLoadingStatus(status);
    try {
      await onUpdate(status);
      onClose();
    } finally {
      setLoadingStatus(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none rounded-[2.5rem] shadow-2xl bg-white">
        <DialogHeader className="p-8 bg-gray-900 text-white relative">
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white/40 hover:text-white hover:bg-white/10 rounded-full">
              <X size={20} />
            </Button>
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <PackageCheck size={20} />
            </div>
            Update Lifecycle
          </DialogTitle>
          <DialogDescription className="text-white/60 font-bold mt-2">
            Transitioning Order <span className="text-emerald-400">#{orderNo}</span> to a new phase.
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
          {statusOptions.map((option) => {
            const isCurrent = currentStatus === option.value;
            const isLoading = loadingStatus === option.value;

            return (
              <motion.button
                key={option.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpdate(option.value)}
                disabled={isCurrent || !!loadingStatus}
                className={`
                  flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300
                  ${isCurrent
                    ? 'border-emerald-500 bg-emerald-50/50 cursor-default ring-4 ring-emerald-50'
                    : 'border-gray-50 hover:border-emerald-200 bg-white hover:bg-emerald-50/20'
                  }
                  ${!!loadingStatus && !isLoading ? 'opacity-50 grayscale' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${option.bg} ${option.color}`}>
                    <option.icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className={`font-black uppercase tracking-widest text-[10px] ${isCurrent ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {isCurrent ? 'Current Signal' : 'Target Status'}
                    </p>
                    <p className={`font-black text-sm tracking-tight ${isCurrent ? 'text-emerald-700' : 'text-gray-900'}`}>
                      {option.label}
                    </p>
                  </div>
                </div>

                {isCurrent && (
                  <div className="bg-emerald-500 text-white p-1 rounded-full shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </div>
                )}
                {isLoading && (
                  <RotateCcw size={18} className="animate-spin text-emerald-600" />
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl font-black text-[10px] uppercase tracking-widest h-12 px-8 border-gray-200">
            Cancel Operation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
