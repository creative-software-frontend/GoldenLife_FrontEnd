import React from 'react';
import { motion } from 'framer-motion';

const Payments = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
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
    <div className="bg-gray-50 min-h-screen py-16 font-sans overflow-hidden">
      <motion.div 
        className="container mx-auto px-4 max-w-8xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

        {/* 1. HERO SECTION */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-lg mb-6 text-[#FF9100]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Secure & <span className="text-[#FF9100]">Easy</span> Payments
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            We support a wide range of payment methods to ensure your checkout experience is smooth, secure, and hassle-free.
          </p>
        </motion.div>

        {/* 2. PAYMENT METHODS GRID */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          
          {/* Card 1: Mobile Banking */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-orange-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 bg-[#FF9100] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-6 text-pink-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Banking</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-[40px]">Pay instantly using your favorite mobile wallet.</p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200">bKash</span>
              <span className="px-3 py-1 rounded-md bg-orange-100 text-orange-700 text-xs font-bold border border-orange-200">Nagad</span>
              <span className="px-3 py-1 rounded-md bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200">Rocket</span>
            </div>
          </motion.div>

          {/* Card 2: Cards */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 text-blue-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cards</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-[40px]">We accept all major local and international cards.</p>
             <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">VISA</span>
              <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">Mastercard</span>
              <span className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold border border-gray-200">DBBL</span>
            </div>
          </motion.div>

          {/* Card 3: COD */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
          >
             <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-6 text-green-600">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cash On Delivery</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-[40px]">Pay with cash when the package arrives at your doorstep.</p>
             <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-100">All BD</span>
              <span className="px-3 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold border border-green-100">No Advance</span>
            </div>
          </motion.div>
        </div>

        {/* 3. INSTRUCTION SECTION */}
        <motion.div 
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
        >
           <div>
             <h2 className="text-2xl font-bold text-gray-900 mb-4">How to pay with bKash/Nagad?</h2>
             <p className="text-gray-600 mb-6 leading-relaxed">
               For automatic payment verification, please ensure you use the <strong>"Payment"</strong> option (not Send Money).
             </p>
             <ul className="space-y-4">
               {[
                 "Go to your bKash/Nagad App",
                 "Select 'Payment' option",
                 "Enter our Merchant Number: 0123456789",
                 "Enter your Order ID as Reference",
                 "Enter Counter No: 1"
               ].map((step, index) => (
                 <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                   <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-[#FF9100] flex items-center justify-center text-xs font-bold">
                     {index + 1}
                   </span>
                   {step}
                 </li>
               ))}
             </ul>
           </div>
           
           {/* Security Badge Side */}
           <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4 text-[#FF9100]"
              >
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </motion.div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">100% Secure Payment</h3>
              <p className="text-sm text-gray-500 mb-6">
                Your data is protected with 256-bit SSL encryption. We do not store your card details.
              </p>
              <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-400 uppercase tracking-widest cursor-default">
                SSL Secured
              </button>
           </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Payments;