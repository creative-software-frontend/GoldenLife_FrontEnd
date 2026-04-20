import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ServiceCardProps {
  service: {
    id: number;
    icon: LucideIcon;
    title: string;
    description: string;
    linkText: string;
    linkIcon: LucideIcon;
  };
}

// 1. Define Animation Variants for cleaner, synchronized motion
const cardVariants = {
  initial: { y: 0, scale: 1 },
  hover: { y: -8, scale: 1.02, transition: { type: "spring", stiffness: 300, damping: 20 } }
};

const iconVariants = {
  initial: { scale: 1, rotate: 0, backgroundColor: "rgba(255, 247, 237, 1)" }, // orange-50
  hover: { scale: 1.1, rotate: 5, backgroundColor: "rgba(255, 255, 255, 0.2)" } // white/20
};

const arrowVariants = {
  initial: { x: 0 },
  hover: { x: 5, transition: { repeat: Infinity, repeatType: "reverse" as const, duration: 0.6 } }
};

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const Icon = service.icon;
  const LinkIcon = service.linkIcon;

  return (
    <motion.div 
      initial="initial"
      whileHover="hover"
      variants={cardVariants}
      className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-2xl border border-orange-100/60 hover:border-transparent hover:bg-primary transition-colors duration-300 ease-out flex flex-col h-full relative overflow-hidden isolate"
    >
      
      {/* 2. Icon Container - Adds weight and hierarchy */}
      <motion.div 
        variants={iconVariants}
        className="mb-8 w-16 h-16 rounded-2xl flex items-center justify-center text-primary group-hover:text-white transition-colors duration-300"
      >
        <Icon className="w-8 h-8" strokeWidth={1.5} />
      </motion.div>

      {/* Title & Description */}
      <div className="flex-grow z-10 flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300">
          {service.title}
        </h3>
        <p className="text-gray-500 group-hover:text-white/90 text-base leading-relaxed transition-colors duration-300">
          {service.description}
        </p>
      </div>

      {/* Learn More Link */}
      <div className="mt-8 flex items-center text-primary font-bold group-hover:text-white transition-colors duration-300 pt-4 border-t border-dashed border-gray-100 group-hover:border-white/20">
        <span className="mr-3 text-sm uppercase tracking-wide">{service.linkText}</span>
        <motion.div variants={arrowVariants}>
          <LinkIcon className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Decorative Background Elements */}
      {/* Big subtle glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100/50 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 pointer-events-none" />
      
      {/* Bottom accent */}
      <motion.div 
        variants={{
          initial: { opacity: 0, scale: 0.5 },
          hover: { opacity: 1, scale: 1.5 }
        }}
        transition={{ duration: 0.5 }}
        className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none"
      />
    </motion.div>
  );
};

export default ServiceCard;