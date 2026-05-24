import { useState } from 'react';
import { PricingPlanCard } from './PricingPlanCard';
import { CollaborationPanel } from './CollaborationPanel';
import { PaymentModal } from './PaymentModal';
import { CheckoutModal } from './CheckoutModal';

export const SettingsTabs = () => {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PricingPlanCard onClick={handlePlanClick} />
        <CollaborationPanel onClick={handleCollaborationClick} />
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
