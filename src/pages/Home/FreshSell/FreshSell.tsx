"use client";

import { useEffect, useState, useMemo } from "react";
import {
    ChevronRight, Timer, SearchX, Loader2,
    Search, Grid3X3, Table as TableIcon
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/store/useAppStore";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";
import { VendorMismatchModal } from "@/components/shared/VendorMismatchModal";

export default function FreshSell() {
    const { t, i18n } = useTranslation('global');
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });

    // --- STORE ---
    const {
        allProducts: products,
        isProductLoading: loading,
        fetchProducts
    } = useAppStore();

    // --- FILTER & VIEW STATES ---
    const [search, setSearch] = useState("");
    const [stock, setStock] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    // Vendor Switch State
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<any>(null);

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("q");
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // Timer Logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Products via Store
    useEffect(() => {
        fetchProducts(keyword || "");
    }, [keyword, fetchProducts]);

    // Filtering & Sorting
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter(p =>
                p.titleEn.toLowerCase().includes(lowerSearch) ||
                p.titleBn.toLowerCase().includes(lowerSearch)
            );
        }

        if (stock !== "all") {
            if (stock === "in_stock") result = result.filter(p => p.stock_qty > 0);
            if (stock === "out_of_stock") result = result.filter(p => p.stock_qty <= 0);
        }

        return result.sort((a, b) => {
            if (sortBy === "newest") return b.date - a.date;
            if (sortBy === "oldest") return a.date - b.date;
            if (sortBy === "lowToHigh") return a.offer_price - b.offer_price;
            if (sortBy === "highToLow") return b.offer_price - a.offer_price;
            return 0;
        }).slice(0, 10);
    }, [products, search, stock, sortBy]);

    const handleAddToCart = (product: any) => {
        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const currentVendorId = (product as any).vendor_id || (product as any).vendor?.id || "empty_vendor";

        // Vendor Check
        if (existingCart.length > 0) {
            const firstCartItemVendorId = existingCart[0].vendor_id || existingCart[0].vendor?.id || "empty_store";
            if (String(firstCartItemVendorId) !== String(currentVendorId)) {
                setPendingProduct(product);
                setIsVendorModalOpen(true);
                return;
            }
        }

        const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);
        const name = i18n.language === 'bn' ? (product.titleBn || product.titleEn) : product.titleEn;

        if (existingIndex !== -1) {
            existingCart[existingIndex].quantity += 1;
        } else {
            existingCart.push({ ...product, name, image: product.product_image, quantity: 1, vendor_id: currentVendorId });
        }
        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleConfirmVendorSwitch = () => {
        if (!pendingProduct) return;
        const name = i18n.language === 'bn' ? (pendingProduct.titleBn || pendingProduct.titleEn) : pendingProduct.titleEn;
        const currentVendorId = pendingProduct.vendor_id || pendingProduct.vendor?.id;
        const newCart = [{ ...pendingProduct, name, image: pendingProduct.product_image, quantity: 1, vendor_id: currentVendorId }];
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
        setIsVendorModalOpen(false);
        setPendingProduct(null);
    };

    if (loading) {
        return (
            <section className="py-6 w-full container mx-auto px-4 sm:px-6">
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                    <div className="h-20 w-full bg-slate-50 animate-pulse border-b border-gray-100" />
                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} isSkeleton={true} />)}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 w-full container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {/* 1. Gradient Header with Timer */}
                <div className="bg-gradient-to-br from-[#2d5a35] via-[#4d8b59] to-[#5ca367] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex flex-col items-center md:items-start gap-2">
                            <h2 className="text-3xl font-black tracking-tight italic">
                                {keyword ? `Results: ${keyword}` : t('sections.freshSell', 'Flash Fresh Deals')}
                            </h2>
                            <div className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
                                Limited Time Collection
                            </div>
                        </div>

                        {!keyword && (
                            <div className="flex items-center gap-6 bg-black/20 backdrop-blur-xl px-8 py-4 rounded-3xl border border-white/10 shadow-inner group">
                                <Timer className="h-6 w-6 text-emerald-300 group-hover:rotate-12 transition-transform" />
                                <div className="flex gap-4 font-mono font-black text-2xl">
                                    <div className="flex flex-col items-center">
                                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className="text-[8px] uppercase tracking-tighter opacity-50 -mt-1">HRS</span>
                                    </div>
                                    <span className="opacity-30 animate-pulse">:</span>
                                    <div className="flex flex-col items-center">
                                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className="text-[8px] uppercase tracking-tighter opacity-50 -mt-1">MIN</span>
                                    </div>
                                    <span className="opacity-30 animate-pulse">:</span>
                                    <div className="flex flex-col items-center text-emerald-300">
                                        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className="text-[8px] uppercase tracking-tighter opacity-50 -mt-1 text-white/50">SEC</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <Link to="/dashboard/allProducts" className="group flex items-center gap-3 text-xs font-black text-white bg-white/10 hover:bg-emerald-500 px-8 py-3.5 rounded-2xl transition-all border border-white/20 shadow-lg">
                            {t('header.allProducts', 'VIEW ALL SERIES')}
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>
                </div>

                {/* 2. Control Panel (Perfect Design Match: Integrated Middle Search) */}
                <div className="p-4 sm:p-8 border-b border-slate-100 bg-slate-50/40 backdrop-blur-sm relative">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col xl:flex-row items-center gap-6">

                            <div className="flex items-center gap-4 w-full xl:w-auto">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block whitespace-nowrap">Filter By</span>
                                <select
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="h-12 w-full sm:w-[180px] px-6 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer hover:border-emerald-300 shadow-sm appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="all">Availability</option>
                                    <option value="in_stock">In Stock</option>
                                    <option value="out_of_stock">Out Stock</option>
                                </select>
                            </div>

                            <div className="flex-1 w-full max-w-2xl group mx-auto order-first xl:order-none">
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 p-2.5 bg-emerald-50 text-emerald-600 rounded-full group-focus-within:bg-emerald-600 group-focus-within:text-white transition-all duration-300">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search deals..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-16 pr-12 h-14 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm font-medium transition-all shadow-sm placeholder:text-slate-300"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-center">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block whitespace-nowrap">Sort By</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="h-12 w-full sm:w-[180px] px-6 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer hover:border-emerald-300 shadow-sm appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="lowToHigh">Price: Low to High</option>
                                        <option value="highToLow">Price: High to Low</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-slate-200 shadow-sm ml-auto sm:ml-0 overflow-hidden">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-5 py-2.5 rounded-full text-[10px] font-black transition-all flex items-center gap-2 ${viewMode === 'grid'
                                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Grid3X3 size={16} /> GRID
                                    </button>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`px-5 py-2.5 rounded-full text-[10px] font-black transition-all flex items-center gap-2 ${viewMode === 'table'
                                            ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20'
                                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <TableIcon size={16} /> TABLE
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 3. Product Display */}
                <div className="p-8 bg-slate-50/30 min-h-[400px]">
                    {filteredAndSortedProducts.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {filteredAndSortedProducts.map((product: any) => (
                                        <div key={product.id} className="transition-transform duration-300 hover:-translate-y-2">
                                            <ProductCard
                                                product={product}
                                                baseURL={baseURL}
                                                onAddToCart={() => handleAddToCart(product)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full overflow-x-auto bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-5">Product</th>
                                                <th className="px-6 py-5">Details</th>
                                                <th className="px-6 py-5">Price</th>
                                                <th className="px-6 py-5">Stock Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredAndSortedProducts.map((product: any) => (
                                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                                            <img src={product.product_image} alt="product" className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-black text-slate-800 text-sm italic">{product.titleEn}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{t('common.sku', 'SKU')}: {product.sku || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-emerald-600 font-black text-lg italic">৳{product.offer_price}</div>
                                                        {product.regular_price > product.offer_price && (
                                                            <div className="text-[10px] text-slate-300 line-through">৳{product.regular_price}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${product.stock_qty > 0 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                                                            {product.stock_qty > 0 ? `${product.stock_qty} Available` : 'Waitlist'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-24 flex flex-col items-center justify-center text-center">
                            <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 mb-8">
                                <SearchX className="h-20 w-20 text-slate-200" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight italic mb-2">No Matching Series</h3>
                            <p className="text-slate-400 text-sm font-bold tracking-tight max-w-xs mx-auto">
                                We couldn't find any premium deals matching your current filter profile.
                            </p>
                            <button
                                onClick={() => { setSearch(''); setStock('all'); setSortBy('newest'); }}
                                className="mt-8 px-10 py-3 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all uppercase tracking-widest text-xs"
                            >
                                Reset Collection
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <VendorMismatchModal
                isOpen={isVendorModalOpen}
                onClose={() => { setIsVendorModalOpen(false); setPendingProduct(null); }}
                onConfirm={handleConfirmVendorSwitch}
            />

        </section>
    );
}
