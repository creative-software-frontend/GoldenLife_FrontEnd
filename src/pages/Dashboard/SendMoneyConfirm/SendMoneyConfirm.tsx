import { ChevronLeft, User2 } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom' // useLocation for accessing query params
// import { Button } from "@/components/ui/button"

export default function SendMoneyConfirm() {
    const location = useLocation(); // Access the current location (URL)
    const navigate = useNavigate(); // Navigation hook

    // Parse query parameters from the location
    const searchParams = new URLSearchParams(location.search);
    const amount = searchParams.get('amount') || '0';
    const phone = searchParams.get('phone') || '';

    // Mock data - in real app, fetch user details based on phone number
    const receiverName = "Jenny";

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
                <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-3 rounded-full">
                        <User2 className="w-12 h-12 text-purple-600" />
                    </div>
                    <div>
                        <p className="font-semibold text-lg">{receiverName}</p>
                        <p className="text-gray-600">{phone}</p>
                    </div>
                </div>
            </div>

            {/* Amount Display */}
            <div className="p-4">
                <h2 className="text-2xl font-semibold">Amount: {amount}</h2>
            </div>

            {/* Payment Method Selection */}
            <div className="p-4 space-y-4">
                <h3 className="text-xl text-blue-500 text-center">Choose Payment Method</h3>

                <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border rounded-lg hover:bg-gray-50">
                        <img
                            src="../../../../public/image/payment/nogod.png"
                            alt="bKash"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                    <button className="p-4 border rounded-lg hover:bg-gray-50">
                        <img
                            src="../../../../public/image/payment/rocket.jpg"
                            alt="Nagad"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                </div>

                <div className="flex justify-center">
                    <button className="p-4 border rounded-lg hover:bg-gray-50 w-1/2">
                        <img
                            src="../../../../public/image/payment/bikash.png"
                            alt="Rocket"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
