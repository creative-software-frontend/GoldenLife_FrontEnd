import React from 'react';

interface CourseOrder {
    id: number;
    courseName: string;
    date: string;
    price: number;
    status: 'Completed' | 'In Progress' | 'Not Started';
}

const dummyCourseOrders: CourseOrder[] = [
    { id: 1, courseName: 'Introduction to React', date: '2023-05-15', price: 49.99, status: 'Completed' },
    { id: 2, courseName: 'Advanced JavaScript', date: '2023-05-20', price: 79.99, status: 'In Progress' },
    { id: 3, courseName: 'Python for Beginners', date: '2023-05-25', price: 39.99, status: 'Not Started' },
    { id: 4, courseName: 'Data Science Fundamentals', date: '2023-05-30', price: 89.99, status: 'In Progress' },
    { id: 5, courseName: 'Web Design Basics', date: '2023-06-05', price: 59.99, status: 'Completed' },
];

const CourseOrderTable: React.FC = () => {
    const getStatusColor = (status: CourseOrder['status']) => {
        switch (status) {
            case 'Completed':
                return 'bg-green-200 text-green-800';
            case 'In Progress':
                return 'bg-yellow-200 text-yellow-800';
            case 'Not Started':
                return 'bg-red-200 text-red-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Course Orders</h2>
            <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full bg-white">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Date</th>
                            <th className="py-3 px-6 text-left">Order No</th>
                            <th className="py-3 px-6 text-left">Course Name</th>
                            <th className="py-3 px-6 text-right">Price</th>
                            <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {dummyCourseOrders.map((order) => (
                            <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left whitespace-nowrap">{order.date}</td>
                                <td className="py-3 px-6 text-left">ORD-{order.id.toString().padStart(3, '0')}</td>
                                <td className="py-3 px-6 text-left">{order.courseName}</td>
                                <td className="py-3 px-6 text-right">${order.price.toFixed(2)}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className={`py-1 px-3 rounded-full text-xs ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseOrderTable;
