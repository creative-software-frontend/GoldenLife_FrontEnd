import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Timer, ChevronRight, SearchX } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { ProductCard } from '../ProductCard/ProductCard';
import { useCartStore } from '@/store/cartStore';
import { VendorMismatchModal } from '@/components/shared/VendorMismatchModal';

const CategoryPage = () => {
    const { id } = useParams();
    const { t, i18n } = useTranslation('global');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // 2. FETCH DATA WITH NORMALIZATION
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                const session = sessionStorage.getItem("student_session");
                const token = session ? JSON.parse(session).token : null;

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                };

                const response = await axios.get(`${baseURL}/api/student/products/category?id=${id}`, config);

                if (response.data?.success || response.data?.status === "success") {
                    const rawData = response.data.data || [];

                    // --- CENTRALIZED URL & PRICE CLEANUP ---
                    const mappedData = rawData.map((item: any) => {
                        let imgUrl = item.product_image || item.image;

                        if (!imgUrl) {
                            imgUrl = "/placeholder.svg";
                        } else if (!imgUrl.startsWith("http")) {
                            if (!imgUrl.includes("/")) {
                                imgUrl = `${baseURL}/uploads/ecommarce/product_image/${imgUrl}`;
                            } else {
                                imgUrl = `${baseURL}${imgUrl.startsWith("/") ? "" : "/"}${imgUrl}`;
                            }
                        }

                        return {
                            ...item,
                            product_title_english: item.product_title_english || item.name_en || "Product",
                            product_title_bangla: item.product_title_bangla || item.name_bn || "",
                            offer_price: item.offer_price || item.price || item.seller_price || 0,
                            regular_price: item.regular_price || item.mrp || 0,
                            product_image: imgUrl // Absolute URL mapped correctly for ProductCard
                        };
                    });

                    setProducts(mappedData);
                }
            } catch (error) {
                console.error("Error fetching category products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCategoryProducts();
    }, [id, baseURL]);

    const { cartItems, addItem, clearCart } = useCartStore();
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
    const [pendingProduct, setPendingProduct] = useState<any>(null);

    // 3. CART LOGIC
    const handleAddToCart = (product: any) => {
        const currentVendorId = product.vendor_id || product.vendor?.id || "empty_vendor";

        // Vendor Check using Zustand state
        if (cartItems.length > 0) {
            const firstCartItemVendorId = cartItems[0].vendor_id || "empty_store";
            if (String(firstCartItemVendorId) !== String(currentVendorId)) {
                setPendingProduct(product);
                setIsVendorModalOpen(true);
                return;
            }
        }

        const name = i18n.language === 'bn'
            ? (product.product_title_bangla || product.product_title_english)
            : product.product_title_english;

        addItem({
            id: Number(product.id),
            name,
            product_title_english: product.product_title_english,
            image: product.product_image,
            quantity: 1,
            offer_price: Number(product.offer_price) || 0, // Member Price
            regular_price: Number(product.regular_price) || 0, // Customer Price
            vendor_id: currentVendorId,
            type: 'product'
        });
    };

    const handleConfirmVendorSwitch = () => {
        if (!pendingProduct) return;
        const name = i18n.language === 'bn' 
            ? (pendingProduct.product_title_bangla || pendingProduct.product_title_english) 
            : pendingProduct.product_title_english;
        const currentVendorId = pendingProduct.vendor_id || pendingProduct.vendor?.id;
        
        clearCart();
        addItem({
            id: Number(pendingProduct.id),
            name,
            product_title_english: pendingProduct.product_title_english,
            image: pendingProduct.product_image,
            quantity: 1,
            offer_price: Number(pendingProduct.offer_price) || 0,
            regular_price: Number(pendingProduct.regular_price) || 0,
            vendor_id: currentVendorId,
            type: 'product'
        });

        setIsVendorModalOpen(false);
        setPendingProduct(null);
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

            <VendorMismatchModal
                isOpen={isVendorModalOpen}
                onClose={() => { setIsVendorModalOpen(false); setPendingProduct(null); }}
                onConfirm={handleConfirmVendorSwitch}
            />
        </div>
    );
};

export default CategoryPage;