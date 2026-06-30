
import Hero from "@/pages/Landing/sections/Hero";
import Header from "../Header";

export default function LandingHeader() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      
      {/* MOBILE & TABLET: Standalone Banner Image */}
      <div className="block lg:hidden w-full bg-slate-900">
        <img 
          src="/image/Banner/banner_images.png" 
          alt="Golden Life Banner" 
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative overflow-hidden bg-slate-50 lg:bg-transparent">
        {/* DESKTOP ONLY: FULL BACKGROUND IMAGE WITH OVERLAY */}
        <div className="hidden lg:block absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-top bg-no-repeat"
            style={{ 
              backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 60%, rgba(255, 255, 255, 0) 100%), url('/image/Banner/banner_images.png')",
            }}
          >
          </div>
        </div>

        {/* HERO SECTION COMPONENT */}
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
    </div>
  );
}