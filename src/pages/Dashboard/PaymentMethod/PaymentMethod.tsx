'use client'

import { Camera, ChevronLeft, DollarSign, Folder, Headphones, HelpCircle } from 'lucide-react'
// import img from "next/img"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/pages/common/Label'
import { useState } from 'react'
// import { Label } from "@/components/ui/label"


interface PaymentMethodProps {
    amount: number
    onClose: () => void
    onSelectMethod: (method: string) => void
}

export default function PaymentMethod({ amount, onClose, onSelectMethod }: PaymentMethodProps) {
    const [agreed, setAgreed] = useState(false)

    return (
        <div className="w-[40%] max-w-md mx-auto bg-white h-auto scroll-me-0">
            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b">
                <button className="text-blue-500" onClick={onClose}>
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-medium">Payment Method</h1>
            </div>

            {/* Logo */}
            <div className="flex flex-col items-center justify-center py-2">
                <div className="relative w-100 h-32">
                    <img
                        src="../../../../public/image/logo/logo.jpg"
                        alt="Golden Life Group"

                        className="object-contain"
                    />
                </div>
                {/* <h2 className="mt-4 text-2xl font-medium text-gray-700">Golden Life Group</h2> */}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-6 mb-4 -mt-8 ">
                <Card className="p-4 cursor-pointer hover:bg-gray-50">
                    <Headphones className="w-6 h-6 text-gray-600" />
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-gray-50">
                    <HelpCircle className="w-6 h-6 text-gray-600" />
                </Card>
                <Card className="p-4 cursor-pointer hover:bg-gray-50">
                    <DollarSign className="w-6 h-6 text-gray-600" />
                </Card>
            </div>

            {/* Payment Options */}
            <Tabs defaultValue="mobile" className="px-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="mobile">মোবাইল ব্যাংকিং</TabsTrigger>
                    <TabsTrigger value="bank">ব্যাংক</TabsTrigger>
                </TabsList>
                <TabsContent value="mobile" className="space-y-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 ">
                    <button
                        onClick={() => onSelectMethod('bkash')}
                        className="w-full p-4 border rounded-lg hover:bg-gray-50"
                    >
                        <img
                            src="../../../../public/image/payment/bikash.png"
                            alt="bKash"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                    <button
                        onClick={() => onSelectMethod('nagad')}
                        className="w-full  border rounded-lg hover:bg-gray-50"
                    >
                        <img
                            src="../../../../public/image/payment/nogod.png"
                            alt="Nagad"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                    <button
                        onClick={() => onSelectMethod('rocket')}
                        className="w-full p-4 border rounded-lg hover:bg-gray-50"
                    >
                        <img
                            src="../../../../public/image/payment/rocket.jpg"
                            alt="Rocket"
                            width={120}
                            height={40}
                            className="mx-auto"
                        />
                    </button>
                </TabsContent>
                <TabsContent value="bank" className="mt-4">
                    <TabsContent value="bank" className="mt-4">
                        {/* Bank Logos */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
                            {['Krishi Bank', 'IBBL', 'DBBL'].map((bank) => (
                                <button
                                    key={bank}
                                    className=" border rounded-lg hover:bg-gray-50"
                                >
                                    <img
                                        src="../../../../public/image/payment/ibbbl.jpg"
                                        alt={bank}
                                        width={120}
                                        height={40}
                                        className="mx-auto w-20"
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Bank Account Details */}
                        <div className="space-y-4 mb-6">
                            <div className="text-center">
                                <p className="text-gray-600">Pay To This Bank Account:</p>
                                <p className="font-semibold">Acc Name: Self-employments Technologies Ltd.</p>
                                <p className="text-blue-500">Acc no: 12343532342523234</p>
                                <p className="text-gray-600">Krishi Bank, kodomtali Branch, Chittagong</p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <form className="space-y-2">
                            <div>
                                <Input
                                    placeholder="Your Branch Name*"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Your Bank Account Name*"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    placeholder="Your Bank Account Number*"
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    type="number"
                                    placeholder="Amount"
                                    defaultValue="200"
                                    required
                                />
                            </div>

                            {/* Attach Slip */}
                            <div className="space-y-2">
                                <p className="text-gray-600">Attach Deposit Slip</p>
                                <div className="flex gap-4">
                                    <Button variant="outline" size="icon">
                                        <Camera className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Folder className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={agreed}
                                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                                />
                                <Label htmlFor="terms">
                                    আমি রিটার্ন ও রিফান্ড পলিসির সাথেও একমত
                                </Label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 p-2">
                                <Button
                                    variant="destructive"
                                    className="flex-1"
                                    onClick={onClose}
                                >
                                    CLOSE
                                </Button>
                                <Button
                                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                                    disabled={!agreed}
                                >
                                    SEND REQUEST
                                </Button>
                            </div>
                        </form>
                    </TabsContent>
                </TabsContent>
            </Tabs>

            {/* Pay Button */}
            <div className="fixed  left-0 right-0 p-4 bg-white ">
                <Button
                    className="w-[40%] bg-blue-100 text-blue-600 hover:bg-blue-200"
                    size="lg"
                >
                    Pay {amount} BDT
                </Button>
            </div>
        </div>
    )
}

