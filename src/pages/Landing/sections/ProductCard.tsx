import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react"; 
import { baseURL } from "@/store/utils";

interface ProductCardProps {
  product: any; // Using 'any' to match your API response object
  bgColorClass: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

const ProductCard: React.FC<ProductCardProps> = ({ product, bgColorClass }) => {
  const { i18n } = useTranslation();
  
  // 1. Dynamic Language Logic
  const title = i18n.language === 'bn' 
    ? (product.product_title_bangla || product.product_title_english) 
    : product.product_title_english;

  // 2. Correct Image Pathing from your API structure
  const imageUrl = `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`;

  return (
    <Link to={`/dashboard/product/${product.id}`} className="block h-full">
      <motion.div
        variants={itemVariants}
        whileHover={{ 
          y: -10,
          transition: { duration: 0.3, ease: "easeOut" }
        }} 
        className={`${bgColorClass} rounded-2xl p-4 flex flex-col items-center justify-between text-center cursor-pointer shadow-sm hover:shadow-2xl border transition-all duration-300 group h-full relative overflow-hidden`}
      >
        {/* Subtle background pattern/shine on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />

        {/* Image Container - Circular white base */}
        <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 mb-4 overflow-hidden rounded-full bg-white flex items-center justify-center shadow-md group-hover:shadow-inner p-4 transition-all duration-500">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-contain transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500"
            onError={(e) => (e.currentTarget.src = `${baseURL}/uploads/ecommarce/product_image/placeholder.png`)}
            loading="lazy"
          />
        </div>

        {/* Product Information */}
        <div className="relative z-10 flex flex-col items-center flex-grow">
          <h3 className="text-[11px] md:text-sm font-black text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-2">
            {title}
          </h3>

          {/* Pricing Logic if needed on the card */}
          <div className="mt-auto">
            <span className="text-orange-600 font-extrabold text-sm md:text-base">
              ৳{product.offer_price || product.regular_price}
            </span>
          </div>
        </div>
        
        {/* Interactive Indicator */}
        <motion.div 
          className="mt-3 flex items-center gap-1 text-orange-500 text-[10px] md:text-xs font-bold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
        >
          Explore <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </motion.div>
      </motion.div>
    </Link>
  );
};

export default ProductCard;