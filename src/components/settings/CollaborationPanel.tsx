import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Star,
  Users,
  ShieldCheck,
  Share2,
  TrendingUp,
  BookOpen,
  Award,
  Globe,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { BuyShareModal } from "./BuyShareModal";

interface ShareFeatureItem {
  icon: React.ReactNode;
  heading: string;
  detail: string;
}

const shareFeatures: ShareFeatureItem[] = [
  {
    icon: <Users className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "মালিকানার অংশীদারিত্ব",
    detail:
      "Golden Life Business Platform-এর একজন অংশীদার হিসেবে কোম্পানির নির্ধারিত শেয়ার ধারণের সুযোগ।",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "ব্যবসায়িক সিদ্ধান্তে অংশগ্রহণ",
    detail:
      "কোম্পানির নীতিমালা অনুযায়ী সাধারণ সভা (AGM) বা বিশেষ সভায় মতামত প্রদানের সুযোগ।",
  },
  {
    icon: <TrendingUp className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "দীর্ঘমেয়াদী ব্যবসায়িক প্রবৃদ্ধির অংশীদার",
    detail: "কোম্পানির বৃদ্ধি ও সম্প্রসারণের সাথে সম্পৃক্ত থাকার সুযোগ।",
  },
  {
    icon: <BookOpen className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "বিশেষ প্রশিক্ষণ ও গাইডলাইন",
    detail:
      "ব্যবসা, নেতৃত্ব, মার্কেটিং ও ডিজিটাল দক্ষতা উন্নয়নের জন্য প্রশিক্ষণ সুবিধা।",
  },
  {
    icon: <Globe className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "ব্যবসায়িক নেটওয়ার্ক",
    detail:
      "দেশব্যাপী উদ্যোক্তা, বিক্রেতা ও ব্যবসায়িক অংশীদারদের সাথে নেটওয়ার্ক তৈরির সুযোগ।",
  },
  {
    icon: <Zap className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "নতুন প্রকল্পে অগ্রাধিকার",
    detail:
      "কোম্পানির নতুন উদ্যোগ, ক্যাম্পেইন বা সম্প্রসারণ কার্যক্রমে অগ্রাধিকারভিত্তিক অংশগ্রহণের সুযোগ।",
  },
  {
    icon: <Award className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "অফিসিয়াল স্বীকৃতি",
    detail:
      "কোম্পানির অফিসিয়াল কার্যক্রম, মিটিং, প্রশিক্ষণ ও ইভেন্টে অংশগ্রহণের সুযোগ।",
  },
  {
    icon: <ShieldCheck className="w-4 h-4 flex-shrink-0 text-secondary" />,
    heading: "সম্ভাব্য লভ্যাংশ",
    detail:
      "যদি কোম্পানি লাভ করে এবং পরিচালনা পর্ষদ অনুমোদন দেয়, তাহলে শেয়ারহোল্ডাররা লভ্যাংশ পাওয়ার জন্য বিবেচিত হতে পারেন।",
  },
];

const ShareFeatureRow = ({ feature }: { feature: ShareFeatureItem }) => {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-md overflow-hidden border border-gray-100">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-200 ${open ? "bg-secondary/10" : "hover:bg-gray-50"
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
            <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5 text-secondary" />
            <span>{feature.detail}</span>
          </div>
        </div>
      )}
    </li>
  );
};

interface CollaborationPanelProps {
  onClick?: () => void;
}

export const CollaborationPanel = ({ onClick }: CollaborationPanelProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handlePurchaseClick = () => {
    setModalOpen(true);
    // Note: onClick prop is removed from triggering PaymentModal, handled purely by BuyShareModal
  };

  return (
    <>
      <div className="relative border-2 border-primary rounded-xl p-4 shadow-md flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-blue-50/40">
        {/* Price Badge (top-right) exactly like PricingPlanCard */}
        <div className="absolute top-0 right-0 bg-primary text-white text-xl font-bold px-4 py-2 rounded-bl-xl rounded-tr-xl flex items-center gap-1.5">
          <Star className="w-4 h-4" />
          <span>৳ 5,000</span>
        </div>

        {/* Header */}
        <div className="pr-20 mb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
              Shareholder
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 capitalize leading-tight">
            Buy Share Plan
          </h3>
          <p className="text-gray-500 text-sm mt-1">
            Shareholder Investment: Per Share - ৳ 5,000
          </p>
        </div>

        {/* Breakdown of Shareholder Types (from 1st image) */}
        {/* <div className="bg-white/80 border border-gray-100 rounded-xl p-3.5 mb-4 space-y-2.5">
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Shareholder Classifications
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-start text-xs border-b border-gray-150 pb-1.5">
              <div>
                <span className="font-bold text-gray-800">Type A (Divisional - Director)</span>
                <p className="text-[10px] text-gray-500">500,000 * 8 Seats</p>
              </div>
              <span className="font-bold text-primary">৳ 40,00,000</span>
            </div>

            <div className="flex justify-between items-start text-xs border-b border-gray-150 pb-1.5">
              <div>
                <span className="font-bold text-gray-800">Type B (District - Organizer)</span>
                <p className="text-[10px] text-gray-500">1,00,000 * 64 Seats</p>
              </div>
              <span className="font-bold text-primary">৳ 64,00,000</span>
            </div>

            <div className="flex justify-between items-start text-xs border-b border-gray-150 pb-1.5">
              <div>
                <span className="font-bold text-gray-800">Type C (Thana - Counselor)</span>
                <p className="text-[10px] text-gray-500">50,000 * 650 Seats</p>
              </div>
              <span className="font-bold text-primary">৳ 32,50,000</span>
            </div>

            <div className="flex justify-between items-start text-xs">
              <div>
                <span className="font-bold text-gray-800">Type D (Union - Ambassador)</span>
                <p className="text-[10px] text-gray-500">5,000 * 4500 Seats</p>
              </div>
              <span className="font-bold text-primary">৳ 22,50,000</span>
            </div>
          </div>
        </div> */}

        {/* Feature accordion list */}
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          Benefits & Rights
        </div>
        <ul className="space-y-1 flex-grow">
          {shareFeatures.map((feature, idx) => (
            <ShareFeatureRow key={idx} feature={feature} />
          ))}
        </ul>

        <button
          onClick={handlePurchaseClick}
          className="flex items-center justify-center gap-2 w-full mt-5 py-3 rounded-lg font-bold text-base transition-all shadow-md bg-primary text-white hover:opacity-90 shadow-primary/30"
        >
          <Share2 className="w-4 h-4" />
          Buy Share
        </button>
      </div>

      {/* Buy Share Modal */}
      <BuyShareModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

