'use client'

import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import PaymentMethod from '../PaymentMethod/PaymentMethod'

interface PaymentDetailsProps {
    onClose: () => void
    type: 'wallet' | 'voucher' | 'recharge'
    amount: number
}

export default function PaymentDetails({ onClose, type, amount }: PaymentDetailsProps) {
    const [agreed, setAgreed] = useState(false)
    const [inputAmount, setInputAmount] = useState(amount.toString())
    const [showPaymentMethod, setShowPaymentMethod] = useState(false)

    const bonus = 500
    const willReceive = parseInt(inputAmount) * 10

    const handlePayNow = () => {
        setShowPaymentMethod(true)
    }

    const handleSelectPaymentMethod = (method: string) => {
        console.log('Selected payment method:', method)
        // Handle payment method selection
    }

    if (showPaymentMethod) {
        return (
            <PaymentMethod
                amount={parseInt(inputAmount)}
                onClose={() => setShowPaymentMethod(false)}
                onSelectMethod={handleSelectPaymentMethod}
            />
        )
    }

    return (
        <div className="w-[40%] mx-auto bg-white min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <button
                    className="text-blue-500"
                    onClick={onClose}
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-semibold">Payment Details</h1>
            </div>

            {/* Main Content */}
            <div className="p-4 space-y-6">
                {/* Card */}
                <Card className="relative overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/placeholder.svg?height=200&width=400')",
                            opacity: 0.7
                        }}
                    />
                    <div className="relative p-6">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-semibold text-white uppercase">{type}</h3>
                            <p className="text-white/90">Bonus</p>
                            <p className="text-white text-xl">৳ {bonus}</p>
                        </div>
                        <div className="absolute top-6 right-6 bg-gradient-to-br from-blue-500 to-purple-600 px-6 py-3 rounded-xl">
                            <span className="text-2xl font-bold text-white">{amount}</span>
                        </div>
                        <div className="absolute bottom-4 right-6">
                            <span className="text-white/90">Regular</span>
                        </div>
                    </div>
                </Card>

                {/* Transaction Details */}
                <div className="flex justify-between items-center py-4 border-b">
                    <div className="text-gray-600">Nagd Trx Charge</div>
                    <div className="font-semibold">N/A</div>
                </div>

                <div className="flex justify-between items-center py-4 border-b">
                    <div className="text-gray-600">You will Receive</div>
                    <div className="font-semibold">{willReceive}</div>
                </div>

                {/* Amount Input */}
                <div className="space-y-4">
                    <Input
                        type="number"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        className="text-2xl p-6"
                    />
                </div>

                {/* Checkbox */}
                <div className="flex items-start space-x-2">
                    <Checkbox
                        id="terms"
                        checked={agreed}
                        onCheckedChange={(checked) => setAgreed(checked as boolean)}
                    />
                    <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        আমি নিয়ম ও শর্তাবলির সাথেও একমত
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                    <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={onClose}
                    >
                        CLOSE
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!agreed}
                        onClick={handlePayNow}
                    >
                        PAY NOW
                    </Button>
                </div>
            </div>
        </div>
    )
}

