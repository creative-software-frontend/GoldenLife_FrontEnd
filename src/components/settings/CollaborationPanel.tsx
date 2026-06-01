import { Users, Share2, ShieldCheck } from "lucide-react";

interface CollaborationPanelProps {
  onClick: () => void;
}

export const CollaborationPanel = ({ onClick }: CollaborationPanelProps) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Buy Share Plan</h3>
      <p className="text-gray-600 mb-6">
        Golden Life Shareholder Benefits
      </p>

      <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">মালিকানার অংশীদারিত্ব</h4>
            <p className="text-sm text-gray-500">Golden Life Business Platform-এর একজন অংশীদার হিসেবে কোম্পানির নির্ধারিত শেয়ার ধারণের সুযোগ।</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">ব্যবসায়িক সিদ্ধান্তে অংশগ্রহণ</h4>
            <p className="text-sm text-gray-500">কোম্পানির নীতিমালা অনুযায়ী সাধারণ সভা (AGM) বা বিশেষ সভায় মতামত প্রদানের সুযোগ।.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">দীর্ঘমেয়াদী ব্যবসায়িক প্রবৃদ্ধির অংশীদার</h4>
            <p className="text-sm text-gray-500">কোম্পানির বৃদ্ধি ও সম্প্রসারণের সাথে সম্পৃক্ত থাকার সুযোগ।</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">বিশেষ প্রশিক্ষণ ও গাইডলাইন</h4>
            <p className="text-sm text-gray-500">
              ব্যবসা, নেতৃত্ব, মার্কেটিং ও ডিজিটাল দক্ষতা উন্নয়নের জন্য প্রশিক্ষণ সুবিধা।</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">ব্যবসায়িক নেটওয়ার্ক</h4>
            <p className="text-sm text-gray-500">দেশব্যাপী উদ্যোক্তা, বিক্রেতা ও ব্যবসায়িক অংশীদারদের সাথে নেটওয়ার্ক তৈরির সুযোগ।</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">নতুন প্রকল্পে অগ্রাধিকার</h4>
            <p className="text-sm text-gray-500">কোম্পানির নতুন উদ্যোগ, ক্যাম্পেইন বা সম্প্রসারণ কার্যক্রমে অগ্রাধিকারভিত্তিক অংশগ্রহণের সুযোগ।.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">অফিসিয়াল স্বীকৃতি</h4>
            <p className="text-sm text-gray-500">
              কোম্পানির অফিসিয়াল কার্যক্রম, মিটিং, প্রশিক্ষণ ও ইভেন্টে অংশগ্রহণের সুযোগ।
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">সম্ভাব্য লভ্যাংশ</h4>
            <p className="text-sm text-gray-500">
              যদি কোম্পানি লাভ করে এবং পরিচালনা পর্ষদ অনুমোদন দেয়, তাহলে প্রযোজ্য আইন ও কোম্পানির নীতিমালা অনুযায়ী শেয়ারহোল্ডাররা লভ্যাংশ পাওয়ার জন্য বিবেচিত হতে পারেন।
            </p>
          </div>
        </div>

      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center mb-6">
        <div className="text-sm text-gray-500 font-medium mb-1">Starting at</div>
        <div className="flex items-center justify-center gap-2">
          <div className="text-3xl font-bold text-gray-900">৳ 800</div>
          <div className="text-xs text-secondary font-semibold bg-secondary/10 py-1 px-2 rounded-full inline-block">
            Save 20%
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">per user / month</div>
      </div>

      <button
        onClick={onClick}
        className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors w-full mt-auto"
      >
        <Share2 className="w-5 h-5" /> Purchase Team Access
      </button>
    </div>
  );
};
