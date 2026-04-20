import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import your images
import banner1 from '../../../../public/image/Banner/Screenshot_3.png';
import banner2 from '../../../../public/image/Banner/Screenshot_4.png';
import banner3 from '../../../../public/image/Banner/Screenshot_7.png';

const HeroSection = () => {
    const banners = [
        { id: 1, image: banner1, title: "Welcome to Our Website", description: "Discover amazing features and great content." },
        { id: 2, image: banner2, title: "Explore Our Services", description: "We offer a wide range of services to suit your needs." },
        { id: 3, image: banner3, title: "Join Us Today", description: "Become part of our community and enjoy exclusive benefits." },
    ];

    return (
        <>
            {/* =========================================
                DESKTOP VIEW (Visible on lg+ screens)
               ========================================= */}
            <section className="hidden lg:block w-full px-4 py-6">
                <div className="max-w-container mx-auto overflow-hidden rounded-2xl shadow-xl bg-gray-900">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="h-[400px]"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id} className="relative group">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* =========================================
                MOBILE & TABLET VIEW (Visible below lg)
               ========================================= */}
            <section className="block lg:hidden w-full px-3 py-3">
                <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-900">
                    
                    {/* MOBILE SWIPER ADDED HERE */}
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        className="h-[200px] w-full"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id} className="relative w-full h-full">
                                {/* Background Image */}
                                <img 
                                    src={banner.image} 
                                    alt={banner.title} 
                                    className="w-full h-full object-left-top" 
                                />
                                {/* Dark overlay to match desktop */}
                                <div className="absolute inset-0 bg-black/20" />
                                
                                {/* If you want to add the middle image back in later, put it right here inside the SwiperSlide */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                
                {/* Compact Stats Grid */}
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-emerald-50 p-2.5 rounded-lg text-center">
                        <h3 className="text-emerald-800 font-bold text-base">100+</h3>
                        <p className="text-emerald-600 text-[10px]">Courses</p>
                    </div>
                    <div className="bg-orange-50 p-2.5 rounded-lg text-center">
                        <h3 className="text-orange-800 font-bold text-base">50k+</h3>
                        <p className="text-orange-600 text-[10px]">Students</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;