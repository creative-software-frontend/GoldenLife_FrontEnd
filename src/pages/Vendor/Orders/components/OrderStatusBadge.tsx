import { OrderStatus } from '../types/order.types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Packaging':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'On The Way':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyles()}`}>
      {status}
    </span>
  );
}
