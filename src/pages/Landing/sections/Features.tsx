"use client";

import FeatureCard from "@/pages/common/FeatureCard";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section className="py-24 bg-[#FFF8DC]">
      <div className="container mx-auto px-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="md:max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              Our <span className="text-primary">Features</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 text-lg"
            >
              Powerful features designed to grow your business faster.
            </motion.p>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard title="Zero Investment" description="Start with zero capital." />
          <FeatureCard title="Instant Payment" description="Get paid instantly." />
          <FeatureCard title="Cash on Delivery" description="Increase trust & sales." />
          <FeatureCard title="Verified Products" description="Quality ensured." />
          <FeatureCard title="Search by Image" description="Find products visually." />
          <FeatureCard title="Fast Delivery" description="1–3 days delivery." />
        </div>

      </div>
    </section>
  );
}
