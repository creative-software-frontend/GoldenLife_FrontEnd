import { motion } from "framer-motion";
import { 
  TrendingUp, Users, BookOpen, Star, Shield, 
  Clock, BarChart3, HeadphonesIcon, Award, GraduationCap,
  Layout, Zap, Target, MessageCircle 
} from "lucide-react";

const InstructorLoginRightSideContent = () => {
  const metrics = [
    { value: "50k+", label: "Active Students", subLabel: "Learning daily", icon: Users },
    { value: "500+", label: "Expert Instructors", subLabel: "Sharing knowledge", icon: GraduationCap },
    { value: "1.2k+", label: "Total Courses", subLabel: "Across all subjects", icon: BookOpen },
  ];

  const testimonials = [
    {
      name: "Dr. Ariful Islam",
      role: "Mathematics Specialist",
      quote: "The instructor dashboard is revolutionary. It makes managing student progress effortless!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Sabina Yasmin",
      role: "English Language Coach",
      quote: "Joining GoldenLife was my best step. I've reached students from every corner of the country.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  ];

  const features = [
    { icon: BarChart3, title: "Detailed Analytics", description: "Monitor course performance", color: "text-blue-400" },
    { icon: Layout, title: "Course Builder", description: "Easy content management", color: "text-yellow-400" },
    { icon: Target, title: "Targeted Audience", description: "Reach relevant students", color: "text-green-400" },
    { icon: HeadphonesIcon, title: "Premium Support", description: "24/7 dedicated assistance", color: "text-purple-400" }
  ];

  const achievements = [
    { icon: Award, text: "Qualified Platform", color: "text-orange-400" },
    { icon: Shield, text: "Data Security", color: "text-blue-400" },
    { icon: Star, text: "4.9/5 Rating", color: "text-yellow-400" }
  ];

  const quickStats = [
    { icon: BookOpen, value: "100+", label: "New Courses Monthly" },
    { icon: Users, value: "25k+", label: "Enrolled Students" },
    { icon: Clock, value: "Lifetime", label: "Access" }
  ];

  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-indigo-950 to-indigo-900 relative h-full overflow-hidden">
      
      {/* Animated Background Pattern */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.5) 0%, transparent 50%)`,
            backgroundSize: '60px 60px'
          }} 
        />
      </motion.div>

      {/* Floating Particles */}
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
              className="absolute text-indigo-400/20"
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 text-sm font-bold backdrop-blur-sm inline-flex items-center gap-2"
            >
              <GraduationCap size={16} className="text-indigo-400" />
              Instructor Portal Login
              <Shield size={16} className="text-indigo-400" />
            </motion.div>
          </motion.div>

          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-black text-white leading-tight"
            >
              Empower Your
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600"
              >
                Inspiration & Growth
              </motion.span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-gray-300 leading-relaxed"
            >
              Create courses, track student success, and expand your reach across the nation with ease.
            </motion.p>
          </div>

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
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all group"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-indigo-400 mb-2"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <p className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

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
                  className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all group"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                    className="text-indigo-400 mb-2"
                  >
                    <Icon size={24} />
                  </motion.div>
                  <p className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {metric.value}
                  </p>
                  <p className="text-sm font-medium text-gray-300">{metric.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{metric.subLabel}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="space-y-3">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-lg font-semibold text-white flex items-center gap-2"
            >
              <MessageCircle size={18} className="text-indigo-400" />
              What instructors say
            </motion.h3>
            
            <div className="space-y-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <motion.img
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500/50"
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

          <div className="flex flex-wrap gap-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(99, 102, 241, 0.2)" }}
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
                  whileHover={{ color: "#818cf8" }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-1.5 cursor-default"
                >
                  <Icon size={14} className={item.color} />
                  {item.text}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLoginRightSideContent;
