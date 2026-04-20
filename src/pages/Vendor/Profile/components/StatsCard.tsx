import { Wallet, TrendingUp, Package, Star } from 'lucide-react';

interface StatsCardProps {
  balance: number | string;
  totalOrders?: number;
  rating?: number;
  totalProducts?: number;
}

export function StatsCard({ 
  balance, 
  totalOrders = 0, 
  rating = 0, 
  totalProducts = 0 
}: StatsCardProps) {
  // Convert balance to number and handle undefined/null
  const numericBalance = typeof balance === 'number' ? balance : parseFloat(balance) || 0;
  
  const stats = [
    {
      icon: Wallet,
      label: 'Current Balance',
      value: `৳${numericBalance.toFixed(2)}`,
      color: 'primary-light',
      bgColor: 'bg-primary-light/10'
    },
    {
      icon: Package,
      label: 'Total Products',
      value: totalProducts.toString(),
      color: 'primary-dark',
      bgColor: 'bg-primary-dark/10'
    },
    {
      icon: TrendingUp,
      label: 'Total Orders',
      value: totalOrders.toString(),
      color: '#10B981',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: Star,
      label: 'Seller Rating',
      value: rating > 0 ? `${rating}/5` : 'N/A',
      color: '#F59E0B',
      bgColor: 'bg-amber-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon size={22} style={{ color: stat.color }} />
            </div>
            {index === 0 && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                +2.5%
              </span>
            )}
          </div>
          
          <h4 className="text-2xl font-black text-gray-900 mb-1">
            {stat.value}
          </h4>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
