import { useState, useEffect } from 'react';
import axios from 'axios';
import { PricingPlanCard, SubscriptionPlan } from './PricingPlanCard';
import { CollaborationPanel } from './CollaborationPanel';
import { PaymentModal } from './PaymentModal';
import { CheckoutModal } from './CheckoutModal';
import { baseURL, getAuthToken } from '@/store/utils';

const PlanSkeleton = () => (
  <div className="border-2 border-gray-100 rounded-2xl p-6 animate-pulse h-80">
    <div className="h-5 w-24 bg-gray-200 rounded mb-3" />
    <div className="h-3 w-40 bg-gray-100 rounded mb-6" />
    <div className="h-10 w-32 bg-gray-200 rounded mb-4" />
    <div className="space-y-2.5 mt-6">
      {[1, 2, 3].map(i => <div key={i} className="h-3 w-full bg-gray-100 rounded" />)}
    </div>
    <div className="h-11 w-full bg-gray-200 rounded-xl mt-8" />
  </div>
);

export const SettingsTabs = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<'single' | 'multiple'>('single');

  // Fetch subscription plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = getAuthToken();
        const headers = token ? { 'X-Auth-Token': `Bearer ${token}` } : {};
        const res = await axios.get(`${baseURL}/api/subscription-plans`, { headers });
        if (res.data?.success && Array.isArray(res.data.data)) {
          setPlans(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch subscription plans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const [quantity, setQuantity] = useState(1);

  const handlePlanClick = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setPaymentType('single');
    setQuantity(1);
    setIsPaymentModalOpen(true);
  };

  const handleCollaborationClick = () => {
    setSelectedPlan(null);
    setPaymentType('multiple');
    setQuantity(1);
    setIsPaymentModalOpen(true);
  };

  const handlePayNow = (qty: number) => {
    setQuantity(qty);
    setIsPaymentModalOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white rounded-2xl shadow-sm mt-8 border border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            <PlanSkeleton />
            <PlanSkeleton />
          </>
        ) : plans.length === 0 ? (
          <div className="col-span-2 text-center py-12 text-gray-400">
            No subscription plans available at the moment.
          </div>
        ) : (
          plans.map(plan => (
            <PricingPlanCard key={plan.id} plan={plan} onClick={handlePlanClick} />
          ))
        )}
        <CollaborationPanel onClick={handleCollaborationClick} />
      </div>

      {/* Modals */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPayNow={handlePayNow}
        type={paymentType}
        plan={selectedPlan}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        type={paymentType}
        plan={selectedPlan}
        quantity={quantity}
      />
    </div>
  );
};
