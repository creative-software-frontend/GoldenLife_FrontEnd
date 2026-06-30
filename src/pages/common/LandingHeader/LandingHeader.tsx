
import Hero from "@/pages/Landing/sections/Hero";
import Header from "../Header";

export default function LandingHeader() {
  return (
    <div className="relative overflow-hidden">
      {/* FULL BACKGROUND IMAGE WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "linear-gradient(to right, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.5) 60%, rgba(255, 255, 255, 0.1) 100%), url('/image/Banner/banner_images.png')",
          }}
        >
        </div>
      </div>

      {/* HEADER COMPONENT */}
      <div className="relative z-10">
        <Header />
      </div>

      {/* HERO SECTION COMPONENT */}
      <div className="relative z-10">
        <Hero />
      </div>
    </div>
  );
}