import React from 'react';

interface OrderItem {
    id: number;
    product: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

const dummyOrderItems: OrderItem[] = [
    { id: 1, product: 'Widget A', quantity: 2, unitPrice: 10.99, total: 21.98 },
    { id: 2, product: 'Gadget B', quantity: 1, unitPrice: 24.99, total: 24.99 },
    { id: 3, product: 'Tool C', quantity: 3, unitPrice: 7.50, total: 22.50 },
    { id: 4, product: 'Device D', quantity: 1, unitPrice: 99.99, total: 99.99 },
];

const OrderDetailsTable: React.FC = () => {
    const orderTotal = dummyOrderItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b text-left">Product</th>
                            <th className="py-2 px-4 border-b text-right">Quantity</th>
                            <th className="py-2 px-4 border-b text-right">Unit Price</th>
                            <th className="py-2 px-4 border-b text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummyOrderItems.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                                <td className="py-2 px-4 border-b">{item.product}</td>
                                <td className="py-2 px-4 border-b text-right">{item.quantity}</td>
                                <td className="py-2 px-4 border-b text-right">${item.unitPrice.toFixed(2)}</td>
                                <td className="py-2 px-4 border-b text-right">${item.total.toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-100 font-bold">
                            <td colSpan={3} className="py-2 px-4 border-b text-right">Order Total:</td>
                            <td className="py-2 px-4 border-b text-right">${orderTotal.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetailsTable;

