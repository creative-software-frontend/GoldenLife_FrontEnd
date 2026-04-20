import React from 'react';
import { motion } from 'framer-motion';
import CookieCard from '../../components/ui/CookieCard'; // Adjust path if needed

const Cookies = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Delay between each item loading
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-white min-h-screen py-16 overflow-hidden">
      <motion.div 
        className="container mx-auto px-4 max-w-8xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 1. HERO SECTION */}
        <motion.div className="text-center mb-16 space-y-4" variants={itemVariants}>
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-[#FF9100] mb-4"
            whileHover={{ scale: 1.1, rotate: 180 }}
            transition={{ duration: 0.5 }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </motion.div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Cookie Policy</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Transparency is key. We want you to understand exactly how and why we use cookies to improve your experience on Golden Life.
          </p>
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Last Updated: February 2026</p>
        </motion.div>

        {/* 2. INTRO CONTENT */}
        <motion.div 
          className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg mb-12"
          variants={itemVariants}
        >
          <p>
             Cookies are small text files stored on your device when you visit our site. They help us remember your preferences, keep your shopping cart updated, and understand how you use our platform.
          </p>
        </motion.div>

        {/* 3. VISUAL GRID */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <CookieCard 
              title="Essential Cookies" 
              desc="Strictly necessary for the website to function. They enable core functionality such as security, network management, and accessibility. You cannot turn these off."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <CookieCard 
              title="Performance & Analytics" 
              desc="These help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our speed and content."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" /></svg>}
            />
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <CookieCard 
              title="Functionality" 
              desc="These cookies allow the website to remember choices you make (such as your user name, language or the region you are in) and provide enhanced features."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>}
            />
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
            <CookieCard 
              title="Advertising" 
              desc="We use these to make advertising messages more relevant to you. They perform functions like preventing the same ad from reappearing continuously."
              icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>}
            />
          </motion.div>
        </div>

        {/* 4. CONTROL & CONTACT SECTION */}
        <motion.div 
          className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-100"
          variants={itemVariants}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Managing Your Cookies</h3>
              <p className="text-gray-600 mb-6">
                Most browsers allow you to refuse to accept cookies and to delete cookies. The methods for doing so vary from browser to browser, and from version to version.
              </p>
              <button className="text-[#FF9100] font-semibold hover:text-orange-700 transition flex items-center gap-2">
                Learn how to manage cookies <span>&rarr;</span>
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Have Questions?</h3>
              <p className="text-gray-600 mb-6">
                If you have any questions about our use of cookies or other technologies, please don't hesitate to reach out.
              </p>
              <a href="mailto:info@goldenlife.com" className="inline-block bg-white border border-gray-200 text-gray-900 px-6 py-3 rounded-lg font-medium hover:border-[#FF9100] hover:text-[#FF9100] transition-colors">
                Contact Support
              </a>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Cookies;