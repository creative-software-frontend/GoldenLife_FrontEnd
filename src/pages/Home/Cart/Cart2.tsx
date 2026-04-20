'use client'

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Gift, Plus, ShoppingBag, X } from 'lucide-react'

interface CartItem {
    id: number
    name: string
    image: string
    weight: string
    price: number
    mrp: number
    quantity: number
}

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }> = ({
    children,
    className = '',
    variant = 'default',
    ...props
}) => (
    <button
        className={`px-4 py-2 rounded ${variant === 'outline' ? 'border border-gray-300' : 'bg-blue-500 text-white'} ${className}`}
        {...props}
    >
        {children}
    </button>
)

export default function Cart2() {
    const [isOpen, setIsOpen] = useState(false)
    const [showCode, setShowCode] = useState(false)
    const [items, setItems] = useState<CartItem[]>([])

    useEffect(() => {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setItems(JSON.parse(savedCart))
        }
    }, [])

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const updateQuantity = (id: number, delta: number) => {
        const newItems = items.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        )
        setItems(newItems)
        localStorage.setItem('cart', JSON.stringify(newItems))
    }

    return (
        <>
            {/* <button
                onClick={() => setIsOpen(true)}
                className="fixed right-0 top-[55%] -translate-y-1/2 bg-white border-2 border-primary-light rounded-l-full px-4 py-2 shadow-lg z-50"
            >
                <div className="flex items-center">
                    <ShoppingBag className="h-6 w-6 text-red-500" />
                    <div className="border-l border-gray-300 h-8 mx-2" />
                    <div>
                        <div className="font-semibold">{totalItems} ITEMS</div>
                        <div className="text-sm">₹ {total}</div>
                    </div>
                </div>
            </button> */}

            {/* {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end  z-50 pt-16">
                    <div className="bg-white rounded-md w-full max-w-md h-[80vh] overflow-auto rounded-t-lg shadow-lg">
                        <div className="sticky top-0 bg-white border-b z-10">
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-5 w-5" />
                                    <span className="font-medium">{items.length} ITEMS</span>
                                </div>
                                <Button variant="outline" className="text-sm" onClick={() => setIsOpen(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="divide-y">
                            {items.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4">
                                    <div className="w-1/3">
                                        <img
                                            alt={item.name}
                                            className="w-full h-auto object-cover"
                                            src={item.image}
                                            width={100}
                                            height={100}
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="font-medium text-sm mb-2 text-nowrap">
                                            {item.name.length > 40 ? `${item.name.slice(0, 40)}...` : item.name}
                                        </h3>
                                        <div className="flex items-center justify-around mt-auto ">
                                            <div className="flex items-center border rounded text-xs ">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="px-1 py-0.5">
                                                    <ChevronDown className="h-3 w-3" />
                                                </button>
                                                <span className="w-6 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="px-1 py-0.5">
                                                    <ChevronUp className="h-3 w-3" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-medium">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-gray-500 hover:text-gray-700 self-start">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="sticky bottom-0 bg-white border-t p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    className="w-full bg-primary-default hover:bg-gray-300 text-gray-800 flex items-center justify-center gap-2"
                                    onClick={() => setShowCode(!showCode)}
                                >
                                    <Gift className="h-6 w-6 " />
                                    Have a special code?
                                </Button>
                            </div>
                            {showCode && (
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 px-3 py-2 border rounded"
                                        placeholder="Referral/Discount Code"
                                    />
                                    <Button className="bg-primary-default">Go</Button>
                                    <Button variant="outline" onClick={() => setShowCode(false)}>Close</Button>
                                </div>
                            )}
                            <div>
                                <button
                                    className="w-full flex justify-center bg-primary-default text-white text-xl py-2 rounded text-center gap-6"
                                >
                                    <span>Place Orderedffff</span>
                                    <div className="border-2 border-primary-light h-8 mx-2" />
                                    <span className="text-nowrap space-x-3 text-xl">₹ {total}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </>
    )
}