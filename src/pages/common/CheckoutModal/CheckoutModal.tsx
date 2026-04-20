"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, MapPin, Wallet, X, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import useModalStore from '@/store/modalStore';
import { useTranslation } from "react-i18next";

export default function CheckoutModal() {
  const { t } = useTranslation('global');
  const { isCheckoutModalOpen, changeCheckoutModal } = useModalStore();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  // Bangladeshi Currency Formatter [Lakh/Crore System]
  const formatBDT = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    if (isCheckoutModalOpen) {
      const stored = localStorage.getItem('cart');
      if (stored) setCartItems(JSON.parse(stored));
    }
  }, [isCheckoutModalOpen]);

  const subTotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const deliveryFee = 150.00;
  const total = subTotal + deliveryFee;

  if (!isCheckoutModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={changeCheckoutModal}
      />

      {/* Modal Content */}
      <div className="relative bg-gray-50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="sticky top-0 bg-white p-5 border-b flex items-center justify-between z-10">
          <h2 className="text-xl font-black uppercase tracking-tight text-gray-900">Checkout</h2>
          <button
            onClick={changeCheckoutModal}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Address Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Address</h3>
            <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 hover:border-orange-200 transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-2.5 rounded-xl text-orange-600">
                  <MapPin size={20} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-gray-900 leading-none">Test003</p>
                  <p className="text-xs text-gray-500 mt-1">Chittagong, Bangladesh</p>
                </div>
              </div>
              <ChevronRight className="text-gray-400" size={18} />
            </button>
          </div>

          {/* Order Summary Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Order Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Sub Total</span>
                <span className="text-gray-900 font-bold">৳ {formatBDT(subTotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Delivery (Outside Dhaka)</span>
                <span className="text-gray-900 font-bold">৳ {formatBDT(deliveryFee)}</span>
              </div>
              <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-center">
                <span className="font-black text-gray-900">Total</span>
                <span className="text-2xl font-black text-gray-900 italic">৳ {formatBDT(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Payment Method</h3>
            <div className="grid gap-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'wallet' ? 'border-orange-500 bg-white shadow-md' : 'border-transparent bg-white/50'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" checked={paymentMethod === 'wallet'} onChange={() => setPaymentMethod('wallet')} className="w-4 h-4 accent-orange-600" />
                  <span className="font-bold text-gray-800">Wallet</span>
                </div>
                <Wallet className={paymentMethod === 'wallet' ? 'text-orange-600' : 'text-gray-400'} size={20} />
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'gateway' ? 'border-orange-500 bg-white shadow-md' : 'border-transparent bg-white/50'}`}>
                <div className="flex items-center gap-3">
                  <input type="radio" checked={paymentMethod === 'gateway'} onChange={() => setPaymentMethod('gateway')} className="w-4 h-4 accent-orange-600" />
                  <span className="font-bold text-gray-800">Payment Gateway</span>
                </div>
                <CreditCard className={paymentMethod === 'gateway' ? 'text-orange-600' : 'text-gray-400'} size={20} />
              </label>
            </div>
          </div>

          {/* Confirm Button */}
          <Button className="w-full bg-[#00AEEF] hover:bg-[#0096ce] h-16 rounded-2xl text-lg font-black uppercase text-white shadow-xl shadow-blue-100 transition-all active:scale-95 mt-4">
            Confirm Order (৳ {formatBDT(total)})
          </Button>
        </div>
      </div>
    </div>
  );
}