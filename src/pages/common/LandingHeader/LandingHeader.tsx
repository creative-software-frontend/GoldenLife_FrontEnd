
import Hero from "@/pages/Landing/sections/Hero";
import Header from "../Header";

export default function LandingHeader() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* FULL BACKGROUND IMAGE WITH OVERLAY */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: "url('/image/Banner/bannerHero.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
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