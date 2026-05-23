import { useState } from 'react';
import { PricingPlanCard } from './PricingPlanCard';
import { CollaborationPanel } from './CollaborationPanel';
import { PaymentModal } from './PaymentModal';
import { CheckoutModal } from './CheckoutModal';

export const SettingsTabs = () => {
  const [activeTab, setActiveTab] = useState<'subscription' | 'sharing'>('subscription');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'single' | 'multiple'>('single');

  const handlePlanClick = () => {
    setPaymentType('single');
    setIsPaymentModalOpen(true);
  };

  const handleCollaborationClick = () => {
    setPaymentType('multiple');
    setIsPaymentModalOpen(true);
  };

  const handlePayNow = () => {
    setIsPaymentModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-sm mt-8 border border-gray-100">
      {/* Tab Header */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('subscription')}
          className={`py-3 px-6 transition-all duration-300 ${activeTab === 'subscription' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Subscription
        </button>
        <button
          onClick={() => setActiveTab('sharing')}
          className={`py-3 px-6 transition-all duration-300 ${activeTab === 'sharing' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Sharing & Access
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'subscription' && <PricingPlanCard onClick={handlePlanClick} />}
        {activeTab === 'sharing' && <CollaborationPanel onClick={handleCollaborationClick} />}
      </div>

      {/* Modals */}
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onPayNow={handlePayNow}
        type={paymentType}
      />
      
      <CheckoutModal 
        isOpen={isCheckoutModalOpen} 
        onClose={() => setIsCheckoutModalOpen(false)} 
        type={paymentType}
      />
    </div>
  );
};
