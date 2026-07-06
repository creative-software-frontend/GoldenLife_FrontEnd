import { CheckCircle2, ChevronDown, ChevronUp, Star, MapPin, TrendingUp, Headphones, Users, BarChart2, Gift } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";

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

interface FeatureItem {
  icon: React.ReactNode;
  heading: string;
  detail: string;
}

const features: FeatureItem[] = [
  {
    icon: <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "নিজের এলাকায় কাজ করার সুযোগ",
    detail: "আপনি আপনার নিজ উপজেলা/জেলা/এলাকা থেকেই কাজ করতে পারবেন, আলাদা অফিসে যাওয়ার দরকার নেই।",
  },
  {
    icon: <TrendingUp className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "১২ ধরণের ইনকাম করার সুযোগ",
    detail: "বিভিন্ন ধরনের ইনকাম সোর্স থেকে আয় করুন এবং আপনার আর্থিক স্বাধীনতা নিশ্চিত করুন।",
  },
  {
    icon: <Headphones className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "অনলাইন সাপোর্ট ও ট্রেনিং",
    detail: "বিশেষজ্ঞ দলের কাছ থেকে ২৪/৭ অনলাইন সাপোর্ট এবং পেশাদার ট্রেনিং সেশন পান।",
  },
  {
    icon: <Users className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "টিম বিল্ডিং সিস্টেম",
    detail: "নিজের টিম তৈরি করুন এবং একসাথে কাজ করে সাফল্য অর্জন করুন।",
  },
  {
    icon: <BarChart2 className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "ক্যারিয়ার গ্রোথ সুযোগ",
    detail: "ধাপে ধাপে আপনার ক্যারিয়ার গড়ে তুলুন এবং পেশাদার দক্ষতা অর্জন করুন।",
  },
  {
    icon: <Gift className="w-4 h-4 flex-shrink-0 text-primary" />,
    heading: "বিভিন্ন অফার ও বোনাস+",
    detail: "নিয়মিত বিশেষ অফার, বোনাস এবং পুরস্কার উপভোগ করুন।",
  },
];

const FeatureRow = ({
  feature,
  isRecommended,
}: {
  feature: FeatureItem;
  isRecommended: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-md overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-200 ${
          open
            ? isRecommended
              ? "bg-primary/10"
              : "bg-gray-50"
            : "hover:bg-gray-50"
        }`}
      >
        {feature.icon}
        <span className="flex-1 text-base font-semibold text-gray-800">
          {feature.heading}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-1.5 text-base text-gray-500 leading-relaxed bg-gray-50 border-t border-gray-100">
          <div className="flex items-start gap-1.5">
            <CheckCircle2
              className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                isRecommended ? "text-primary" : "text-gray-400"
              }`}
            />
            <span>{feature.detail}</span>
          </div>
        </div>
      )}
    </li>
  );
};

export const PricingPlanCard = ({ plan, onClick }: PricingPlanCardProps) => {
  const isRecommended = plan.is_active === 1;
  const price = Number(plan.price);
  const studentProfile = useAppStore((s) => s.studentProfile);
  const isActive = studentProfile?.status?.toLowerCase() === "active";

  return (
    <div
      className={`relative border-2 rounded-xl p-4 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isRecommended
          ? "border-primary bg-blue-50/40"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Price Badge (top-right) */}
      <div
        className={`absolute top-0 right-0 text-white text-xl font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5 ${
          isRecommended ? "bg-primary" : "bg-gray-700"
        }`}
      >
        <Star className="w-4 h-4" />
        <span>৳{price.toLocaleString()}</span>
      </div>

      {/* Header: Plan name */}
      <div className="pr-20">
        <h3
          className={`text-lg font-bold capitalize leading-tight ${
            isRecommended ? "text-primary" : "text-gray-800"
          }`}
        >
          {plan.name}
        </h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-1">
          {plan.description}
        </p>
      </div>

      {/* Feature accordion list */}
      <ul className="mt-3 space-y-1 flex-grow">
        {features.map((feature, idx) => (
          <FeatureRow key={idx} feature={feature} isRecommended={isRecommended} />
        ))}
      </ul>

      <button
        onClick={() => onClick(plan)}
        disabled={isActive}
        className={`flex items-center justify-center w-full mt-4 py-3 rounded-lg font-bold text-base transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${
          isRecommended
            ? "bg-primary text-white hover:opacity-90 shadow-primary/30"
            : "bg-gray-800 text-white hover:bg-gray-700"
        }`}
      >
        {isActive ? "Already Active" : "Subscribe Now"}
      </button>
    </div>
  );
};
