'use client';

import { useState, FormEvent } from 'react';
import { ChevronLeft, Phone } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

export default function SendMoney() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // Validate the phone number
        if (!phoneNumber || phoneNumber.length < 10) {
            alert('Please enter a valid phone number.');
            return;
        }
        // Navigate to the next page with the phone number as a query parameter
        navigate(`/payamount?phone=${phoneNumber}`);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-gray-50 min-h-screen p-4">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button className="text-blue-500" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Send Money</h1>
            </div>

            {/* Phone Number Input and Submit Button */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                        type="tel"
                        placeholder="Enter mobile number..."
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 pr-4 py-2 w-full"
                        required
                        pattern="[0-9]*"
                    />
                </div>
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </div>
    );
}
