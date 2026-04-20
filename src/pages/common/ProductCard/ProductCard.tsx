"use client";

import React from 'react';
import { ShoppingCart, Zap, Info, Eye } from 'lucide-react'; // Added Info for details
import { Link } from 'react-router-dom';
import useModalStore from '@/store/modalStore';


interface ProductCardProps {
    product?: any;
    baseURL?: string;
    onAddToCart?: (product: any) => void;
    isSkeleton?: boolean;
}

export const ProductCard = ({ product, baseURL, onAddToCart, isSkeleton = false }: ProductCardProps) => {
    const { openBuyNow } = useModalStore();

    if (isSkeleton) {
        return (
            <div className="flex flex-col bg-white rounded-2xl p-3 border border-slate-100 h-full animate-pulse">
                <div className="aspect-[4/3] w-full rounded-xl bg-slate-100 mb-4" />
                <div className="space-y-2 px-1">
                    <div className="h-2 bg-slate-100 rounded-full w-1/4" />
                    <div className="h-4 bg-slate-100 rounded-full w-full" />
                    <div className="h-10 bg-slate-100 rounded-lg w-full mt-4" />
                </div>
            </div>
        );
    }

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openBuyNow(product);
    };

    const discount = Number(product.regular_price) > Number(product.offer_price)
        ? Math.round(((Number(product.regular_price) - Number(product.offer_price)) / Number(product.regular_price)) * 100)
        : 0;

    return (
        <div className="group relative flex flex-col bg-white rounded-[20px] p-3 border border-slate-100 h-full overflow-hidden transition-all duration-500 ease-out hover:bg-emerald-50/30 hover:border-emerald-200 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)]">

            {/* IMAGE SECTION */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] bg-slate-50">
                <img
                    src={product.product_image?.startsWith('http') ? product.product_image : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`}
                    alt={product.product_title_english}
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-in-out group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }}
                />

                {/* --- DETAIL PAGE ICON (Appears on Hover) --- */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                    <Link
                        to={`/dashboard/product/${product.id}`}
                        className="translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white text-slate-700 w-12 h-12 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:scale-110"
                        title="View Details"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-sm z-10">
                        -{discount}%
                    </div>
                )}
            </div>

            {/* INFO SECTION */}
            <div className="flex flex-col pt-3 pb-1 px-1 flex-grow">
                <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate pr-2">
                        {product.category_name_english || product.category || "Product"}
                    </span>
                    {parseInt(product.stock) <= 10 && (
                        <span className="text-[9px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                            Low Stock
                        </span>
                    )}
                </div>

                {product.vendor && (
                    <Link
                        to={`/dashboard/vendor-info/${product.vendor.id || product.vendor_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] sm:text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline mb-1 w-full truncate"
                    >
                        Store: {product.vendor.businee_name}
                    </Link>
                )}

                {/* Clicking Title also goes to details */}
                <Link to={`/dashboard/product/${product.id}`}>
                    <h3 className="line-clamp-2 text-[13px] sm:text-[14px] font-bold text-slate-800 leading-snug min-h-[38px] group-hover:text-emerald-700 transition-colors">
                        {product.product_title_english}
                    </h3>
                </Link>

                <div className="flex flex-col gap-1 mt-2 mb-4">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Member Price:</span>
                        <span className="text-[16px] sm:text-[18px] font-black text-emerald-600">
                            ৳{product.offer_price}
                        </span>
                    </div>
                    {product.regular_price && Number(product.regular_price) > Number(product.offer_price) && (
                        <div className="flex items-center gap-1.5">
                            <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Customer Price:</span>
                            <span className="text-[11px] sm:text-[12px] font-bold text-slate-500 line-through tracking-tight">
                                ৳{product.regular_price}
                            </span>
                        </div>
                    )}
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-auto flex items-center gap-2 w-full pt-1">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            onAddToCart?.(product);
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 sm:h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all active:scale-95"
                    >
                        <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                        <span className="font-bold text-[11px] whitespace-nowrap">Add to Cart</span>
                    </button>

                    <button
                        onClick={handleBuyNow}
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 sm:h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95 shadow-sm shadow-emerald-600/20"
                    >
                        <Zap className=" w-3.5 h-3.5 sm:w-4 sm:h-6 fill-current" />
                        <span className="font-bold text-[11px] whitespace-nowrap">Buy Now</span>
                    </button>
                </div>
            </div>
        </div>
    );
};