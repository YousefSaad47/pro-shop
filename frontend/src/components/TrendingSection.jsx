import React from "react";
import { motion } from "framer-motion";
import Product from "../components/Product";
import { TrendingUp } from "lucide-react";

const TrendingSection = ({ products }) => {
  const trendingProducts = products
    ?.sort((a, b) => b.numReviews - a.numReviews)
    .slice(0, 8);

  return (
    <section className="mt-32 mb-16">
      <h2 className="text-5xl font-extrabold mb-12 flex items-center justify-center text-gray-900">
        <TrendingUp className="mr-4 text-teal-500 w-12 h-12" />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-500">
          Trending Now
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {trendingProducts?.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Product product={product} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingSection;
