import React from "react";
import { motion } from "framer-motion";
import { servicesData } from "@/data/servicesData";

import { ArrowRight } from "lucide-react";
import ServiceCard from "./ServiceCard";

const Services: React.FC = () => {
  return (
    <section className="py-24 bg-[#FFF8DC] relative overflow-hidden">
      
      {/* Background Decorator Blurs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-200/30 rounded-full filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-yellow-200/30 rounded-full filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header with "Get Started" Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="text-left mb-8 md:mb-0 md:max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Our <span className="text-primary">Services</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Unlock endless business and income opportunities through our comprehensive platform.
            </motion.p>
          </div>
          
          {/* "Get Started" Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Get Started <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Services Grid (3x4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;