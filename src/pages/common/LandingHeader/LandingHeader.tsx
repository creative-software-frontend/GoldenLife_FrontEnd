
import Hero from "@/pages/Landing/sections/Hero";
import Header from "../Header";

export default function LandingHeader() {
  return (
    <div className="flex flex-col w-full">
      <Header />
      <div className="relative overflow-hidden">
        {/* FULL BACKGROUND IMAGE WITH OVERLAY */}
        <div className="absolute inset-0 z-0">
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