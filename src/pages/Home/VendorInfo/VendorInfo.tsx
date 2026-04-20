import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Store, CheckCircle2, MapPin, MessageSquare, Package } from "lucide-react";
import { ProductCard } from "@/pages/common/ProductCard/ProductCard";
import { motion } from "framer-motion";

interface VendorData {
  id: number;
  businee_name: string;
  owner_name: string;
  mobile: string;
  country: string;
  district: string;
  address: string;
  image: string;
  banner: string;
  whatsapp?: string;
  website?: string;
  facebook?: string;
  telegram?: string;
  created_at: string;
  products: any[];
}

export default function VendorInfo() {
  const { id } = useParams<{ id: string }>();
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/vendor/details/${id}`);
        if (response.data && response.data.data) {
          setVendor(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch vendor details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
    window.scrollTo(0, 0);
  }, [id, baseURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-600 border-opacity-50"></div>
      </div>
    );
  }

  if (!vendor) return null;

  // Corrected Image Logic
  const fallbackBanner = 'https://admin.goldenlifeltd.com/uploads/vendor/banner/69c793580dd6b.jpg';
  const bannerImg = vendor.banner
    ? (vendor.banner.startsWith('http') ? vendor.banner : `${baseURL}/uploads/vendor/banner/${vendor.banner}`)
    : fallbackBanner;

  const profileImg = vendor.image?.startsWith('http')
    ? vendor.image
    : `${baseURL}/uploads/vendor/image/${vendor.image}`;

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 w-full font-sans selection:bg-emerald-100 overflow-x-hidden">

      {/* --- HERO / BANNER --- */}
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#f8fafc]" />
      </div>

      {/* --- MAIN STORE CARD --- */}
      <div className="container mx-auto px-4 -mt-24 md:-mt-40 relative z-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] border border-white p-6 md:p-10 shadow-[0_30px_60px_rgba(15,23,42,0.1)]"
        >
          <div className="flex flex-col xl:flex-row items-center xl:items-start justify-between gap-8">

            {/* Left Section: Profile + Name */}
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 w-full">

              {/* Profile Image with 125% scale safety */}
              <div className="relative -mt-16 md:-mt-28 flex-shrink-0">
                <img
                  src={profileImg}
                  alt={vendor.businee_name}
                  className="w-36 h-36 md:w-52 md:h-52 rounded-[2rem] object-cover border-[10px] border-white shadow-xl bg-white"
                />
                <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                  <Store size={20} />
                </div>
              </div>

              {/* Vendor Identity & High Contrast Name */}
              <div className="text-center lg:text-left pt-2 flex-1">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-5">
                  <div className="flex items-center gap-3">
                    {/* Senior Design: Brand Accent Bar */}
                    <div className="hidden lg:block w-1.5 h-10 bg-emerald-500 rounded-full" />
                    <h1 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight uppercase leading-none">
                      {vendor.businee_name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-full shadow-lg shadow-emerald-200">
                    <CheckCircle2 size={12} /> Verified
                  </div>
                </div>

                {/* Info Pills */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 rounded-xl border border-slate-100 font-bold text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Owner: {vendor.owner_name}
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100 font-semibold text-xs">
                    <MapPin size={14} className="text-emerald-500" />
                    {vendor.district}
                  </div>
                  {vendor.whatsapp && (
                    <a
                      href={`https://wa.me/${vendor.whatsapp}`}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 font-bold text-xs hover:bg-emerald-600 hover:text-white transition-all duration-300"
                    >
                      <MessageSquare size={14} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section: Stats Grid (Zoom Robust) */}
            <div className="grid grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-[350px]">
              {[
                { label: 'Products', value: vendor.products?.length || 0, color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
                { label: 'Rating', value: '4.9/5.0', color: 'text-orange-500', bg: 'bg-orange-50/50' },
                { label: 'Followers', value: '850+', color: 'text-blue-600', bg: 'bg-blue-50/50' },
                { label: 'Est.', value: '2026', color: 'text-purple-600', bg: 'bg-purple-50/50' },
              ].map((stat, i) => (
                <div key={i} className={`${stat.bg} p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center xl:items-start`}>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <h4 className={`text-xl font-black ${stat.color}`}>{stat.value}</h4>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>

      {/* --- CATALOG SECTION --- */}
      <div className="container mx-auto px-4 mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-slate-200 pb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Available Catalog</h2>
            <p className="text-slate-500 font-medium mt-2">Browse the full collection from this store</p>
          </div>
          <div className="flex items-center justify-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Package size={20} className="text-emerald-500" />
            <span className="font-black text-slate-700 text-sm uppercase">{vendor.products?.length} Total Items</span>
          </div>
        </div>

        {vendor.products && vendor.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vendor.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  titleEn: product.product_title_english,
                  offer_price: parseFloat(product.offer_price) || 0,
                  product_image: product.product_image?.startsWith("http")
                    ? product.product_image
                    : `${baseURL}/uploads/ecommarce/product_image/${product.product_image}`
                }}
                baseURL={baseURL}
                onAddToCart={() => { }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
            <div className="p-6 bg-slate-50 rounded-full mb-6">
              <Store size={48} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Storefront is empty</h3>
            <p className="text-slate-400 mt-2">This vendor hasn't listed any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}