import { ArrowLeft, Home, Wallet, Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { baseURL, getAuthToken } from "@/store/utils";
import { useAppStore } from "@/store/useAppStore";
import { SubscriptionPlan } from "./PricingPlanCard";
import { toast } from "react-toastify";
import bikash from "../../../public/image/payment/bikash.png";
import nogod from "../../../public/image/payment/nogod.png";
import rocket from "../../../public/image/payment/rocket.jpg";
import { Link } from "react-router-dom";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "single" | "multiple";
  plan?: SubscriptionPlan | null;
  quantity: number;
}

export const CheckoutModal = ({
  isOpen,
  onClose,
  type,
  plan,
  quantity,
}: CheckoutModalProps) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { walletBalance, fetchWallet } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      fetchWallet(true);
    }
  }, [isOpen, fetchWallet]);

  if (!isOpen) return null;

  // Base calculation without the online payment transaction charge
  const netPayable = type === "single" ? (plan ? Number(plan.price) : 959) : 800 * quantity;

  // Balance evaluation thresholds
  const remainingBalance = Number(walletBalance) - netPayable;
  const hasSufficientBalance = Number(walletBalance) >= netPayable;

  const paymentMethods = [
    { id: "wallet", name: "Wallet", icon: <Wallet className="text-blue-500" />, color: "border-blue-200 bg-blue-50" },
    { id: "bkash", name: "bKash", img: bikash, color: "border-pink-200 bg-pink-50" },
    { id: "nagad", name: "Nagad", img: nogod, color: "border-orange-200 bg-orange-50" },
    { id: "rocket", name: "Rocket", img: rocket, color: "border-purple-200 bg-purple-50" },
  ];

  const handlePayNow = async () => {
    if (!agreed) {
      toast.error("Please agree to the terms and conditions first.");
      return;
    }
    if (!selectedMethod) {
      toast.error("Please select a payment method.");
      return;
    }
    if (selectedMethod !== "wallet") {
      toast.error(`Payment method ${selectedMethod.toUpperCase()} is not integrated yet. Please use Wallet.`);
      return;
    }
    if (!hasSufficientBalance) {
      toast.error(
        `Insufficient wallet balance. Net payable is ৳${netPayable.toFixed(2)} but your balance is ৳${Number(
          walletBalance
        ).toFixed(2)}.`
      );
      return;
    }
    setLoading(true);
    try {
      const token = getAuthToken();
      const headers = token ? { "X-Auth-Token": `Bearer ${token}` } : {};
      const payload = {
        subscription_plan_id: plan ? plan.id : 1,
        payment_method: "wallet",
      };
      const res = await axios.post(`${baseURL}/api/purchase-subscription`, payload, { headers });
      if (res.data?.success) {
        toast.success(res.data.message || "Subscription purchased successfully!");
        fetchWallet(true);
        onClose();
      } else {
        toast.error(res.data?.message || "Failed to purchase subscription.");
      }
    } catch (err: any) {
      console.error("Subscription purchase error:", err);
      toast.error(err.response?.data?.message || "An error occurred while purchasing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:zoom-in duration-300">
        {/* Header */}
        <div className="bg-primary text-white p-4 flex items-center gap-3 shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Home className="w-5 h-5 opacity-80" />
          <h2 className="font-bold text-lg ml-2 flex-1">Membership Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors ml-auto">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Order summary */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="text-center font-bold text-gray-800 text-lg mb-6">Pay Now Order</h3>
            <div className="space-y-4 text-sm">
              {type === "single" && plan && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Selected Plan :</span>
                  <span className="font-bold text-gray-800 capitalize">{plan.name}</span>
                </div>
              )}
              {type === "multiple" && (
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Seats (Quantity) :</span>
                  <span className="font-bold text-gray-800">{quantity}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Order Amount :</span>
                <span className="font-bold text-secondary">৳ {netPayable.toFixed(2)}</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Net Payable Amount :</span>
                <span className="font-bold text-primary text-base">৳ {netPayable.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-100 pt-3 mt-2 flex flex-col gap-2 text-xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Your Wallet Balance :</span>
                  <span className="font-medium text-gray-700">৳ {Number(walletBalance).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center font-bold mt-0.5">
                  <span className="text-gray-600">Remaining Balance :</span>
                  <span className={hasSufficientBalance ? "text-emerald-600" : "text-destructive"}>
                    ৳ {remainingBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="p-4 border-t border-gray-100 bg-white shrink-0 space-y-3.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          {/* Payment method row */}
          <div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">Choose Payment Method</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod("wallet")}
                className={`flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 transition-all ${selectedMethod === "wallet"
                  ? "bg-[#5C9C72] text-white border-[#5C9C72] shadow-md"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                  }`}
              >
                Wallet
              </button>
              <button type="button" disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                Bkash
              </button>
              <button type="button" disabled className="flex-1 py-3.5 rounded-xl text-[14px] font-black border-2 bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed">
                Nogod
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="checkout_terms_final"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-6 h-6 rounded border-gray-300 accent-[#5C9C72] cursor-pointer shrink-0 shadow-sm"
            />
            <label
              htmlFor="checkout_terms_final"
              className="text-[15px] text-gray-800 leading-tight cursor-pointer select-none font-bold"
            >
              I accept the{" "}
              <Link
                to="/dashboard/help/privacy-policy"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(); // Closes the modal so the user can see the new page
                }}
                className="text-[#F97316] hover:underline"
              >
                Privacy Policy
              </Link>
              {" & "}
              <Link
                to="/dashboard/help/terms"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(); // Closes the modal so the user can see the new page
                }}
                className="text-[#F97316] hover:underline"
              >
                Terms
              </Link>
              .
            </label>
          </div>

          {/* Confirm purchase button */}
          <button
            onClick={handlePayNow}
            disabled={loading}
            className={`w-full h-14 rounded-2xl text-[14px] font-black uppercase tracking-wide transition-all flex items-center justify-center gap-2 ${agreed && selectedMethod && !loading
              ? "bg-[#5C9C72] hover:bg-[#4a855d] text-white shadow-xl shadow-green-100 active:scale-[0.97]"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> PROCESSING...</>
            ) : (
              `CONFIRM PURCHASE — ৳${netPayable.toFixed(2)}`
            )}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full h-11 text-gray-400 text-[13px] font-bold uppercase flex items-center justify-center gap-2 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <ArrowLeft size={15} /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};