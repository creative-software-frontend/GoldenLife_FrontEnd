import React from "react";

export default function Hero() {
  return (
    <section className="relative z-10 min-h-[calc(100vh-120px)] flex items-center px-5 md:px-8 py-16 md:py-24">
      <div className="container mx-auto">
        <div className="max-w-3xl">
          <div className="mb-6">
            <div className="inline-block px-4 py-2 bg-black bg-opacity-5 rounded-full">
              
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            <span className="block">Live Better.</span>
            <span className="block text-[#FF8A00]">Manage Smarter.</span>
          </h1>
          
          <p className="text-gray-600 text-lg md:text-xl mb-10 max-w-2xl">
            Streamline your daily routine with our intuitive platform designed for modern living.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 text-base font-medium rounded-lg bg-[#FF8A00] text-white hover:bg-orange-600 transition-colors duration-200 w-full sm:w-auto">
              Get Started
            </button>
            <button className="px-8 py-4 text-base font-medium rounded-lg border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200 w-full sm:w-auto">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}