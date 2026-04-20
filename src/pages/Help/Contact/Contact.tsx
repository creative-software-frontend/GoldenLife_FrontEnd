import React from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-[70vh] bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto space-y-16"
            >
                {/* Hero Section */}
                <section className="text-center max-w-3xl mx-auto">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-black mb-6 text-gray-800 tracking-tight"
                    >
                        Get in Touch
                    </motion.h1>
                    <p className="text-lg text-gray-500 font-medium leading-relaxed">
                        We would love to hear from you. Whether you have a question, feedback, or just want to say hello,
                        reach out to us and we'll get back to you as soon as possible.
                    </p>
                </section>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Information Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {[
                            { icon: Phone, title: "Phone", info: "+1 123-456-7890", color: "text-blue-500", bg: "bg-blue-50" },
                            { icon: Mail, title: "Email", info: "support@goldenlife.com", color: "text-emerald-500", bg: "bg-emerald-50" },
                            { icon: MapPin, title: "Address", info: "123 Golden Life Street, City", color: "text-purple-500", bg: "bg-purple-50" }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="flex items-center p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`w-12 h-12 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shrink-0 mr-4`}>
                                    <item.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">{item.title}</h3>
                                    <p className="font-bold text-gray-800">{item.info}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <motion.section 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2 bg-white p-8 md:p-10 shadow-sm border border-gray-100 rounded-[2rem]"
                    >
                        <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center gap-2">
                            Send a Message
                        </h2>
                        
                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="John Doe"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="john@example.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    placeholder="How can we help?"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    placeholder="Write your message here..."
                                    rows={5}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </motion.section>
                </div>
            </motion.div>
        </div>
    );
};

export default Contact;