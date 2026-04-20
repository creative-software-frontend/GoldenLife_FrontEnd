import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";

// 👇 CORRECTED IMPORT LINE
import { reviewsData } from "@/data/reviewsData";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReviewCard from "./ReviewCard";

const orangeColor = "#FF9100";

// Custom styles to override Swiper defaults and implement the center-mode effect
const swiperStyles = `
  .swiper-pagination-bullet {
    background-color: ${orangeColor};
    opacity: 0.5;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    width: 24px;
    border-radius: 6px;
    transition: all 0.3s ease;
  }
 
  /* --- CUSTOM ARROW DESIGN --- */
  .swiper-button-next, .swiper-button-prev {
    color: ${orangeColor} !important; /* ✅ Orange icon color */
    background-color: white !important; /* ✅ White button background */
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    /* ✅ Added a more pronounced shadow */
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    transition: all 0.3s ease !important;
    
  }
 
  /* Hover effect for arrows */
  .swiper-button-next:hover, .swiper-button-prev:hover {
    transform: scale(1.05);
    background-color: #fcfcfc !important;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15) !important;
  }
 
  /* ✅ Resized the inner arrow icon to be smaller and fit better */
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 16px !important; /* Made smaller */
    font-weight: 900 !important;
    /* Ensures pseudo-element doesn't affect button layout */
    display: flex;
    align-items: center;
    justify-content: center;
  }
 
  /* Adjust distance from the edges */
  .swiper-button-prev {
    left: 15px !important;
  }
  .swiper-button-next {
    right: 15px !important;
  }

  /* Ensure the swiper container doesn't cut off shadows */
  .swiper {
    padding-bottom: 60px !important;
    padding-top: 20px !important;
  }
`;

const Reviews: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <style>{swiperStyles}</style>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our <span style={{color: orangeColor}}>Resellers</span> Say
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear from the people who have transformed their earnings with ShopBase BD.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, A11y, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation={true}
          breakpoints={{
            // when window width is >= 768px (Tablet & Desktop)
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          className="reviews-swiper"
        >
          {reviewsData.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="h-full transition-all duration-500 ease-in-out transform opacity-40 scale-90 [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:scale-100 [.swiper-slide-active_&]:z-10 relative">
                <ReviewCard review={review} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;