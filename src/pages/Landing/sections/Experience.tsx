import React from "react";
import { experienceData } from "@/data/experienceData";
import { motion } from "framer-motion";

const Experience: React.FC = () => {
  return (
    <section className="py-24 bg-[#FFF8DC] relative overflow-hidden font-sans w-full">
      
      {/* Background Ambience (Subtle Gradients) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Main Container - Reverted to standard container behavior */}
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Our Journey</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Milestones of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-600">Success</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            From humble beginnings to market leadership, every step defines our commitment to excellence.
          </p>
        </motion.div>

        {/* Timeline Wrapper - Max width reverted to 5xl to match container style */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* VERTICAL LINE (Gradient & Glow) */}
          <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-1 transform md:-translate-x-1/2 rounded-full h-full bg-orange-100/50">
             <motion.div 
               initial={{ height: 0 }}
               whileInView={{ height: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-orange-400 to-yellow-400 shadow-[0_0_15px_rgba(255,145,0,0.6)]"
             ></motion.div>
          </div>

          <div className="space-y-12 md:space-y-16">
            {experienceData.map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center justify-between md:gap-12 ${
                    isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                  }`}
                >
                  
                  {/* Spacer for Desktop */}
                  <div className="hidden md:block w-[45%]"></div>

                  {/* CENTER DOT (Premium Look) */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-20">
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-12 h-12 rounded-full bg-[#FFF8DC] border-4 border-primary flex items-center justify-center shadow-lg"
                      >
                        <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_10px_rgba(255,145,0,0.8)]"></div>
                      </motion.div>
                  </div>

                  {/* CONTENT CARD */}
                  <div className="w-full pl-24 md:pl-0 md:w-[45%]">
                    <div className="group relative bg-white p-8 rounded-3xl shadow-xl border border-orange-100/50 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
                      
                      {/* Connector Line (Desktop Only) */}
                      <div className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-12 h-[2px] bg-orange-200 group-hover:bg-primary transition-colors duration-500 ${
                          isEven ? '-left-12' : '-right-12'
                      }`}></div>

                      {/* Icon Floating Badge */}
                      <div className="absolute -top-6 left-8 bg-gradient-to-br from-primary to-orange-600 p-4 rounded-2xl shadow-lg shadow-orange-500/30 text-white">
                        <item.icon className="w-6 h-6" />
                      </div>

                      {/* Card Content */}
                      <div className="mt-6">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                              {item.year}
                            </span>
                        </div>
                        
                        <h3 className="text-4xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                          {item.count}
                        </h3>
                        <h4 className="text-xl font-bold text-gray-800 mb-4">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {item.description}
                        </p>
                      </div>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Experience;