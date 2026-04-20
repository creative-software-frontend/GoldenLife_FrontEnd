import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // <-- Added useNavigate
import {
    ShoppingCart, Heart, Minus, Plus, Star,
    CheckCircle, ChevronLeft, ChevronRight, Zap, Store
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useModalStore from '@/store/modalStore';
import { VendorMismatchModal } from "@/components/shared/VendorMismatchModal";
import { log } from "util";

// --- INTERFACES ---
interface GalleryItem {
    id: number;
    product_id: string;
    gal_img: string;
}

interface Product {
    id: number;
    product_title_english: string;
    product_title_bangla: string;
    product_image: string;
    stock: string;
    seller_price: string;
    regular_price: string;
    offer_price: string;
    short_description_english: string;
    short_description_bangla: string;
    long_description_english: string;
    long_description_bangla: string;
    sku: string;
    video_link?: string;
}

const TABS = [
    { id: "features", label: "Features" },
    { id: "price", label: "Price" },
    { id: "short_desc", label: "Short Description" },
    { id: "long_desc", label: "Long Description" },
    { id: "reviews", label: "Reviews", badge: 275 }
];

export default function ProductDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate(); // <-- Initialize navigate
    const { t, i18n } = useTranslation("global");
    const { openBuyNow } = useModalStore();

    // --- STATE ---
    const [product, setProduct] = useState<Product | null>(null);
    const [gallery, setGallery] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("long_desc");

    // Slider State
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    // Vendor Switch State
    const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);

    // --- API & IMAGE PATHS ---
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';
    const mainImgBase = `${baseURL}/uploads/ecommarce/product_image/`;
    const galleryImgBase = `${baseURL}/uploads/ecommarce/gal_img/`;

    const getAuthToken = () => {
        const session = sessionStorage.getItem("student_session");
        if (!session) return null;
        try { return JSON.parse(session).token; } catch (e) { return null; }
    };

    // --- FETCH DATA ---
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = getAuthToken();
                const config = { headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) } };

                const response = await axios.get(`${baseURL}/api/products/${id}`, config);
                const data = response.data?.data;

                if (data?.product) {
                    let productData;
                    if (Array.isArray(data.product)) {
                        productData = data.product.find((p: any) => String(p.id) === String(id)) || data.product[0];
                    } else {
                        productData = data.product;
                    }

                    // FALLBACK: If the single product API omits vendor_id, fetch it from the full list
                    if (!productData.vendor_id) {
                        try {
                            const allProductsRes = await axios.get(`${baseURL}/api/products`);
                            const allProductsList = allProductsRes.data?.data?.products || allProductsRes.data?.data || [];
                            const match = allProductsList.find((p: any) => String(p.id) === String(id));
                            if (match && match.vendor_id) {
                                productData.vendor_id = match.vendor_id;
                            }
                        } catch (e) {
                            console.error("Failed to fetch fallback vendor ID", e);
                        }
                    }

                    setProduct(productData);
                }

                if (data?.gallery && Array.isArray(data.gallery)) {
                    setGallery(data.gallery);
                }

            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    // --- HANDLERS ---
    // --- HANDLERS ---
    const addToCart = () => {
        if (!product) return;

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const currentVendorId = (product as any).vendor_id || (product as any).vendor?.id || "empty_vendor";

        // Vendor Check
        if (existingCart.length > 0) {
            const firstCartItemVendorId = existingCart[0].vendor_id || existingCart[0].vendor?.id || "empty_store";
            if (String(firstCartItemVendorId) !== String(currentVendorId)) {
                setIsVendorModalOpen(true);
                return;
            }
        }

        const existingIndex = existingCart.findIndex((item: any) => item.id === product.id);
        const name = i18n.language === 'bn' ? (product.product_title_bangla || product.product_title_english) : product.product_title_english;

        if (existingIndex !== -1) {
            existingCart[existingIndex].quantity += quantity;
        } else {
            existingCart.push({
                ...product,
                name,
                image: product.product_image?.startsWith('http') ? product.product_image : `${mainImgBase}${product.product_image}`,
                quantity: quantity,
                vendor_id: currentVendorId
            });
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const handleConfirmVendorSwitch = () => {
        if (!product) return;

        const name = i18n.language === 'bn' ? (product.product_title_bangla || product.product_title_english) : product.product_title_english;
        const currentVendorId = (product as any).vendor_id || (product as any).vendor?.id;

        const cartItem = {
            ...product,
            name,
            image: product.product_image?.startsWith('http') ? product.product_image : `${mainImgBase}${product.product_image}`,
            quantity: quantity,
            vendor_id: currentVendorId
        };

        const newCart = [cartItem];
        localStorage.setItem("cart", JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
        setIsVendorModalOpen(false);
    };

    // <-- NEW: Handle Buy Now -->
    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openBuyNow(product);
    };


    // --- DERIVED DATA ---
    const isBangla = i18n.language === 'bn';
    const title = product ? (isBangla ? product.product_title_bangla : product.product_title_english) : "";
    const shortDesc = product ? (isBangla ? product.short_description_bangla : product.short_description_english) : "";
    const longDesc = product ? (isBangla ? product.long_description_bangla : product.long_description_english) : "";

    const currentPrice = product ? parseFloat(product.offer_price || product.regular_price || product.seller_price) : 0;
    const regularPrice = product ? parseFloat(product.regular_price) : 0;
    const hasDiscount = regularPrice > currentPrice;
    const discountPercent = hasDiscount ? Math.round(((regularPrice - currentPrice) / regularPrice) * 100) : 0;
    const currentStock = product ? parseInt(product.stock) : 0;

    const allImages = product ? [
        `${mainImgBase}${product.product_image}`,
        ...gallery.map(img => `${galleryImgBase}${img.gal_img}`)
    ] : [];

    const nextSlide = () => setActiveSlideIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setActiveSlideIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (!isHovered && allImages.length > 1) {
            interval = setInterval(() => {
                nextSlide();
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isHovered, allImages.length, activeSlideIndex]);


    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
        </div>
    );

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
            <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
            <Link to="/dashboard/allProducts" className="text-orange-600 hover:underline">Return to Shop</Link>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="bg-gray-50/50 min-h-screen pt-4 pb-12"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                <nav className="flex mb-6 text-xs sm:text-sm text-gray-500 font-medium overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
                    <Link to="/dashboard" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <Link to="/dashboard/allProducts" className="hover:text-orange-600 transition-colors">Products</Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-900 truncate max-w-[150px] sm:max-w-xs">{title}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

                        <div className="lg:col-span-5 p-4 sm:p-6 lg:p-8 bg-white flex flex-col items-center lg:border-r border-gray-100">

                            <div
                                className="relative w-full aspect-square flex items-center justify-center mb-4 bg-white rounded-2xl border border-gray-100 group overflow-hidden"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                            >
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={activeSlideIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        src={allImages[activeSlideIndex]}
                                        alt={title}
                                        className="max-h-full max-w-full object-contain object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                </AnimatePresence>

                                {allImages.length > 1 && (
                                    <>
                                        <button onClick={prevSlide} className="absolute left-2 sm:left-4 p-2 bg-white hover:bg-gray-50 rounded-full text-gray-700 shadow-md transition-all active:scale-95 z-10">
                                            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                        <button onClick={nextSlide} className="absolute right-2 sm:right-4 p-2 bg-white hover:bg-gray-50 rounded-full text-gray-700 shadow-md transition-all active:scale-95 z-10">
                                            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </button>
                                    </>
                                )}

                                {hasDiscount && (
                                    <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold shadow-sm z-10">
                                        -{discountPercent}% OFF
                                    </span>
                                )}

                            </div>

                            {allImages.length > 1 && (
                                <div className="w-full flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveSlideIndex(idx)}
                                            className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white transition-all ${activeSlideIndex === idx ? "border-2 border-orange-500 shadow-md" : "border border-gray-200 opacity-60 hover:opacity-100"}`}
                                        >
                                            <img src={img} className="w-full h-full object-cover p-1" alt={`Thumbnail ${idx + 1}`} />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 mb-3 leading-tight">{title}</h1>

                            {(product as any)?.vendor && (
                                <Link
                                    to={`/dashboard/vendor-info/${(product as any).vendor.id || (product as any).vendor_id}`}
                                    className="inline-flex items-center gap-2 mb-4 text-emerald-600 hover:text-emerald-700 w-max group"
                                >
                                    <Store className="w-5 h-5" />
                                    <span className="font-bold text-sm sm:text-base border-b border-transparent group-hover:border-emerald-600 transition-colors">
                                        Store: {(product as any).vendor.businee_name}
                                    </span>
                                </Link>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-2.5 py-1 rounded-md">
                                    {[...Array(4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    <Star className="w-4 h-4 text-yellow-200 fill-current" />
                                    <span className="text-sm text-yellow-700 font-bold ml-1">4.0</span>
                                </div>
                                <span className="text-sm text-gray-500 hover:text-orange-600 cursor-pointer underline decoration-dotted underline-offset-4">(275 Reviews)</span>
                                <div className="h-4 w-[1px] bg-gray-300 hidden sm:block"></div>

                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Product Highlights</h3>
                                <div
                                    className="prose prose-sm sm:prose-base text-gray-600 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: shortDesc || "<p>No highlights provided.</p>" }}
                                />
                            </div>

                            <div className="flex flex-wrap items-end gap-3 sm:gap-4 mb-8 w-fit">
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</span>
                                    <span className="text-3xl sm:text-4xl font-black text-gray-900">৳{currentPrice}</span>
                                </div>

                                {hasDiscount && (
                                    <div className="flex flex-col justify-end pb-1">
                                        <span className="text-sm sm:text-lg text-gray-400 line-through decoration-red-500/50">
                                            ৳{regularPrice}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-auto w-full">
                                <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl overflow-hidden h-14 w-full sm:w-36 bg-white shrink-0">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        className="h-full px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                    <span className="font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => (currentStock > quantity ? q + 1 : q))}
                                        className="h-full px-4 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                                    <Button
                                        onClick={addToCart}
                                        disabled={currentStock === 0}
                                        className="flex-1 h-14 bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 font-bold text-base rounded-xl transition-all active:scale-[0.98]"
                                    >
                                        <ShoppingCart className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
                                        {currentStock > 0 ? t('buttons.addToCart') : "Out of Stock"}
                                    </Button>

                                    {/* <-- UPDATED BUTTON --> */}
                                    <Button
                                        onClick={handleBuyNow}
                                        disabled={currentStock === 0}
                                        className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98] relative overflow-hidden group/buy"
                                    >
                                        <Zap className="mr-2 w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                                        {currentStock > 0 ? "Buy Now" : "Out of Stock"}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/buy:animate-[shimmer_1.5s_infinite]" />
                                    </Button>

                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2 text-sm">
                                {currentStock > 0 ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span className="font-medium text-green-600">{currentStock} items in stock</span>
                                    </>
                                ) : (
                                    <span className="font-medium text-red-500">Currently unavailable</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- TABS SECTION --- */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-8 pt-6">
                        <div className="flex gap-6 sm:gap-8 border-b border-gray-200 overflow-x-auto scrollbar-hide whitespace-nowrap">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`pb-4 text-sm sm:text-base font-bold transition-all relative ${activeTab === tab.id ? "text-orange-600" : "text-gray-500 hover:text-gray-800"}`}
                                >
                                    {tab.label}
                                    {tab.badge && (
                                        <span className="ml-2 bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full font-semibold">
                                            {tab.badge}
                                        </span>
                                    )}
                                    {activeTab === tab.id && (
                                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-600" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-8 min-h-[300px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="prose prose-sm sm:prose-base max-w-none text-gray-600"
                            >
                                {activeTab === "long_desc" && (
                                    <div dangerouslySetInnerHTML={{ __html: longDesc || "<p>No detailed description available.</p>" }} />
                                )}

                                {activeTab === "short_desc" && (
                                    <div dangerouslySetInnerHTML={{ __html: shortDesc || "<p>No short description available.</p>" }} />
                                )}

                                {activeTab === "features" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-semibold text-gray-500">SKU</span>
                                            <span className="font-bold text-gray-900">{product.sku}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="font-semibold text-gray-500">Stock Status</span>
                                            <span className={`font-bold ${currentStock > 0 ? "text-green-600" : "text-red-600"}`}>
                                                {currentStock > 0 ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "price" && (
                                    <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-100 max-w-sm">
                                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                                            <span className="text-gray-500 font-medium">Regular Price</span>
                                            <span className="font-bold line-through text-gray-400">৳{regularPrice}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 pt-4">
                                            <span className="text-gray-900 font-bold">Offer Price</span>
                                            <span className="text-2xl font-black text-orange-600">৳{currentPrice}</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "reviews" && (
                                    <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                            <Star className="w-8 h-8 text-gray-400 fill-current" />
                                        </div>
                                        <h4 className="text-lg font-bold text-gray-900 mb-1">No reviews yet</h4>
                                        <p className="text-sm text-gray-500">Be the first to review this product!</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>

            <VendorMismatchModal
                isOpen={isVendorModalOpen}
                onClose={() => setIsVendorModalOpen(false)}
                onConfirm={handleConfirmVendorSwitch}
            />
        </motion.div>
    );
}