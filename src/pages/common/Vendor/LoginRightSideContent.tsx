// src/components/vendor/LoginRightSideContent.tsx
import { motion } from "framer-motion";
import { 
  TrendingUp, Users, ShoppingBag, Star, Shield, 
  Clock, BarChart3, HeadphonesIcon, Award, Truck,
  PackageCheck, Zap, Target, MessageCircle 
} from "lucide-react";

const LoginRightSideContent = () => {
  const metrics = [
    { value: "৳50Cr+", label: "Monthly GMV", subLabel: "Gross Merchandise Value", icon: TrendingUp },
    { value: "15k+", label: "Active Sellers", subLabel: "Growing 25% MoM", icon: Users },
    { value: "2.5L+", label: "Daily Customers", subLabel: "Nationwide reach", icon: ShoppingBag },
  ];

  // টেস্টিমোনিয়ালস
  const testimonials = [
    {
      name: "Rahim Ahmed",
      role: "Electronics Seller",
      quote: "Dashboard is super intuitive. Sales tracking is a breeze!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Fatema Begum",
      role: "Fashion Store",
      quote: "Best decision to join GoldenLife. My business grew 200%.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  // ফিচার হাইলাইটস - লুসিড আইকন সহ
  const features = [
    { icon: BarChart3, title: "Real-time Analytics", description: "Track sales & inventory", color: "text-blue-400" },
    { icon: Zap, title: "Fast Settlement", description: "7-day payment cycle", color: "text-yellow-400" },
    { icon: Target, title: "Marketing Tools", description: "Boost your sales", color: "text-green-400" },
    { icon: HeadphonesIcon, title: "24/7 Support", description: "Dedicated help", color: "text-purple-400" }
  ];

  // অ্যাচিভমেন্ট ব্যাজ - লুসিড আইকন সহ
  const achievements = [
    { icon: Award, text: "ISO Certified", color: "text-orange-400" },
    { icon: Shield, text: "256-bit SSL", color: "text-blue-400" },
    { icon: Star, text: "4.8/5 Rating", color: "text-yellow-400" }
  ];

  // দ্রুত পরিসংখ্যান - লুসিড আইকন সহ
  const quickStats = [
    { icon: PackageCheck, value: "50k+", label: "Daily Orders" },
    { icon: Truck, value: "12k+", label: "Active Vendors" },
    { icon: Clock, value: "24/7", label: "Support" }
  ];

  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative h-screen overflow-hidden">
      
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(249, 115, 22, 0.5) 0%, transparent 50%)`,
            backgroundSize: '60px 60px'
          }} 
        />
      </motion.div>

      {/* Floating Particles - Lucide Icons as Particles */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1, duration: 2 }}
      >
        {[...Array(5)].map((_, i) => {
          const Icon = [TrendingUp, Star, Award, Shield, Zap][i % 5];
          return (
            <motion.div
              key={i}
              className="absolute text-orange-500/20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                scale: 0,
                rotate: 0
              }}
              animate={{ 
                y: [null, "-10%"],
                scale: [0, 1, 0],
                rotate: 360,
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 12 + i * 3,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear"
              }}
            >
              <Icon size={24} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Main Content */}
      <div className="relative h-full overflow-y-auto">
        <div className="min-h-full flex flex-col justify-center p-16 space-y-10">
          
          {/* Header Badge with Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-orange-600/20 border border-orange-500/30 rounded-full text-orange-400 text-sm font-bold backdrop-blur-sm inline-flex items-center gap-2"
            >
              <Award size={16} className="text-orange-400" />
              Vendor Dashboard Access
              <Shield size={16} className="text-orange-400" />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-black text-white leading-tight"
            >
              Manage Your
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600"
              >
                Business Growth
              </motion.span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Track orders, manage inventory, and analyze performance - all from one powerful dashboard.
            </motion.p>
          </div>

          {/* Quick Stats Cards with Lucide Icons */}
          <div className="grid grid-cols-3 gap-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-orange-500/30 transition-all group"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-orange-400 mb-2"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <p className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Metrics Grid with Lucide Icons */}
          <div className="grid grid-cols-3 gap-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -3 }}
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-orange-500/30 transition-all group"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-orange-400 mb-2"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <p className="text-xl font-bold text-white group-hover:text-orange-400 transition-colors">
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.subLabel}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Testimonials with Star Icons */}
          <div className="space-y-3">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-lg font-semibold text-white flex items-center gap-2"
            >
              <MessageCircle size={18} className="text-orange-400" />
              What sellers say
            </motion.h3>
            
            <div className="space-y-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-orange-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/50"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 1 + i * 0.1 }}
                            >
                              <Star size={14} className="text-yellow-500 fill-yellow-500" />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{testimonial.role}</p>
                      <p className="text-sm text-gray-300 mt-1 italic">"{testimonial.quote}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Feature Pills with Lucide Icons */}
          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(249, 115, 22, 0.2)" }}
                  className="px-3 py-1.5 bg-white/5 rounded-full border border-white/10 text-sm text-gray-300 flex items-center gap-1.5 cursor-default"
                >
                  <Icon size={14} className={feature.color} />
                  <span className="font-medium">{feature.title}</span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-400">{feature.description}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Indicators with Lucide Icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="pt-4 flex items-center gap-6 text-xs text-gray-500"
          >
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.text}
                  whileHover={{ color: "#f97316" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 cursor-default"
                >
                  <Icon size={14} className={item.color} />
                  {item.text}
                </motion.div>
              );
            })}
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="pt-6 border-t border-white/10 flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={16} className="text-orange-400" />
              <span className="text-sm">Join 15k+ sellers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Truck size={16} className="text-orange-400" />
              <span className="text-sm">Free delivery nationwide</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginRightSideContent;