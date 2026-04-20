import { BookOpen, Users, Star, Wallet, GraduationCap, TrendingUp } from 'lucide-react';

interface InstructorStatsCardProps {
  balance: number | string;
  totalCourses?: number;
  totalStudents?: number;
  rating?: number;
}

export function InstructorStatsCard({ 
  balance, 
  totalCourses = 0, 
  totalStudents = 0, 
  rating = 0 
}: InstructorStatsCardProps) {
  const numericBalance = typeof balance === 'number' ? balance : parseFloat(balance) || 0;
  
  const stats = [
    {
      icon: Wallet,
      label: 'Total Earnings',
      value: `৳${numericBalance.toLocaleString()}`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      trend: '+12.5%'
    },
    {
      icon: BookOpen,
      label: 'Active Courses',
      value: totalCourses.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+2'
    },
    {
      icon: Users,
      label: 'Total Students',
      value: totalStudents.toLocaleString(),
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      trend: '+154'
    },
    {
      icon: Star,
      label: 'Avg. Rating',
      value: rating > 0 ? `${rating}/5` : '4.8',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      trend: 'New'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-2 group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} className={stat.color} />
            </div>
            <span className={`text-[10px] font-black px-2 py-1 rounded-full ${index % 2 === 0 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
              {stat.trend}
            </span>
          </div>
          
          <h4 className="text-2xl font-black text-gray-900 mb-1">
            {stat.value}
          </h4>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
