import React from 'react';
import { motion } from 'framer-motion';

const TermsOfUse = () => {
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
                        Terms of Use
                    </motion.h1>
                    <p className="text-lg text-gray-500 font-medium">
                        Please read these terms of use carefully before using our services.
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
                            title: "1. Acceptance of Terms",
                            content: "By accessing or using our website and services, you agree to be bound by these terms. If you do not agree, please do not use our website."
                        },
                        {
                            title: "2. Changes to Terms",
                            content: "We reserve the right to modify these terms at any time. It is your responsibility to review these terms periodically for any changes. Continued use of the site after any changes constitutes acceptance of those changes."
                        },
                        {
                            title: "3. Use of Services",
                            content: "You agree to use our website and services only for lawful purposes. You are prohibited from violating or attempting to violate the security of the site, including accessing data not intended for you or attempting to interfere with service to any user."
                        },
                        {
                            title: "4. User Conduct",
                            content: "You agree not to upload, post, or otherwise distribute any content that is unlawful, defamatory, abusive, or otherwise objectionable as determined by us. We reserve the right to remove any content that violates these terms or is deemed inappropriate at our discretion."
                        },
                        {
                            title: "5. Intellectual Property",
                            content: "All content, trademarks, service marks, and logos are owned by or licensed to us. You may not use any of these materials without our prior written consent."
                        },
                        {
                            title: "6. Limitation of Liability",
                            content: "We are not liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the website or services."
                        },
                        {
                            title: "7. Governing Law",
                            content: "These terms are governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law principles."
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
                        </div>
                    ))}

                    {/* Contact Information */}
                    <div className="pt-8 border-t border-gray-100">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">8. Contact Information</h2>
                        <p className="text-gray-600 mb-4 text-lg">
                            If you have any questions or concerns regarding these terms, please contact us at:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 bg-gray-50 p-6 rounded-2xl">
                            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">@</div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Us</p>
                                    <p className="text-gray-800 font-bold">support@goldenlife.com</p>
                                </div>
                            </div>
                            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold">#</div>
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Call Us</p>
                                    <p className="text-gray-800 font-bold">+1 123-456-7890</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </motion.div>
        </div>
    );
};

export default TermsOfUse;