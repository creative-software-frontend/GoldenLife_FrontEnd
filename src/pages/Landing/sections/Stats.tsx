"use client";

import { useState } from "react";
import { CheckCircle, Play } from "lucide-react";

export default function Stats() {
  const [play, setPlay] = useState(false);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-stretch">

        {/* LEFT CONTENT */}
        <div className="bg-white border p-8 border-gray-200 rounded-2xl flex flex-col justify-between">

          <div>
            {/* TITLE */}
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-black">About</span>{" "}
              <span className="text-orange-500">Us</span>
            </h2>

            {/* LINE */}
            <div className="w-20 h-1 bg-orange-500 mb-6" />

            {/* DESCRIPTION */}
            <p className="text-gray-600 leading-relaxed mb-10">
              SuperBiz BD is one of the largest dropshipping and reselling
              platforms in Bangladesh. We provide verified products, instant
              payments, fast delivery, and 24/7 customer support to help you
              grow your online business with confidence.
            </p>

            <div className="grid sm:grid-cols-2 gap-10">

              {/* Vision */}
              <div>
                <h4 className="text-lg font-semibold text-black mb-4">
                  Our Vision
                </h4>

                <ul className="space-y-3">
                  {[
                    "Build a trusted eCommerce ecosystem",
                    "Empower digital entrepreneurs",
                    "Simplify online business",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-orange-500" size={20} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mission */}
              <div>
                <h4 className="text-lg font-semibold text-black mb-4">
                  Our Mission
                </h4>

                <ul className="space-y-3">
                  {[
                    "Provide verified quality products",
                    "Ensure fast delivery & instant payout",
                    "Offer 24/7 dedicated support",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle className="text-orange-500" size={20} />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT VIDEO */}
        <div
          className="relative rounded-2xl overflow-hidden border border-gray-200 cursor-pointer group min-h-[320px] md:min-h-[420px]"
          onClick={() => setPlay(true)}
        >

          {/* THUMBNAIL */}
          {!play && (
            <>
              <img
                src="https://img.youtube.com/vi/ie5vl25VGRY/maxresdefault.jpg"
                alt="About video"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">

                  <span className="absolute w-24 h-24 rounded-full bg-orange-500 opacity-50 animate-ping" />

                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                    <Play className="text-white" size={34} />
                  </div>

                </div>
              </div>
            </>
          )}

          {/* IFRAME */}
          {play && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/ie5vl25VGRY?autoplay=1"
              title="About SuperBiz BD"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}

        </div>

      </div>
    </section>
  );
}
