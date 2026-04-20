import { useState } from 'react';
import { OrderStatus } from '../types/order.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: OrderStatus;
  onUpdate: (newStatus: OrderStatus) => Promise<void>;
  orderNo: string;
}

const statusOptions: OrderStatus[] = [
  'Order Placed',
  'Processing',
  'Packaging'
];

export function StatusUpdateModal({
  isOpen,
  onClose,
  currentStatus,
  onUpdate,
  orderNo
}: StatusUpdateModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(currentStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setIsUpdating(true);
    try {
      await onUpdate(selectedStatus);
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Update Order Status
          </DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Order Number
            </label>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded border">
              {orderNo}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Status
            </label>
            <Select
              value={selectedStatus}
              onValueChange={(value: OrderStatus) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedStatus !== currentStatus && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Status will change from{' '}
                <span className="font-semibold">{currentStatus}</span>{' '}
                to{' '}
                <span className="font-semibold">{selectedStatus}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            disabled={isUpdating || selectedStatus === currentStatus}
            className="bg-primary-light hover:bg-primary-light/90"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
