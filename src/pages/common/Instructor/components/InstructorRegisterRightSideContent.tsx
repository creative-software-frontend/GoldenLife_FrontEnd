import { motion } from "framer-motion";
import { 
  TrendingUp, Users, BookOpen, Star, Shield, 
  Clock, Award, GraduationCap, Zap, 
  Target, MessageCircle, Layout, Percent
} from "lucide-react";

const InstructorRegisterRightSideContent = () => {
  
  const stats = [
    { value: "50k+", label: "Total Students", icon: Users },
    { value: "500+", label: "Instructors", icon: GraduationCap },
    { value: "1.2k+", label: "Courses", icon: BookOpen },
  ];

  const successStories = [
    {
      name: "Elite Coding Academy",
      owner: "Rahim Ahmed",
      growth: "+312%",
      period: "6 months",
      quote: "Managing 1000+ students became easier with GoldenLife.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Language Hub",
      owner: "Fatema Begum",
      growth: "+245%",
      period: "4 months",
      quote: "The automated enrollment system is a lifesaver.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Creative Design",
      owner: "Hasan Ali",
      growth: "+189%",
      period: "3 months",
      quote: "Exceptional support for course setup.",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    }
  ];

  const benefits = [
    { icon: Percent, title: "Fair Revenue Share", description: "Keep more of what you earn", color: "text-green-400" },
    { icon: Layout, title: "Modern LMS", description: "Advanced teaching tools", color: "text-blue-400" },
    { icon: Zap, title: "Fast Payments", description: "Regular payout cycles", color: "text-yellow-400" },
    { icon: Target, title: "Student Outreach", description: "Market your courses effectively", color: "text-purple-400" }
  ];

  const achievements = [
    { icon: Award, text: "Top Rated Platform", color: "text-orange-400" },
    { icon: Shield, text: "Secure Payments", color: "text-blue-400" },
    { icon: Star, text: "4.9/5 Trust Score", color: "text-yellow-400" }
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
          const Icon = [TrendingUp, Star, Award, Shield, Layout][i % 5];
          return (
            <motion.div
              key={i}
              className="absolute text-indigo-400/20"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: Math.random() * 100 + "%",
                scale: 0
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
          
          {/* Header Badge */}
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
              <Award size={16} />
              Join 500+ Qualified Instructors
              <GraduationCap size={16} />
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <div className="space-y-3">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl font-black text-white leading-tight"
            >
              Share Your
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600"
              >
                Expertise Today
              </motion.span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-xl text-gray-300 leading-relaxed"
            >
              Start your journey as an instructor. Educate thousands and build your personal teaching brand with GoldenLife.
            </motion.p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
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
                  <p className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">{stat.label}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Success Stories */}
          <div className="space-y-3">
            <motion.h3 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              <MessageCircle size={20} className="text-indigo-400" />
              Instructor Stories
            </motion.h3>
            
            <div className="space-y-3">
              {successStories.map((story, index) => (
                <motion.div
                  key={story.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-indigo-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.img
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        src={story.image}
                        alt={story.owner}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                      />
                      <div>
                        <p className="font-semibold text-white">{story.name}</p>
                        <p className="text-sm text-gray-400">{story.owner}</p>
                        <p className="text-xs text-indigo-400 mt-1 italic">"{story.quote}"</p>
                      </div>
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="text-right"
                    >
                      <p className="text-lg font-bold text-green-400">{story.growth}</p>
                      <p className="text-xs text-gray-500">{story.period}</p>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 1.1 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-br from-indigo-500/10 to-transparent p-4 rounded-xl border border-indigo-500/20 hover:border-indigo-500/50 transition-all group"
                >
                  <Icon size={24} className={`${benefit.color} mb-2`} />
                  <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {benefit.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="pt-4 flex items-center gap-6 text-xs text-gray-500"
          >
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={item.text}
                  whileHover={{ color: "#818cf8" }}
                  className="flex items-center gap-1.5"
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

export default InstructorRegisterRightSideContent;
