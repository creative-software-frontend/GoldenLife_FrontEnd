import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

// Import your images
import banner1 from '../../../../public/image/Banner/1.png';
import banner2 from '../../../../public/image/Banner/2.png';
import banner3 from '../../../../public/image/Banner/3.png';
import banner4 from '../../../../public/image/Banner/4.png';
import banner5 from '../../../../public/image/Banner/5.png';
import banner6 from '../../../../public/image/Banner/6.png';
import banner7 from '../../../../public/image/Banner/7.png';
import banner8 from '../../../../public/image/Banner/8.png';
import banner9 from '../../../../public/image/Banner/9.png';

const HeroSection = () => {
    // Include all banners
    const banners = [
        { id: 1, image: banner1 },
        { id: 2, image: banner2 },
        { id: 3, image: banner3 },
        { id: 4, image: banner4 },
        { id: 5, image: banner5 },
        { id: 6, image: banner6 },
        { id: 7, image: banner7 },
        { id: 8, image: banner8 },
        { id: 9, image: banner9 },
    ];

    return (
        <section className="w-full px-2 py-3 lg:px-4 lg:py-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Unified Responsive Banner Slider */}
                <div className="relative rounded-2xl lg:rounded-[2rem] overflow-hidden shadow-xl bg-slate-900 border border-slate-100">
                    <Swiper
                        modules={[Pagination, Autoplay, EffectFade]}
                        effect="fade"
                        spaceBetween={0}
                        slidesPerView={1}
                        // Use autoHeight to let the image's aspect ratio dictate the container size
                        autoHeight={true}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        // Using Tailwind child selectors for pagination to avoid space character crashes
                        className="w-full [&_.swiper-pagination-bullet]:bg-white [&_.swiper-pagination-bullet]:opacity-50 [&_.swiper-pagination-bullet-active]:bg-emerald-500 [&_.swiper-pagination-bullet-active]:opacity-100"
                    >
                        {banners.map((banner) => (
                            <SwiperSlide key={banner.id} className="relative w-full">
                                {/* Using w-full h-auto ensures the image scales perfectly without any side cropping */}
                                <img
                                    src={banner.image}
                                    alt={`Banner ${banner.id}`}
                                    className="w-full h-auto block"
                                />
                                {/* No dark overlays applied so the banner text remains 100% bright and clear */}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Compact Stats Grid - Only on mobile/tablet */}
                <div className="grid grid-cols-2 gap-3 mt-4 lg:hidden">
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl text-center border border-emerald-100 shadow-sm">
                        <h3 className="text-emerald-700 font-black text-xl mb-0.5">100+</h3>
                        <p className="text-emerald-600/80 text-xs font-bold uppercase tracking-wider">Courses</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl text-center border border-amber-100 shadow-sm">
                        <h3 className="text-amber-700 font-black text-xl mb-0.5">50k+</h3>
                        <p className="text-amber-600/80 text-xs font-bold uppercase tracking-wider">Students</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;