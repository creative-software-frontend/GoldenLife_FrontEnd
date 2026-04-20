'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Wallet, Gift, Phone } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import PaymentDetails from '../PaymentDetails/PaymentDetails'

type RequestType = 'wallet' | 'voucher' | 'recharge'
type ViewType = 'main' | 'request' | 'payment'

interface RequestItem {
    id: number
    amount: number
    type: string
}

const requestData: RequestItem[] = [
    { id: 1, amount: 100.00, type: 'Regular' },
    { id: 2, amount: 200.00, type: 'Regular' },
    { id: 3, amount: 500.00, type: 'Regular' },
    { id: 4, amount: 1000.00, type: 'Regular' },
]

interface RequestViewProps {
    title: string
    data: RequestItem[]
    onBack: () => void
    onSelectAmount: (amount: number) => void
}

const RequestView: React.FC<RequestViewProps> = ({ title, data, onBack, onSelectAmount }) => (
    <div className="w-[40%] mx-auto bg-white min-h-screen">
        <div className="flex items-center gap-4 p-4 border-b">
            <button className="text-blue-500" onClick={onBack}>
                <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        <div className="p-4 space-y-4">
            {data.map((item) => (
                <Card
                    key={item.id}
                    className="relative overflow-hidden cursor-pointer transition-transform hover:scale-[0.99] active:scale-[0.97]"
                    onClick={() => onSelectAmount(item.amount)}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: "url('/placeholder.svg?height=200&width=400')",
                            opacity: 0.7
                        }}
                    />
                    <div className="relative p-6 flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-semibold text-white">{title}</h3>
                            <p className="text-white/90">{item.type}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 px-4 py-2 rounded-xl">
                            <span className="text-xl font-bold text-white">{item.amount.toFixed(2)}</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
)

const AddMoney: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewType>('main')
    const [selectedType, setSelectedType] = useState<RequestType>('wallet')
    const [selectedAmount, setSelectedAmount] = useState<number>(0)

    const handleButtonClick = (type: RequestType) => {
        setSelectedType(type)
        setCurrentView('request')
    }

    const handleBack = () => {
        if (currentView === 'payment') {
            setCurrentView('request')
        } else {
            setCurrentView('main')
        }
    }

    const handleSelectAmount = (amount: number) => {
        setSelectedAmount(amount)
        setCurrentView('payment')
    }

    if (currentView === 'payment') {
        return (
            <PaymentDetails
                onClose={handleBack}
                type={selectedType}
                amount={selectedAmount}
            />
        )
    }

    if (currentView === 'request') {
        const titles = {
            wallet: 'Wallet Request',
            voucher: 'Voucher Request',
            recharge: 'Recharge Request'
        }
        return (
            <RequestView
                title={titles[selectedType]}
                data={requestData}
                onBack={handleBack}
                onSelectAmount={handleSelectAmount}
            />
        )
    }

    return (
        <div className="w-[40%] mx-auto bg-white min-h-screen">
            <div className="flex items-center gap-4 p-4 border-b">
                <h1 className="text-xl font-semibold">Add Money</h1>
            </div>

            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent">
                    <TabsTrigger
                        value="wallet"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Wallet
                    </TabsTrigger>
                    <TabsTrigger
                        value="voucher"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Voucher
                    </TabsTrigger>
                    <TabsTrigger
                        value="recharge"
                        className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-orange-500 data-[state=active]:shadow-none rounded-none"
                    >
                        Add Recharge
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="wallet" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Wallet className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">ওয়ালেট অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('wallet')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট অ্যামাউন্ট ক্রয় করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('wallet')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট অ্যামাউন্ট উত্তোলন করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('wallet')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ওয়ালেট ট্রানজেকশন হিস্ট্রি করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="voucher" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">ভাউচার অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('voucher')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার ক্রয় করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('voucher')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার রিডিম করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('voucher')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>ভাউচার হিস্ট্রি দেখুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="recharge" className="mt-4 px-4">
                    <Card className="bg-purple-50 p-6 mb-4 flex flex-col items-center justify-center">
                        <div className="bg-cyan-500 p-3 rounded-lg mb-4">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-orange-400 mb-2">রিচার্জ অ্যামাউন্ট</div>
                        <div className="text-blue-600 text-3xl font-semibold">100</div>
                    </Card>

                    <div className="space-y-3">
                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('recharge')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>মোবাইল রিচার্জ করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('recharge')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>অটো রিচার্জ সেট করুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>

                        <Card className="bg-purple-50">
                            <button className="w-full p-4 flex items-center justify-between" onClick={() => handleButtonClick('recharge')}>
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                                    <span>রিচার্জ হিস্ট্রি দেখুন</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-blue-500" />
                            </button>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AddMoney

