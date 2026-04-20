import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { howItWorksLeft, howItWorksRight } from "@/data/howItWorksData";

// 1. Combine data
const allSteps = [...howItWorksLeft, ...howItWorksRight];

const HowItWorks: React.FC = () => {
  // 2. State tracks MULTIPLE open IDs
  const [openSteps, setOpenSteps] = useState<number[]>([]);

  const toggleStep = (id: number) => {
    setOpenSteps((prevOpenSteps) =>
      prevOpenSteps.includes(id)
        ? prevOpenSteps.filter((stepId) => stepId !== id) // Close
        : [...prevOpenSteps, id] // Open
    );
  };

  return (
    <section className="py-24 bg-[#FFF8DC] overflow-hidden">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"
          >
            How to Start Business <span className="text-primary">With Us</span>
          </motion.h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            Click on any step to reveal detailed instructions.
          </p>
        </div>

        {/* GRID LAYOUT: Changed max-w-6xl mx-auto -> w-full */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start w-full">
          {allSteps.map((item, index) => {
            const isOpen = openSteps.includes(item.id);

            return (
              <motion.div
                layout 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`rounded-2xl overflow-hidden border transition-all duration-300 self-start ${
                  isOpen 
                    ? "bg-white border-orange-300 shadow-xl ring-4 ring-orange-50/50" 
                    : "bg-white border-transparent shadow-md hover:shadow-lg"
                }`}
              >
                {/* --- QUESTION (Clickable Area) --- */}
                <button
                  onClick={() => toggleStep(item.id)}
                  className="w-full flex items-center gap-5 p-6 text-left"
                >
                  {/* Number Circle */}
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-2xl transition-colors duration-300 ${
                    isOpen 
                      ? "bg-gradient-to-br from-[#FFD768] to-[#FF7F27] text-white shadow-md" 
                      : "bg-[#FFF8DC] text-orange-600 border-2 border-orange-100"
                  }`}>
                    {item.number}
                  </div>

                  {/* Title (From Data) */}
                  <div className="flex-grow">
                    <h3 className={`text-xl font-bold transition-colors ${isOpen ? "text-orange-600" : "text-gray-900"}`}>
                      {item.title}
                    </h3>
                    <span className="text-sm text-gray-400 font-medium">
                      {isOpen ? "Hide details" : "Show details"}
                    </span>
                  </div>

                  {/* Icon */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className={`text-2xl ${isOpen ? "text-orange-500" : "text-gray-300"}`}
                  >
                    ▼
                  </motion.div>
                </button>

                {/* --- ANSWER (Expanded Content) --- */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-8 pt-2">
                        <div className="pl-[4.75rem] border-t border-dashed border-orange-100 pt-4">
                          
                          {/* Map through the 'answers' array from data */}
                          <ul className="space-y-3 mb-4">
                            {item.answers.map((point, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-600 leading-relaxed text-lg">
                                {/* Bullet Dot */}
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                          
                          {/* Link */}
                          <a 
                            href="#" 
                            className="inline-flex items-center text-orange-600 font-semibold hover:text-orange-700 hover:underline transition-colors"
                          >
                            Read full guide &rarr;
                          </a>

                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;