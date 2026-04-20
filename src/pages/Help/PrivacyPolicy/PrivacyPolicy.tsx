import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-[70vh] bg-transparent py-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto space-y-12"
            >
                {/* Header */}
                <header className="text-center">
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-5xl font-black mb-4 text-gray-800 tracking-tight"
                    >
                        Privacy Policy
                    </motion.h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
                    </p>
                </header>

                {/* Content */}
                <motion.section 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 rounded-[2rem] space-y-10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
                    
                    {[
                        {
                            title: "1. Introduction",
                            content: "We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy policy or our practices with regard to your personal information, please contact us."
                        },
                        {
                            title: "2. Information We Collect",
                            content: "We collect personal information that you voluntarily provide to us when registering on the website, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us.",
                            list: [
                                "Personal information such as name, email address, and contact details.",
                                "Data collected automatically, such as IP addresses and browser details."
                            ]
                        },
                        {
                            title: "3. How We Use Your Information",
                            content: "We use personal information collected via our website for a variety of business purposes described below:",
                            list: [
                                "To provide and maintain our services.",
                                "To contact you and respond to your inquiries.",
                                "To send marketing and promotional communications."
                            ]
                        },
                        {
                            title: "4. Sharing Your Information",
                            content: "We do not share your personal information with third parties without your consent, except as necessary to provide you with our services or to comply with legal obligations."
                        },
                        {
                            title: "5. Security of Your Information",
                            content: "We use administrative, technical, and physical security measures to help protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure."
                        },
                        {
                            title: "6. Your Privacy Rights",
                            content: "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, update, or delete your personal data."
                        }
                    ].map((section, idx) => (
                        <div key={idx} className="group">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                                <span className="h-6 w-1.5 bg-emerald-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                {section.title}
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {section.content}
                            </p>
                            {section.list && (
                                <ul className="mt-4 space-y-2 pl-3 border-l-2 border-emerald-100">
                                    {section.list.map((item, i) => (
                                        <li key={i} className="text-gray-600 flex items-start">
                                            <span className="h-2 w-2 min-w-[8px] bg-emerald-400 rounded-full mr-3 mt-2"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}

                    {/* Contact Information */}
                    <div className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">7. Contact Information</h2>
                        <p className="text-gray-600 mb-4 text-lg">
                            If you have questions or comments about this policy, you may contact us at:
                        </p>
                        <div className="space-y-2 bg-gray-50 p-6 rounded-2xl">
                            <p className="text-gray-800 font-bold flex items-center">
                                <span className="text-gray-500 w-16">Email:</span> 
                                <a href="mailto:support@goldenlife.com" className="text-emerald-600 hover:underline">support@goldenlife.com</a>
                            </p>
                            <p className="text-gray-800 font-bold flex items-center">
                                <span className="text-gray-500 w-16">Phone:</span> 
                                +1 123-456-7890
                            </p>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default PrivacyPolicy;