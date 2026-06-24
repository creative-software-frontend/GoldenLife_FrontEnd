import React from "react";
import { Download, Smartphone } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative z-10 px-5 md:px-8 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="max-w-3xl">

          {/* Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#FF8A00] animate-pulse" />
              <span className="text-sm font-bold text-slate-700 tracking-wide">Golden Life Platform</span>
            </div>
          </div>

          {/* Heading */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.12)" }}
          >
            <span className="block">Live Better.</span>
            <span className="block text-[#FF8A00]" style={{ textShadow: "0 2px 16px rgba(255,138,0,0.25)" }}>
              Manage Smarter.
            </span>
          </h1>

          {/* Sub-text */}
          <p
            className="text-slate-800 font-semibold text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
            style={{ textShadow: "0 1px 6px rgba(255,255,255,0.8)" }}
          >
            Streamline your daily routine with our intuitive platform designed for modern living.
          </p>

          {/* APK Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Customer App */}
            <a
              href="/golden_life_customer.apk"
              download="golden_life_customer.apk"
              id="hero-download-customer-apk"
              className="group flex items-center gap-3 px-6 py-4 bg-[#FF8A00] hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-300/40 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-white/20 rounded-xl">
                <Smartphone size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">Download APK</p>
                <p className="text-base font-black leading-none">Customer App</p>
              </div>
              <Download size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>

            {/* Vendor App */}
            <a
              href="/goldenlife_vendor.apk"
              download="goldenlife_vendor.apk"
              id="hero-download-vendor-apk"
              className="group flex items-center gap-3 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center border border-white/10"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-white/10 rounded-xl">
                <Smartphone size={20} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Download APK</p>
                <p className="text-base font-black leading-none">Vendor App</p>
              </div>
              <Download size={16} className="ml-auto opacity-70 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs font-semibold text-slate-600/80 flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
            Free download · No registration required to install
          </p>
        </div>
      </div>
    </section>
  );
}
