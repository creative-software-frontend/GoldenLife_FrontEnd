import { X, ArrowLeft, Home } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlan } from "./PricingPlanCard";
import logo from "../../../public/image/logo/logo.jpg";

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
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header — green */}
        <div className="bg-[#5C9C72] text-white p-4 flex items-center gap-3 shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Home className="w-5 h-5 opacity-80" />
          <h2 className="font-bold text-lg ml-2 flex-1">Membership Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

         <div className="p-4 overflow-y-auto flex-1">
          {/* Voucher Card - Updated with Green Gradient */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-5 text-white relative overflow-hidden mb-4 shadow-lg">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <img src={logo} alt="Watermark" className="absolute right-4 bottom-4 w-12 h-12 opacity-25 rounded-lg object-cover" />

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

        </div>

        {/* Sticky footer — exact design match */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          {/* Payment method row */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Choose Payment Method</p>
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-[#5C9C72] text-white border-[#5C9C72] shadow-md"
              >
                Wallet
              </button>
              <button disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                Bkash
              </button>
              <button disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                Nogod
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="payment_terms_final"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-6 h-6 rounded border-gray-300 accent-[#5C9C72] cursor-pointer shrink-0 shadow-sm"
            />
            <label htmlFor="payment_terms_final" className="text-[15px] text-gray-800 leading-tight cursor-pointer select-none font-bold">
              I accept the{" "}
              <a href="/dashboard/help/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">Privacy Policy</a>
              {" "}&amp;{" "}
              <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#F97316] hover:underline">Terms</a>.
            </label>
          </div>

          {/* Confirm purchase button */}
          <button
            onClick={() => { if (agreed) onPayNow(quantity); }}
            disabled={!agreed}
            className={`w-full h-14 rounded-2xl text-[14px] font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${
              agreed
                ? "bg-[#5C9C72] hover:bg-[#4a855d] text-white shadow-xl shadow-green-100 active:scale-[0.97]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            CONFIRM PURCHASE &mdash; ৳{totalPrice.toFixed(2)}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full h-11 text-gray-400 text-[13px] font-bold uppercase flex items-center justify-center gap-2 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={15} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
