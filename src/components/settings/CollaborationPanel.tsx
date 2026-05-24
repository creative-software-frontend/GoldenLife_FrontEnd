import { Users, Share2, ShieldCheck } from "lucide-react";

interface CollaborationPanelProps {
  onClick: () => void;
}

export const CollaborationPanel = ({ onClick }: CollaborationPanelProps) => {
  return (
    <div className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 h-full flex flex-col">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Team Collaboration</h3>
      <p className="text-gray-600 mb-6">
        Share access with your team members. Purchase multiple licenses at a discounted rate and manage them from a single dashboard.
      </p>
      
      <div className="space-y-4 mb-8 flex-grow">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary"><Users className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">Multiple Seats</h4>
            <p className="text-sm text-gray-500">Buy licenses in bulk and assign them easily.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="bg-secondary/10 p-2 rounded-lg text-secondary"><ShieldCheck className="w-5 h-5" /></div>
          <div>
            <h4 className="font-semibold text-gray-800">Admin Control</h4>
            <p className="text-sm text-gray-500">Full control over who can access your workspace.</p>
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
