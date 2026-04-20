// src/pages/legal/TermsConditions.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TermsCard from '../../components/ui/TermsCard'; // Adjust path if needed

const TermsConditions = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-sans">
      <motion.div 
        className="container mx-auto px-4 max-w-8xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* 1. HEADER SECTION */}
        <motion.div className="mb-12" variants={cardVariants}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Terms and Conditions.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            Welcome to <span className="font-semibold text-gray-900">Golden Life</span>. Before using our services, please carefully review the following Terms and Conditions. By using our platform, you acknowledge that you have read, understood, and agreed to these terms in their entirety.
          </p>
        </motion.div>

        {/* 2. TERMS CARDS SECTION */}
        <div className="space-y-6">
          
          {/* Card 1: Scope of Service */}
          <TermsCard 
            title="Scope of Service"
            variants={cardVariants}
          >
            <p>
              Golden Life provides a digital business and reseller platform aimed at connecting sellers with customers. We agree to provide these services according to the specifications listed on our website and in accordance with standard industry practices.
            </p>
            <p className="mt-4">
              We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice.
            </p>
          </TermsCard>

          {/* Card 2: Copyright and Ownership */}
          <TermsCard 
            title="Copyright and Ownership"
            variants={cardVariants}
          >
            <p>
              The Client acknowledges that all content, logos, trademarks, and data on this website are the property of Golden Life. You may not reproduce, duplicate, copy, sell, or exploit any portion of the Service without express written permission by us.
            </p>
          </TermsCard>

          {/* Card 3: User Obligations */}
          <TermsCard 
            title="User Obligations"
            variants={cardVariants}
          >
            <p>
              As a user of this platform, you agree to provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </TermsCard>
          
          {/* Card 4: Payments & Refunds */}
          <TermsCard 
            title="Payments & Refunds"
            variants={cardVariants}
          >
            <p>
              All payments are due upon receipt. If a payment is not received or payment method is declined, the buyer forfeits the ownership of any items purchased. If no payment is received, no items will be shipped.
            </p>
          </TermsCard>

        </div>

        {/* 3. ACTION BUTTONS AREA */}
        <motion.div 
          className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center gap-4 justify-between"
          variants={cardVariants}
        >
          <p className="text-sm text-gray-500">
            Last updated: <span className="font-medium text-gray-900">February 17, 2026</span>
          </p>

          <div className="flex gap-4">
             {/* Decline / Back Button */}
            <Link 
              to="/" 
              className="px-6 py-3 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors"
            >
              Cancel
            </Link>
            
            {/* ACCEPT BUTTON */}
            <button className="px-8 py-3 bg-[#FF9100] hover:bg-[#E07B00] text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0">
              I Agree to Terms
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default TermsConditions;