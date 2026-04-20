"use client";

import { useEffect, useState, useMemo } from "react";
import {
    ChevronLeft, ChevronRight, SearchX,
    Search, Grid3X3, Table as TableIcon
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";
import { VendorMismatchModal } from "@/components/shared/VendorMismatchModal";

export default function AllProduct() {
    const { t, i18n } = useTranslation("global");

    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- FILTER & VIEW STATES ---
    const [search, setSearch] = useState("");
    const [stock, setStock] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState("grid");

    // --- PAGINATION STATE ---
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | string>(12);

    // Vendor Switch State
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<any>(null);

    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try {
            const parsedSession = JSON.parse(session);
            return (new Date().getTime() > parsedSession.expiry) ? null : parsedSession.token;
        } catch (e) { return null; }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const config = {
                headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) }
            };

            const response = await axios.get(`${baseURL}/api/products`, config);
            let rawData = response.data?.data?.products || response.data?.data || [];

            const mappedProducts = rawData.map((item: any) => ({
                ...item,
                id: item.id,
                date: item.created_at ? new Date(item.created_at).getTime() : item.id,
                titleEn: item.product_title_english || item.name_en || "Product",
                titleBn: item.product_title_bangla || item.name_bn || "",
                offer_price: parseFloat(item.offer_price) || parseFloat(item.price) || 0,
                regular_price: parseFloat(item.regular_price) || parseFloat(item.mrp) || 0,
                stock_qty: item.stock || item.quantity || 0,
                status: item.status || 'active',
                product_image: item.product_image?.startsWith("http")
                    ? item.product_image
                    : `${baseURL}/uploads/ecommarce/product_image/${item.product_image}`
            }));

            setProducts(mappedProducts);

        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [baseURL]);

    // --- FILTERING & SORTING ENGINE ---
    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];

        // 1. Search Filter
        if (search) {
            const lowerSearch = search.toLowerCase();
            result = result.filter((p) =>
                p.titleEn.toLowerCase().includes(lowerSearch) ||
                p.titleBn.toLowerCase().includes(lowerSearch) ||
                (p.sku && p.sku.toLowerCase().includes(lowerSearch))
            );
        }

        // 2. Stock Filter
        if (stock !== "all") {
            if (stock === "in_stock") result = result.filter((p) => p.stock_qty > 0);
            if (stock === "out_of_stock") result = result.filter((p) => p.stock_qty <= 0);
        }

        // 3. Sorting
        return result.sort((a, b) => {
            if (sortBy === "newest") return b.date - a.date;
            if (sortBy === "oldest") return a.date - b.date;
            if (sortBy === "lowToHigh") return a.offer_price - b.offer_price;
            if (sortBy === "highToLow") return b.offer_price - a.offer_price;
            return 0;
        });
    }, [products, search, stock, sortBy]);

    useEffect(() => setCurrentPage(1), [search, stock, sortBy]);

    const currentLimit = itemsPerPage === "all" ? filteredAndSortedProducts.length : (itemsPerPage as number);
    const totalPages = currentLimit > 0 ? Math.ceil(filteredAndSortedProducts.length / currentLimit) : 1;
    const indexOfLastItem = currentPage * currentLimit;
    const indexOfFirstItem = indexOfLastItem - currentLimit;
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
            <section className="py-12 container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => <ProductCard key={i} isSkeleton={true} />)}
                </div>
            </section>
        );
    }

    return (
        <section className="py-8 w-full container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                {/* 1. Header */}
                <div className="bg-gradient-to-br from-[#2d5a35] via-[#4d8b59] to-[#5ca367] p-8 text-white">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight mb-1">{t("header.allProducts", "Premium Collection")}</h1>
                            <p className="text-white/70 text-sm font-medium">Displaying {filteredAndSortedProducts.length} items</p>
                        </div>
                    </div>
                </div>

                {/* 2. Control Panel (Perfect Design Match: Integrated Middle Search) */}
                <div className="p-4 sm:p-8 border-b border-slate-100 bg-slate-50/40 backdrop-blur-sm relative overflow-hidden group/panel">
                    {/* Decorative element */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col xl:flex-row items-center gap-6">

                            {/* Left Filters - Availability */}
                            <div className="flex items-center gap-4 w-full xl:w-auto">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block whitespace-nowrap">Filter By</span>
                                <select
                                    value={stock}
                                    onChange={(e) => setStock(e.target.value)}
                                    className="h-12 w-full sm:w-[180px] px-6 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer hover:border-emerald-300 shadow-sm appearance-none"
                                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                >
                                    <option value="all">All Availability</option>
                                    <option value="in_stock">In Stock Only</option>
                                    <option value="out_of_stock">Out of Stock</option>
                                </select>
                            </div>

                            {/* CENTER SEARCH - The Focal Point */}
                            <div className="flex-1 w-full max-w-2xl group mx-auto order-first xl:order-none">
                                <div className="relative flex items-center">
                                    <div className="absolute left-3 p-2.5 bg-emerald-50 text-emerald-600 rounded-full group-focus-within:bg-emerald-600 group-focus-within:text-white transition-all duration-300">
                                        <Search size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Search across our premium collection..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full pl-16 pr-12 h-14 rounded-full border border-slate-200 bg-white focus:outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 text-sm font-medium transition-all shadow-sm placeholder:text-slate-300"
                                    />
                                    {search && (
                                        <button
                                            onClick={() => setSearch('')}
                                            className="absolute right-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-rose-500 transition-all"
                                        >
                                            <SearchX size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right Filters & View Toggles */}
                            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto justify-center">
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest hidden sm:block whitespace-nowrap">Sort By</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="h-12 w-full sm:w-[180px] px-6 rounded-full border border-slate-200 bg-white text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all cursor-pointer hover:border-emerald-300 shadow-sm appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1rem' }}
                                    >
                                        <option value="newest">Latest Arrivals</option>
                                        <option value="oldest">Classic First</option>
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
                <div className="p-8 bg-slate-50/30">
                    {currentProducts.length > 0 ? (
                        <>
                            {viewMode === 'grid' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                                    {currentProducts.map((product) => (
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
                                <div className="mb-10 w-full overflow-x-auto bg-white rounded-xl border border-slate-200">
                                    <table className="w-full text-left text-sm text-slate-600 whitespace-nowrap">
                                        <thead className="bg-slate-50 text-slate-800 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-6 py-4">Image</th>
                                                <th className="px-6 py-4">Product Details</th>
                                                <th className="px-6 py-4">RP</th>
                                                <th className="px-6 py-4">OP</th>
                                                <th className="px-6 py-4">Stock</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentProducts.map((product) => (
                                                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                                    <td className="px-6 py-4">
                                                        <img src={product.product_image} alt="product" className="w-12 h-12 rounded-lg object-cover border" />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800">{product.titleEn}</div>
                                                        {product.sku && <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">SKU: {product.sku}</div>}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 line-through">৳{product.regular_price}</td>
                                                    <td className="px-6 py-4 font-black text-emerald-600 text-base">৳{product.offer_price}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${product.stock_qty > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                                            {product.stock_qty > 0 ? `${product.stock_qty} In Stock` : 'Out of Stock'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 pt-10 border-t border-slate-200/60">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-slate-600" />
                                    </button>

                                    <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-2xl border border-slate-200">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-9 h-9 rounded-xl font-black text-xs transition-all ${currentPage === page
                                                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                                                    : "hover:bg-slate-100 text-slate-500"
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-32 flex flex-col items-center justify-center text-center">
                            <div className="bg-slate-100 p-8 rounded-[3rem] mb-6 shadow-sm">
                                <SearchX className="h-16 w-16 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                We couldn't find any products matching your current filters. Try adjusting your search or clearing the filters.
                            </p>
                            <button
                                onClick={() => { setSearch(''); setStock('all'); }}
                                className="mt-6 px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                Clear All Filters
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