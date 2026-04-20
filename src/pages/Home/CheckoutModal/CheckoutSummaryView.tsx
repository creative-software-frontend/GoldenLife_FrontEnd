import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, MapPin, ArrowLeft, AlertCircle, Loader2, Receipt, Package, Trash2 } from 'lucide-react'; // Added Trash2
import { Address, PaymentMethod } from './CheckoutModal';
import useModalStore from '@/store/modalStore';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useAppStore } from '@/store/useAppStore';

interface Props {
    data: { subTotal: number | string; totalItems: number };
    selectedAddress?: Address;
    paymentMethod: PaymentMethod;
    setPaymentMethod: (m: PaymentMethod) => void;
    onClose: () => void;
    onChangeAddress: () => void;
    onConfirm: () => void;
    deliveryFee: number | string;
}

const CheckoutSummaryView = ({
    data,
    selectedAddress,
    paymentMethod,
    setPaymentMethod,
    onClose,
    onChangeAddress,
    onConfirm,
    deliveryFee
}: Props) => {
    const { changeCheckoutModal, toggleClicked, triggerWalletUpdate } = useModalStore();
    const {
        walletBalance: storeWalletBalance,
        isWalletLoading: isFetchingBalance,
        fetchWallet,
        fetchNavbarData
    } = useAppStore();

    const navigate = useNavigate();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [error, setError] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    // --- CART ITEMS STATE ---
    const [cartItems, setCartItems] = useState<any[]>([]);

    // Convert string balance from store to number for calculations
    const walletBalance = parseFloat(storeWalletBalance) || 0;

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // 1. Initial Data Load
    useEffect(() => {
        // Ensure store has wallet data
        fetchWallet();

        try {
            const items = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartItems(items);
        } catch (err) {
            console.error("Error loading cart", err);
        }
    }, [fetchWallet]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // --- DYNAMIC CALCULATIONS ---
    const { currentSubTotal, originalTotal, currentTotalItems } = cartItems.reduce(
        (acc, item) => {
            const qty = Number(item.quantity) || 1;
            const offerPrice = Number(item.offer_price) || 0;
            const regularPrice = Number(item.regular_price) || Number(item.price) || 0;
            const activePrice = (offerPrice > 0 && offerPrice < regularPrice) ? offerPrice : regularPrice;
            const origPrice = regularPrice > 0 ? regularPrice : activePrice;

            acc.currentSubTotal += activePrice * qty;
            acc.originalTotal += origPrice * qty;
            acc.currentTotalItems += qty;
            return acc;
        },
        { currentSubTotal: 0, originalTotal: 0, currentTotalItems: 0 }
    );

    const totalSavings = originalTotal - currentSubTotal;
    const safeDeliveryFee = Number(deliveryFee) || 0;
    const total = currentSubTotal + safeDeliveryFee;
    const remainingBalance = walletBalance - total;

    const isInsufficientBalance = !isFetchingBalance && paymentMethod === 'Wallet' && walletBalance < total;

    // --- HANDLERS ---
    const handleRemoveItem = (idToRemove: string | number) => {
        const updatedCart = cartItems.filter(item => item.id !== idToRemove);
        setCartItems(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event("cartUpdated"));

        if (updatedCart.length === 0) {
            toast.error("Cart is empty.");
            onClose();
        } else {
            toast.success("Item removed");
        }
    };

    const handleConfirm = async () => {
        if (!termsAccepted) {
            setError(true);
            toast.error("Please accept the terms and conditions.");
            return;
        }

        if (!selectedAddress?.id) {
            toast.error("Please select a delivery address.");
            return;
        }

        if (isInsufficientBalance) {
            toast.error("Insufficient wallet balance.");
            return;
        }

        setIsPlacingOrder(true);

        try {
            const session = sessionStorage.getItem("student_session");
            const token = session ? JSON.parse(session).token : null;
            if (!token) throw new Error("No authentication token");

            if (cartItems.length === 0) throw new Error("Cart is empty");

            let calculatedSubTotal = 0;
            const delivery = Number(deliveryFee) || 0;

            const formData = new FormData();
            formData.append('address_id', String(selectedAddress.id));
            formData.append('payment_method', paymentMethod.toLowerCase());
            formData.append('delivery_charge', delivery.toFixed(2));

            cartItems.forEach((item: any) => {
                const offerPrice = Number(item.offer_price) || 0;
                const regularPrice = Number(item.regular_price) || Number(item.price) || 0;
                const price = (offerPrice > 0 && offerPrice < regularPrice) ? offerPrice : regularPrice;
                const qty = Number(item.quantity) || 1;
                const itemTotal = price * qty;

                calculatedSubTotal += itemTotal;

                formData.append('product_id[]', String(item.id));
                formData.append('service_type[]', "product");
                formData.append('quantity[]', String(qty));
                formData.append('item_total[]', String(itemTotal));
            });

            const finalTotal = calculatedSubTotal + delivery;
            formData.append('order_total', finalTotal.toFixed(2));

            const response = await axios.post(
                `${baseURL}/api/student/Orderstore`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data?.status === 'success' || response.data?.success) {
                toast.success(response.data?.message || "Order placed successfully!");

                const orderNo = response.data?.order?.order_no;

                localStorage.removeItem("cart");
                window.dispatchEvent(new Event("cartUpdated"));

                // GLOBAL STORE REFRESH: Refresh wallet and navbar components automatically
                await Promise.all([
                    fetchWallet(true),
                    fetchNavbarData(true)
                ]);

                if (paymentMethod.toLowerCase() === 'wallet') {
                    triggerWalletUpdate?.(); // Sync with components using this manual trigger
                }

                onConfirm();

                if (orderNo) {
                    navigate(`/dashboard/order-details?order=${orderNo}`);
                } else {
                    navigate('/dashboard');
                }
            } else {
                throw new Error(response.data?.message || "Order placement failed");
            }
        } catch (err: any) {
            console.error("Order placement failed:", err);

            let msg = "Failed to place order. Please try again.";
            if (err.response?.data?.message) {
                msg = err.response.data.message;
            } else if (err.response?.data?.errors) {
                const firstKey = Object.keys(err.response.data.errors)[0];
                msg = err.response.data.errors[firstKey][0];
            }

            toast.error(msg);
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleBackToCart = () => {
        changeCheckoutModal();
        toggleClicked();
    };

    if (isFetchingBalance) {
        return (
            <div className="flex flex-col h-[100dvh] w-full bg-white items-center justify-center z-[100]">
                <Loader2 className="w-12 h-12 animate-spin text-[#5C9C72] mb-4" />
                <h3 className="text-lg font-black text-gray-800 tracking-tight">Loading Checkout...</h3>
                <p className="text-sm text-gray-500 font-medium mt-1">Fetching your account details</p>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-white font-sans max-h-screen overflow-hidden">

            {/* --- HEADER --- */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10 h-14">
                <h2 className="text-base font-black text-gray-900 uppercase tracking-tight truncate">Checkout</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors shrink-0">
                    <X size={20} />
                </button>
            </div>

            {/* --- SCROLLABLE CONTENT --- */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">

                {/* 1. Address Section */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Address</h3>
                        <button onClick={onChangeAddress} className="text-[13px] font-bold text-[#F97316] hover:underline">Change</button>
                    </div>
                    <div className="flex gap-3 items-start">
                        <div className="p-2 bg-gray-50 rounded-lg shrink-0 mt-0.5">
                            <MapPin className="w-5 h-5 text-gray-800" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-bold text-gray-900 uppercase truncate">
                                {selectedAddress?.name || "SELECT ADDRESS"}
                            </p>
                            <p className="text-[13px] text-gray-500 mt-1 leading-relaxed font-medium break-words line-clamp-2">
                                {selectedAddress?.address || "No address selected"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. Product List Section */}
                {cartItems.length > 0 && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-1">
                            <Package className="w-4 h-4 text-gray-400" />
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Items in Order</h3>
                        </div>
                        <div className="space-y-3">
                            {cartItems.map((item: any, idx: number) => {
                                const offerPrice = Number(item.offer_price) || 0;
                                const regularPrice = Number(item.regular_price) || Number(item.price) || 0;
                                const activePrice = (offerPrice > 0 && offerPrice < regularPrice) ? offerPrice : regularPrice;
                                const origPrice = regularPrice > 0 ? regularPrice : activePrice;
                                const qty = Number(item.quantity) || 1;
                                const itemTotal = activePrice * qty;

                                const imageUrl = item.image || item.thumbnail || item.product_image;

                                return (
                                    <div
                                        key={item.id || idx}
                                        className="group relative flex justify-between items-start gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 mb-3"
                                    >
                                        {/* Left Section: Image and Info */}
                                        <div className="flex items-start gap-4 flex-1 min-w-0">
                                            {/* Image Section */}
                                            <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden shrink-0 flex items-center justify-center mt-0.5">
                                                <img
                                                    src={imageUrl || "/placeholder.svg"}
                                                    alt={item.name || "Product"}
                                                    className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>

                                            {/* Details Section */}
                                            <div className="flex-1 min-w-0 flex flex-col h-full">
                                                {/* Title */}
                                                <p className="text-[15px] font-bold text-gray-900 truncate leading-tight mb-1">
                                                    {item.name || item.product_title_english || "Unknown Item"}
                                                </p>

                                                {/* Qty Info */}
                                                <p className="text-[12px] font-medium text-gray-400 mb-3">
                                                    Quantity: <span className="text-gray-700 font-semibold">{qty}</span>
                                                </p>

                                                {/* Labels Stack */}
                                                <div className="mt-auto space-y-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Member</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">Customer</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Section: Actions and Price */}
                                        <div className="flex flex-col items-end justify-between shrink-0 self-stretch min-w-[100px]">
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200 -mr-2 -mt-2"
                                                title="Remove item"
                                            >
                                                <Trash2 className="w-4.5 h-4.5" />
                                            </button>

                                            {/* Price Stack (Aligned with Labels) */}
                                            <div className="flex flex-col items-end space-y-0.5 mt-auto">
                                                <span className="text-[14px] font-black text-gray-900 ">
                                                    ৳{itemTotal.toFixed(2)}
                                                </span>
                                                <span className="text-[12px] font-bold text-emerald-600  ">
                                                    ৳{origPrice.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. Order Summary Details */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-1">
                        <Receipt className="w-4 h-4 text-gray-400" />
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Order Summary</h3>
                    </div>

                    <div className="flex justify-between text-[13px] font-bold text-gray-500">
                        <span>Items ({currentTotalItems}):</span>
                        <span className="text-gray-900">৳{currentSubTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-[13px] font-bold text-gray-500">
                        <span>Total Customer Price:</span>
                        <span className="text-gray-900">৳{originalTotal.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-[13px] font-bold text-gray-500">
                        <span>Delivery Fee:</span>
                        <span className="text-gray-900">৳{safeDeliveryFee.toFixed(2)}</span>
                    </div>

                    {/* DISCOUNT ROW */}
                    {totalSavings > 0 && (
                        <div className="flex justify-between text-[13px] font-bold text-[#5C9C72] bg-[#5C9C72]/10 p-1.5 -mx-1.5 rounded-lg">
                            <span>Discount / Savings:</span>
                            <span>- ৳{totalSavings.toFixed(2)}</span>
                        </div>
                    )}

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center mt-2">
                        <span className="text-[15px] font-black text-gray-900 uppercase tracking-tight">Final Total</span>
                        <span className="text-2xl font-black text-[#5C9C72] tracking-tight">৳{total.toFixed(2)}</span>
                    </div>

                    {/* DISPLAY WALLET BALANCE */}
                    <div className="pt-3 mt-3 border-t border-dashed border-gray-200 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Your Account Balance:</span>
                            <span className={`text-[14px] font-black ${isInsufficientBalance ? 'text-red-500' : 'text-gray-900'}`}>
                                ৳{walletBalance.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- FIXED FOOTER --- */}
            <div className="p-4 border-t border-gray-200 bg-white space-y-4 shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.08)] z-20">

                {/* 4. Payment Option */}
                <div>
                    <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1">Choose Payment Method</h4>
                    <div className="flex flex-wrap gap-2">
                        {(['Wallet', 'Bkash', 'Nogod'] as PaymentMethod[]).map((method) => {
                            const isDisabled = method === 'Bkash' || method === 'Nogod';
                            return (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method)}
                                    disabled={isDisabled}
                                    className={`flex-1 min-w-[85px] py-3.5 px-2 rounded-xl text-[14px] font-black transition-all border-2 flex items-center justify-center whitespace-nowrap ${isDisabled
                                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed opacity-60"
                                        : paymentMethod === method
                                            ? "bg-[#5C9C72] text-white border-[#5C9C72] shadow-md scale-[1.02]"
                                            : "bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {method}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 5. INSUFFICIENT BALANCE WARNING */}
                {isInsufficientBalance && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex flex-col">
                            <span className="text-[13px] font-black text-red-700 leading-tight">Insufficient Wallet Balance</span>
                            <span className="text-[12px] font-medium text-red-600 mt-1 leading-snug">
                                You need ৳{Math.abs(remainingBalance).toFixed(2)} more to complete this order.
                            </span>
                        </div>
                    </div>
                )}

                {/* 6. Terms */}
                <div className="flex flex-col gap-1.5 px-1 py-1">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="terms-final"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="w-6 h-6 text-[#5C9C72] border-gray-300 rounded-md focus:ring-0 accent-[#5C9C72] cursor-pointer shrink-0 shadow-sm"
                        />
                        <label htmlFor="terms-final" className="text-[15px] text-gray-800 leading-tight cursor-pointer select-none font-bold">
                            I accept the <span className="text-[#F97316]">Privacy Policy</span> & <span className="text-[#F97316]">Terms</span>.
                        </label>
                    </div>
                    {error && !termsAccepted && (
                        <p className="text-red-500 text-[12px] font-black animate-bounce pl-9 mt-1">* You must accept terms to place order.</p>
                    )}
                </div>

                {/* --- ACTION BUTTONS --- */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isPlacingOrder || isInsufficientBalance || cartItems.length === 0}
                        className={`w-full h-14 rounded-2xl text-[14px] font-black uppercase transition-all flex items-center justify-center gap-2 ${(isPlacingOrder || isInsufficientBalance || cartItems.length === 0)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed border-none"
                            : "bg-[#5C9C72] hover:bg-[#4a855d] shadow-xl shadow-green-100 text-white active:scale-[0.97]"
                            }`}
                    >
                        {isPlacingOrder ? <Loader2 className="animate-spin w-6 h-6" /> : `Confirm Order — ৳${total.toFixed(2)}`}
                    </button>

                    <button
                        onClick={handleBackToCart}
                        disabled={isPlacingOrder}
                        className="w-full h-12 border-2 border-gray-100 text-gray-400 rounded-xl text-[13px] font-bold uppercase hover:bg-gray-50 hover:text-gray-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        <ArrowLeft size={16} /> Back to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummaryView;