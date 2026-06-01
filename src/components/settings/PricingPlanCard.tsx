import { CheckCircle2, Clock, Zap, Star } from "lucide-react";

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: string;
  billing_cycle: string;
  duration_value: number;
  trial_days: number;
  is_active: number;
}

interface PricingPlanCardProps {
  plan: SubscriptionPlan;
  onClick: (plan: SubscriptionPlan) => void;
}

export const PricingPlanCard = ({ plan, onClick }: PricingPlanCardProps) => {
  const isRecommended = plan.is_active === 1;
  const price = Number(plan.price);

  return (
    <div
      className={`relative border-2 rounded-2xl p-6 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${isRecommended
        ? "border-primary bg-blue-50/40"
        : "border-gray-200 bg-white"
        }`}
    >
      {/* Badge */}
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl flex items-center gap-1">
          <Star className="w-3 h-3" />      <span className="text-4xl font-black text-gray-900">৳{price.toLocaleString()}</span>
        </div>
      )}

      {/* Plan name & description */}
      <h3 className={`text-xl font-bold capitalize ${isRecommended ? "text-primary" : "text-gray-800"}`}>
        {plan.name}
      </h3>
      <p className="text-gray-500 text-sm mt-1 line-clamp-2">{plan.description}</p>


      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-black text-gray-900">৳{price.toLocaleString()}</span>
        <span className="text-sm text-gray-400 font-medium mb-1">/ {plan.billing_cycle}</span>
      </div>


      <div className="mt-0 flex flex-wrap gap-2">
        {/* <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          {plan.duration_value} days access
        </span> */}
        {/* {plan.trial_days > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            {plan.trial_days}-day free trial
          </span>
        )} */}

        {/* <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full">
          নিজের এলাকায় কাজ করার সুযোগ

        </span> */}


      </div>

      {/* Feature list */}
      <ul className="mt-6 space-y-2.5 flex-grow">
        {/* <li className="flex items-center gap-2 text-gray-600 text-sm">
          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isRecommended ? "text-primary" : "text-gray-400"}`} />
          Billed {plan.billing_cycle}
        </li>
        <li className="flex items-center gap-2 text-gray-600 text-sm">
          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isRecommended ? "text-primary" : "text-gray-400"}`} />
          {plan.duration_value} days full access
        </li>
        {plan.trial_days > 0 && (
          <li className="flex items-center gap-2 text-gray-600 text-sm">
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isRecommended ? "text-primary" : "text-gray-400"}`} />
            {plan.trial_days} days free trial included
          </li>
        )}
        <li className="flex items-center gap-2 text-gray-600 text-sm">
          <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${isRecommended ? "text-primary" : "text-gray-400"}`} />
          Wallet payment supported
        </li> */}
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          নিজের এলাকায় কাজ করার সুযোগ
        </li>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">আপনি আপনার নিজ উপজেলা/জেলা/এলাকা থেকেই কাজ করতে পারবেন, আলাদা অফিসে যাওয়ার দরকার নেই।</p>
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          ১২ ধরণের  ইনকাম করার সুযোগ
        </li>
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          অনলাইন সাপোর্ট ও ট্রেনিং
        </li>
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          টিম বিল্ডিং সিস্টেম
        </li>
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          ক্যারিয়ার গ্রোথ সুযোগ
        </li>
        <li className="flex items-center gap-2 text-gray-900 text-sm">
          বিভিন্ন অফার ও বোনাস+
        </li>

      </ul>

      <button
        onClick={() => onClick(plan)}
        className={`w-full mt-8 py-3 rounded-xl font-bold transition-all shadow-md ${isRecommended
          ? "bg-primary text-white hover:opacity-90 shadow-primary/30"
          : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
      >
        Subscribe Now
      </button>
    </div>
  );
};
