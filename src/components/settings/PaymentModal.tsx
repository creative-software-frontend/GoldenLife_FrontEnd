import { X } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "./PricingPlanCard";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayNow: (quantity: number) => void;
  type: 'single' | 'multiple';
  plan?: SubscriptionPlan | null;
}

export const PaymentModal = ({ isOpen, onClose, onPayNow, type, plan }: PaymentModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [agreed, setAgreed] = useState(false);

  if (!isOpen) return null;

  const basePrice = type === 'single' ? (plan ? Number(plan.price) : 959) : 800;
  const totalPrice = basePrice * quantity;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header styling matching the first image */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/image/logo/logo.jpg" alt="Logo" className="h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
            {/* <h3 className="text-primary font-semibold text-lg">Next Js Company</h3> */}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          {/* Voucher Card */}
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-xl p-5 text-white relative overflow-hidden mb-4 shadow-lg">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <img src="/image/logo/logo.jpg" alt="Watermark" className="absolute right-4 bottom-4 w-12 h-12 opacity-25 rounded-lg object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />

            <div className="flex justify-between items-start mb-6">
              {/* <div>
                <h4 className="font-bold text-lg tracking-wide uppercase">Voucher</h4>
                <p className="text-white/80 text-sm">Bonus</p>
                <div className="text-xl font-bold mt-1">৳ 0</div>
              </div> */}
              <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 border border-white/30 text-right">
                <div className="text-2xl font-bold">৳ {basePrice}.00</div>
                <div className="text-xs text-white/90">Regular</div>
              </div>
            </div>

            {/* Cutout notch effect */}
            <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white rounded-full -translate-y-1/2"></div>
          </div>

          {/* <div className="flex justify-between items-center py-3 border-b border-gray-100 text-sm">
            <div className="text-gray-500">
              <div className="mb-1">Nagad Trx Charge</div>
              <div className="font-medium text-gray-800">N/A</div>
            </div>
            <div className="text-right">
              <div className="text-gray-500 mb-1">You will Receive</div>
              <div className="font-medium text-gray-800">{basePrice}.00 ৳</div>
            </div>
          </div> */}

          {/* Quantity selector (only for multiple) */}
          {type === 'multiple' && (
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-2 font-medium">Quantity (Multiple Shares)</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >-</button>
                <span className="font-bold text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                >+</button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <input
              type="text"
              value={totalPrice.toFixed(2)}
              readOnly
              className="w-full border border-gray-200 rounded-lg p-3 text-gray-700 bg-gray-50 focus:outline-none"
            />
          </div>

          <div className="mt-6 flex items-start gap-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 accent-teal-600"
            />
            <label htmlFor="terms" className="text-sm text-primary font-medium cursor-pointer">
              আমি রিটার্ন এন্ড রিফান্ড পলিসির সাথে একমত।
            </label>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-destructive text-white py-3 rounded-lg font-bold hover:opacity-90 transition-opacity shadow-md"
            >
              CLOSE
            </button>
            <button
              onClick={() => {
                if (agreed) onPayNow(quantity);
                else alert("Please agree to the terms first.");
              }}
              className={`flex-1 py-3 rounded-lg font-bold transition-all shadow-md ${agreed ? 'bg-primary text-white hover:opacity-90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
