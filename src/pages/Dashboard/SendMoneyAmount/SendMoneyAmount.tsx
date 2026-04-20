import { useState } from 'react';
import { ChevronLeft, ArrowRight, User2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { formatBDT } from '@/utils/currencyFormatter';

const QUICK_AMOUNTS = [100, 200, 300, 400];

export default function SendMoneyAmount() {
    const [amount, setAmount] = useState(0);
    const [searchParams] = useSearchParams(); // Correct destructuring
    const navigate = useNavigate();

    const phone = searchParams.get('phone') || '';

    // Mock data - in a real app, fetch user details based on the phone number
    const receiverName = "Jenny";
    const availableBalance = 10000;

    return (
        <div className="w-full max-w-md mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <button className="text-blue-500" onClick={() => navigate(-1)}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Send Money</h1>
            </div>

            {/* Receiver Info */}
            <div className="p-4">
                <h2 className="text-gray-600 mb-3">Receiver</h2>
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <User2 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{receiverName}</p>
                        <p className="text-gray-600">{phone}</p>
                    </div>
                </div>
            </div>

            {/* Amount Section */}
            <div className="p-4">
                <h2 className="text-gray-600 mb-6">Amount</h2>
                <div className="text-center mb-4">
                    <p className="text-5xl font-light mb-4">{formatBDT(amount, { compact: true })}</p>
                    <p className="text-gray-600">
                        Available Balance: {formatBDT(availableBalance, { compact: true })}
                    </p>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                    {QUICK_AMOUNTS.map((value) => (
                        <button
                            key={value}
                            onClick={() => setAmount(value)}
                            className={`p-4 rounded-xl border ${amount === value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200'
                                }`}
                        >
                            {value}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bottom Action Button */}
            <div className="fixed bottom-0 left-0 right-0 p-4 ">
                <Button
                    className="w-[40%] mx-auto flex items-center justify-between px-6"
                    disabled={amount === 0}
                    onClick={() => navigate(`/send-money/confirm?amount=${amount}&phone=${phone}`)}
                >
                    <span>Proceed</span>
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
        </div>
    );
}
