import { Order } from '../types/order.types';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (orderNo: string) => void;
  onUpdateStatus: (order: Order) => void;
}

export function OrderTable({ orders, onViewDetails, onUpdateStatus }: OrderTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <p className="text-lg font-medium">No orders found</p>
        <p className="text-sm">Try adjusting your filters or search criteria</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold text-gray-700">Order No</TableHead>
            <TableHead className="font-bold text-gray-700">Date</TableHead>
            <TableHead className="font-bold text-gray-700">Customer</TableHead>
            <TableHead className="font-bold text-gray-700">Total</TableHead>
            <TableHead className="font-bold text-gray-700">Status</TableHead>
            <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="hover:bg-gray-50/50">
              <TableCell className="font-semibold text-primary-light">
                #{order.order_no}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {formatDate(order.created_at)}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium text-gray-900">{order.user_name}</p>
                  <p className="text-xs text-gray-500">{order.user_phone}</p>
                </div>
              </TableCell>
              <TableCell className="font-semibold text-gray-900">
                ৳{parseFloat(order.total).toFixed(2)}
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewDetails(order.order_no)}
                    className="text-sm"
                  >
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(order)}
                    className="text-sm bg-primary-light hover:bg-primary-light/90"
                  >
                    Update
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
