import { CheckCircle2 } from "lucide-react";

interface PricingPlanCardProps {
  onClick: () => void;
}

export const PricingPlanCard = ({ onClick }: PricingPlanCardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Free Plan */}
      <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
        <h3 className="text-xl font-bold text-gray-800">Basic Plan</h3>
        <p className="text-gray-500 mt-2">Perfect for getting started</p>
        <div className="mt-4 text-3xl font-bold text-gray-900">Free</div>
        <ul className="mt-6 space-y-3">
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-secondary" /> 1 User Account</li>
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-secondary" /> Basic Features</li>
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-secondary" /> Community Support</li>
        </ul>
        <button className="w-full mt-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-800 cursor-not-allowed">
          Current Plan
        </button>
      </div>

      {/* Premium Plan */}
      <div className="border-2 border-primary rounded-2xl p-6 shadow-md relative bg-blue-50/30">
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
          RECOMMENDED
        </div>
        <h3 className="text-xl font-bold text-primary">Pro Plan</h3>
        <p className="text-gray-500 mt-2">For professionals & businesses</p>
        <div className="mt-4 text-3xl font-bold text-gray-900">৳ 999<span className="text-sm text-gray-500 font-normal">/month</span></div>
        <ul className="mt-6 space-y-3">
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Access</li>
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Priority Support</li>
          <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Advanced Analytics</li>
        </ul>
        <button 
          onClick={onClick}
          className="w-full mt-8 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};
