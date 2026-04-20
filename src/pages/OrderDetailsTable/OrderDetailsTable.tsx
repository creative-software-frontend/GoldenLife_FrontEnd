'use client';

import React from 'react';
import { OrderDetailsModal } from './OrderDetailsModal';

interface OrderDetail {
    id: number;
    date: string;
    orderNo: string;
    customer: string;
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
}

const dummyOrderDetails: OrderDetail[] = [
    { id: 1, date: '2023-05-15', orderNo: 'ORD-001', customer: 'John Doe', total: 145.96, status: 'Delivered' },
    { id: 2, date: '2023-05-16', orderNo: 'ORD-002', customer: 'Jane Smith', total: 89.97, status: 'Shipped' },
    { id: 3, date: '2023-05-17', orderNo: 'ORD-003', customer: 'Bob Johnson', total: 299.99, status: 'Processing' },
    { id: 4, date: '2023-05-18', orderNo: 'ORD-004', customer: 'Alice Brown', total: 74.50, status: 'Pending' },
    { id: 5, date: '2023-05-19', orderNo: 'ORD-005', customer: 'Charlie White', total: 125.75, status: 'Shipped' },
    { id: 6, date: '2023-05-20', orderNo: 'ORD-006', customer: 'Diana Green', total: 89.50, status: 'Delivered' },
];

const OrderDetailsTable: React.FC = () => {
    const [selectedOrder, setSelectedOrder] = React.useState<string | null>(null);

    const getStatusColor = (status: OrderDetail['status']) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-200 text-yellow-800';
            case 'Processing':
                return 'bg-blue-200 text-blue-800';
            case 'Shipped':
                return 'bg-purple-200 text-purple-800';
            case 'Delivered':
                return 'bg-green-200 text-green-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    const handleRowClick = (orderNo: string) => {
        setSelectedOrder(orderNo);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Order Details</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                {/* Apply overflow-y-auto to tbody container */}
                <div className="overflow-y-auto max-h-[400px]">
                    <table className="min-w-full bg-white">
                        <thead className="sticky top-0 bg-gray-200">
                            <tr className="text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-center">Order-No</th>
                                <th className="py-3 px-6 text-left">Customer</th>
                                <th className="py-3 px-6 text-right">Total</th>
                                <th className="py-3 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {dummyOrderDetails.map((order) => (
                                <tr
                                    key={order.id}
                                    onClick={() => handleRowClick(order.orderNo)}
                                    className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                                >
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {order.date}
                                    </td>
                                    <td className="py-3 px-6 text-center">{order.orderNo}</td>
                                    <td className="py-3 px-6 text-left">{order.customer}</td>
                                    <td className="py-3 px-6 text-right">
                                        ${order.total.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <span
                                            className={`py-1 px-3 rounded-full text-xs ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <OrderDetailsModal
                isOpen={!!selectedOrder}
                onClose={() => setSelectedOrder(null)}
                orderId={selectedOrder || ''}
            />
        </div>
    );
};

export default OrderDetailsTable;
