import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Briefcase, Code, Database, ChevronRight } from 'lucide-react';

const Career = () => {
    const jobs = [
        {
            title: "Frontend Developer",
            icon: Code,
            desc: "Looking for an expert React/TypeScript developer.",
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            title: "Backend Developer",
            icon: Database,
            desc: "Node.js and MongoDB expert wanted.",
            color: "text-emerald-500",
            bg: "bg-emerald-50"
        },
        {
            title: "Product Manager",
            icon: Briefcase,
            desc: "Lead our agile product teams to success.",
            color: "text-purple-500",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-[70vh] bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-16"
            >
                {/* Header */}
                <div className="text-center max-w-2xl mx-auto">
                    <motion.h2 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black mb-4 text-gray-800 tracking-tight"
                    >
                        Current Openings
                    </motion.h2>
                    <p className="text-gray-500 text-lg">Join us and do the best work of your life.</p>
                </div>

                {/* Job Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 border border-gray-100 rounded-3xl shadow-sm bg-white hover:shadow-xl hover:-translate-y-1 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <job.icon size={80} />
                            </div>
                            
                            <div className={`w-14 h-14 ${job.bg} ${job.color} rounded-2xl flex items-center justify-center mb-6`}>
                                <job.icon size={28} />
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-3 text-gray-800">{job.title}</h3>
                            <p className="text-gray-600 mb-8 font-medium">
                                {job.desc}
                            </p>
                            
                            <Link
                                to="#"
                                className="inline-flex items-center text-emerald-600 font-bold group-hover:underline"
                            >
                                View Details 
                                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.section 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 md:p-16 rounded-[2rem] text-center shadow-lg relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <h2 className="text-3xl md:text-5xl font-black mb-6 text-white tracking-tight">Why Work With Us?</h2>
                    <p className="text-emerald-50 mb-10 max-w-2xl mx-auto text-lg leading-relaxed font-medium">
                        We offer a collaborative work environment, competitive salaries, and limitless growth opportunities. Join a company that values innovation above all else.
                    </p>
                    <Link
                        to="/dashboard/help/contact"
                        className="inline-block bg-white text-emerald-700 font-bold px-8 py-4 rounded-xl hover:bg-emerald-50 transition shadow-md active:scale-95"
                    >
                        Contact Us for Opportunities
                    </Link>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default Career;