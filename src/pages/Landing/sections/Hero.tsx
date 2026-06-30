import React from "react";
import { Download, Smartphone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative z-10 px-4 sm:px-6 md:px-8 py-10 sm:py-12 lg:py-20 xl:py-24 min-h-[auto] lg:min-h-[700px] flex items-center justify-center lg:justify-start">
      <div className="container mx-auto w-full">
        <div className="max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl text-center lg:text-left mx-auto lg:mx-0">

          {/* Badge */}
          <div className="mb-6 flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide">Golden Life Platform</span>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 sm:mb-6 leading-tight mx-auto lg:mx-0 max-w-[90%] sm:max-w-full"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
          >
            <span className="block">Live Better.</span>
            <span className="block text-[#FF8A00]" style={{ textShadow: "0 2px 16px rgba(255,138,0,0.25)" }}>
              Manage Smarter.
            </span>
          </h1>

          {/* Sub-text */}
          <p
            className="text-slate-800 font-semibold text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-lg sm:max-w-xl mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0"
            style={{ textShadow: "0 1px 6px rgba(255,255,255,0.8)" }}
          >
            Streamline your daily routine with our intuitive platform designed for modern living.
          </p>

          {/* APK Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            {/* Customer App */}
            <a
              href="/golden_life_customer.apk"
              download="golden_life_customer.apk"
              id="hero-download-customer-apk"
              className="group flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-[#FF8A00] hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-300/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/20 rounded-xl flex-shrink-0">
                <Smartphone size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left flex-1 sm:flex-none">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/80">Download APK</p>
                <p className="text-sm sm:text-base font-black leading-none mt-0.5">Customer App</p>
              </div>
              <Download size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Vendor App */}
            <a
              href="/goldenlife_vendor.apk"
              download="goldenlife_vendor.apk"
              id="hero-download-vendor-apk"
              className="group flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-white/10"
            >
              <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-white/10 rounded-xl flex-shrink-0">
                <Smartphone size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div className="text-left flex-1 sm:flex-none">
                <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60">Download APK</p>
                <p className="text-sm sm:text-base font-black leading-none mt-0.5">Vendor App</p>
              </div>
              <Download size={16} className="opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Trust note */}
          <p className="mt-5 sm:mt-6 text-xs sm:text-sm md:text-base font-bold text-slate-700 lg:text-white flex items-center justify-center lg:justify-start gap-1.5 sm:gap-2 px-2 sm:px-0 text-center lg:text-left drop-shadow-none lg:drop-shadow-md">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500 inline-block shadow-sm flex-shrink-0" />
            <span>Free download &middot; No registration required</span>
          </p>
        </div>
      </div>
    </section>
  );
}
