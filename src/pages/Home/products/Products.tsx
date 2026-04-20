// components/ServiceGrid.tsx

import React from 'react';
import { ShoppingCart, Store, HeartPulse, Smartphone, Airplay, Cloud } from 'lucide-react';

const services = [
    { label: "Shopping", icon: <ShoppingCart size={24} />, bg: "bg-blue-100" },
    { label: "Food", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Pharmacy", icon: <HeartPulse size={24} />, bg: "bg-blue-100" },
    { label: "Mobile", icon: <Smartphone size={24} />, bg: "bg-yellow-100" },
    { label: "Drive Offer", icon: <Airplay size={24} />, bg: "bg-gray-100" },
    { label: "Cloud Business", icon: <Cloud size={24} />, bg: "bg-purple-100" },
    { label: "Shopping", icon: <ShoppingCart size={24} />, bg: "bg-blue-100" },
    { label: "Food", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },
    { label: "Grocery", icon: <Store size={24} />, bg: "bg-green-100" },

];

const Products = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-0.5">
            {services.map((service, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center justify-center rounded-lg shadow p-2 ${service.bg}`}
                >
                    {service.icon}
                    <p className="mt-1 text-xs font-medium text-gray-700">{service.label}</p>
                </div>
            ))}
        </div>
    );
};

export default Products;
