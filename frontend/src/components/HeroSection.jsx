import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => (
  <section className="relative h-[80vh] bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-3xl overflow-hidden mb-24">
    <div className="absolute inset-0 bg-black opacity-30"></div>
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
      <motion.h1
        className="text-7xl font-extrabold mb-8 text-white leading-tight"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Discover Extraordinary
        <br />
        <span className="text-yellow-300">Products</span>
      </motion.h1>
      <motion.p
        className="text-2xl mb-12 text-gray-100 max-w-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Explore our curated collection of premium items, handpicked for the
        discerning shopper.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <a href="#products-section">
          <Button
            variant="solid"
            className="px-10 py-5 bg-white text-indigo-700 hover:bg-indigo-100 text-xl font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            Explore Now <ArrowRight className="ml-2" />
          </Button>
        </a>
      </motion.div>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#111827] to-transparent"></div>
  </section>
);

export default HeroSection;
