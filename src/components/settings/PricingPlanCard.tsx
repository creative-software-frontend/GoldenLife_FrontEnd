import { CheckCircle2 } from "lucide-react";

interface PricingPlanCardProps {
  onClick: () => void;
}

export const PricingPlanCard = ({ onClick }: PricingPlanCardProps) => {
  return (
    <div className="border-2 border-primary rounded-2xl p-6 shadow-md relative bg-blue-50/30 h-full flex flex-col">
      <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
        RECOMMENDED
      </div>
      <h3 className="text-xl font-bold text-primary">Pro Plan</h3>
      <p className="text-gray-500 mt-2">For professionals & businesses</p>
      <div className="mt-4 text-3xl font-bold text-gray-900">৳ 999<span className="text-sm text-gray-500 font-normal">/month</span></div>
      <ul className="mt-6 space-y-3 flex-grow">
        <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Unlimited Access</li>
        <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Priority Support</li>
        <li className="flex items-center gap-2 text-gray-600"><CheckCircle2 className="w-5 h-5 text-primary" /> Advanced Analytics</li>
      </ul>
      <button 
        onClick={onClick}
        className="w-full mt-8 py-3 rounded-xl font-semibold bg-primary text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/30 mt-auto"
      >
        Upgrade Now
      </button>
    </div>
  );
};
