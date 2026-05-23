import { X, ArrowLeft, Home, Wallet } from "lucide-react";
import { useState } from "react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'single' | 'multiple';
}

export const CheckoutModal = ({ isOpen, onClose, type }: CheckoutModalProps) => {
  const [agreed, setAgreed] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  if (!isOpen) return null;

  const orderAmount = type === 'single' ? 999 : 2400; // Example amounts
  const charge = orderAmount * 0.027; // Example ~2.7% charge
  const netPayable = orderAmount + charge;

  const paymentMethods = [
    { id: 'wallet', name: 'Wallet', icon: <Wallet className="text-blue-500" />, color: 'border-blue-200 bg-blue-50' },
    { id: 'bkash', name: 'bKash', img: '/image/payment/bkash.png', color: 'border-pink-200 bg-pink-50' },
    { id: 'nagad', name: 'Nagad', img: '/image/payment/nagad.png', color: 'border-orange-200 bg-orange-50' },
    { id: 'rocket', name: 'Rocket', img: '/image/payment/rocket.png', color: 'border-purple-200 bg-purple-50' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-md h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 md:slide-in-from-bottom-0 md:zoom-in duration-300">
        
        {/* Header matching image 2 */}
        <div className="bg-primary text-white p-4 flex items-center gap-3 shrink-0">
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <Home className="w-5 h-5 opacity-80" />
          <h2 className="font-bold text-lg ml-2">Membership Payment</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="text-center font-bold text-gray-800 text-lg mb-6">Pay Now Order</h3>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Order Amount :</span>
                <span className="font-bold text-secondary">{orderAmount} ৳</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Online Payment Charge :</span>
                <span className="font-bold text-secondary">{charge.toFixed(2)} ৳</span>
              </div>
              <div className="border-t border-dashed border-gray-200 pt-4 flex justify-between items-center">
                <span className="text-gray-800 font-bold">Net Payable Amount :</span>
                <span className="font-bold text-primary text-base">{netPayable.toFixed(3)} ৳</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6">
            <button className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 font-medium hover:bg-gray-50">
              Terms & conditions
            </button>
          </div>

          <div className="flex justify-center items-center gap-2 mb-8">
            <input 
              type="checkbox" 
              id="checkout_terms" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary accent-primary"
            />
            <label htmlFor="checkout_terms" className="text-sm text-gray-600 cursor-pointer">
              I agree to terms and conditions
            </label>
          </div>

          {/* Payment Methods Section (Senior Dev Suggestion) */}
          <div className="mb-8">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Select Payment Method</h4>
            <div className="grid grid-cols-2 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedMethod === method.id 
                      ? `${method.color} shadow-md scale-[1.02] border-primary` 
                      : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center mb-2">
                    {method.icon ? method.icon : (
                      <img 
                        src={method.img} 
                        alt={method.name} 
                        className="w-full h-full object-contain"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{method.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => {
              if(!agreed) alert("Please agree to terms and conditions.");
              else if(!selectedMethod) alert("Please select a payment method.");
              else alert(`Processing payment via ${selectedMethod.toUpperCase()}...`);
            }}
            className={`w-full py-4 rounded-full font-bold text-white shadow-lg transition-all ${
              agreed && selectedMethod 
                ? 'bg-primary hover:opacity-90 active:scale-95' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            PAY NOW
          </button>
        </div>
      </div>
    </div>
  );
};
