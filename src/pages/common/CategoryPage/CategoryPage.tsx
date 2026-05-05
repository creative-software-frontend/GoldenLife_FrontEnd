import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Timer, ChevronRight, SearchX } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { ProductCard } from '../ProductCard/ProductCard';
import { useCartStore } from '@/store/cartStore';

const CategoryPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation('global');
    const { addItem } = useCartStore();

    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 30, seconds: 0 });
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

    // 1. TIMER LOGIC
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

    const getAuthConfig = () => {
        const session = sessionStorage.getItem("student_session");
        const token = session ? JSON.parse(session).token : null;
        return {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { X- Auth - Token: `Bearer ${token}`
        })
    }
};
    };

// 2. FETCH PRODUCTS + VENDOR NAMES IN ONE QUERY
const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['categoryProducts', id],
    queryFn: async () => {
        const response = await axios.get(`${baseURL}/api/student/products/category?id=${id}`, getAuthConfig());
        if (response.data?.success || response.data?.status === "success") {
            const rawData: any[] = response.data.data || [];

            // ── Step 1: collect unique vendor IDs ────────────────────────
            const uniqueVendorIds = [...new Set(
                rawData.map((item) => item.vendor_id).filter(Boolean)
            )];

            // ── Step 2: fetch vendor details for each vendor in parallel ─
            const vendorMap: Record<string, any> = {};
            await Promise.all(
                uniqueVendorIds.map(async (vid) => {
                    try {
                        const res = await axios.get(
                            `${baseURL}/api/vendor/details/${vid}`,
                            getAuthConfig()
                        );
                        // API returns: { status, data: { id, businee_name, ... } }
                        const vendor = res.data?.data || res.data || null;
                        if (vendor) vendorMap[String(vid)] = vendor;
                    } catch {
                        // vendor fetch failed — show no store name for this vendor
                    }
                })
            );

            // ── Step 3: normalise each product and attach vendor object ──
            return rawData.map((item: any) => {
                // Build image URL
                let imgUrl: string = item.image || item.product_image || "";
                if (!imgUrl) {
                    imgUrl = "/placeholder.svg";
                } else if (!imgUrl.startsWith("http")) {
                    imgUrl = imgUrl.includes("/")
                        ? `${baseURL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`
                        : `${baseURL}/uploads/ecommarce/product_image/${imgUrl}`;
                }

                // Attach vendor from our lookup map
                const vendor = vendorMap[String(item.vendor_id)] || null;

                return {
                    ...item,
                    product_title_english: item.product_title_english || item.name_en || item.title || "Product",
                    product_title_bangla: item.product_title_bangla || item.name_bn || "",
                    offer_price: Number(item.offer_price || item.price || item.seller_price || 0),
                    regular_price: Number(item.regular_price || item.mrp || 0),
                    product_image: imgUrl,
                    category_name_english: item.category_name_english || item.category_name || "",
                    stock: item.stock ?? item.stock_qty ?? item.quantity ?? 999,
                    vendor_id: item.vendor_id || null,
                    // vendor object with id + businee_name — matches ProductCard expectations
                    vendor,
                };
            });
        }
        return [];
    },
    enabled: !!id
});

const { data: categoryInfo, isLoading: categoryLoading } = useQuery({
    queryKey: ['categoryName', id],
    queryFn: async () => {
        const res = await axios.get(`${baseURL}/api/getProductCategory`, getAuthConfig());
        const categories = res.data?.data?.categories || [];
        const currentCategory = categories.find((cat: any) => String(cat.id) === String(id));
        if (currentCategory) {
            return {
                en: currentCategory.category_name || "",
                bn: currentCategory.category_name_bangla || currentCategory.category_name || ""
            };
        }
        return { en: "", bn: "" };
    },
    enabled: !!id
});

const loading = productsLoading || categoryLoading;
const categoryName = categoryInfo || { en: "", bn: "" };

// 3. CART LOGIC — Add freely; Cart groups by seller_id
const handleAddToCart = (product: any) => {
    const currentVendorId = product.vendor_id || product.vendor?.id || "empty_vendor";

    const name = i18n.language === 'bn'
        ? (product.product_title_bangla || product.product_title_english)
        : product.product_title_english;

    addItem({
        id: Number(product.id),
        name,
        product_title_english: product.product_title_english,
        image: product.product_image,
        quantity: 1,
        offer_price: Number(product.offer_price) || 0,
        regular_price: Number(product.regular_price) || 0,
        vendor_id: currentVendorId,
        type: 'product',
        seller_name: product.vendor?.businee_name || product.seller_name || 'Partner',
        seller_id: currentVendorId
    });
};


if (loading) {
    return (
        <section className="py-6 w-full container mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="h-20 w-full bg-slate-50 animate-pulse border-b border-gray-100" />
                <div className="p-4 md:p-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <ProductCard key={index} isSkeleton={true} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

return (
    <div className="p-4 sm:p-10 bg-[#f9faf9] min-h-screen">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            <div className="bg-gradient-to-r from-[#5ca367] via-[#4a8a54] to-[#3d7044] p-5 md:p-7 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="bg-white/20 backdrop-blur-md text-white px-5 py-2 rounded-full text-sm font-bold tracking-wide border border-white/20">
                        Category Deals
                    </div>

                    <div className="flex items-center gap-2 text-white bg-black/20 px-4 py-1.5 rounded-xl border border-white/10">
                        <Timer className="h-4 w-4" />
                        <div className="flex gap-1 font-mono font-black text-sm md:text-base">
                            <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                            <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                            <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                </div>

                <Link to="/dashboard/allProducts" className="group flex items-center gap-1.5 text-sm font-black text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all border border-white/10">
                    {t('header.allProducts')}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
            </div>

            <div className="p-6 md:p-8">
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0c2a4c] mb-8 uppercase tracking-tight">
                    {i18n.language === 'bn'
                        ? (categoryName.bn || "ক্যাটাগরি পণ্য")
                        : (categoryName.en || "Category Products")
                    }
                    <span className="ml-2 text-[#5ca367]">({products.length})</span>
                </h2>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4  gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                baseURL={baseURL}
                                onAddToCart={() => handleAddToCart(product)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-slate-300">
                        <SearchX className="h-16 w-16 mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-[0.2em] text-sm text-slate-400">Inventory Empty</p>
                    </div>
                )}
            </div>
        </div>

    </div>
);
};

export default CategoryPage;