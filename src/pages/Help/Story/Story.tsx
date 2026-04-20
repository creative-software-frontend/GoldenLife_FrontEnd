import React from 'react';
import { motion } from 'framer-motion';

const StoryPage: React.FC = () => {
    return (
        <div className="min-h-[70vh] bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto space-y-12"
            >
                {/* Introduction */}
                <section className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-3xl md:text-4xl font-black text-gray-800 mb-6 tracking-tight"
                    >
                        About Our Story
                    </motion.h2>
                    
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-8 leading-relaxed space-y-6 text-lg"
                    >
                        <p>
                            Welcome to our story page, where narratives come alive with rich detail and heartfelt expression.
                            We take pride in crafting stories that not only inform but also inspire and resonate with our readers.
                            Every story is designed to provide an immersive experience that transports you into the heart of the narrative.
                        </p>
                        
                        <blockquote className="border-l-4 border-emerald-500 pl-6 py-2 italic text-gray-800 font-medium text-xl bg-emerald-50/50 rounded-r-xl">
                            "Stories are the compass of life; they guide, entertain, and leave an everlasting impact."
                        </blockquote>
                        
                        <p>
                            Our collection ranges from tales of personal triumph and community spirit to profound reflections on
                            life's challenges and triumphs. Whether it's a short anecdote or a detailed journey, each story is
                            carefully curated to touch your heart and mind. The power of storytelling lies in its ability to create
                            connections and inspire change, and we strive to bring that power to you through our stories.
                        </p>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-gray-50/80 p-8 rounded-2xl border border-gray-100"
                    >
                        <h3 className="text-xl font-bold text-gray-800 mb-4">What You'll Discover:</h3>
                        <ul className="space-y-3">
                            {[
                                "Inspirational journeys and real-life stories",
                                "Educational and thought-provoking content",
                                "Personal experiences that resonate with readers"
                            ].map((item, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                    <span className="h-2 w-2 bg-emerald-500 rounded-full mr-3"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </section>
            </motion.div>
        </div>
    );
};

export default StoryPage;
