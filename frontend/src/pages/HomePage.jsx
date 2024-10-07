import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Product from '../components/Product';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrendingSection from '../components/TrendingSection';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get('/api/products');
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const categories = ['All', 'Electronics', 'Beauty', 'Home'];

  const filteredProducts = products
    ?.filter(
      (product) =>
        (selectedCategory === 'All' || product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.rating - a.rating);

  const featuredProducts = products?.filter((product) => product.rating >= 4.5);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorMessage />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-gray-100 to-white">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FeaturedSection products={featuredProducts} />
      </motion.div>

      <Tabs defaultValue="all" className="mt-24" id="products-section">
        <motion.h2
          className="text-6xl font-extrabold mb-12 text-center text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore Our Collection
        </motion.h2>

        <div className="flex flex-col md:flex-row justify-between items-center mb-12 space-y-6 md:space-y-0">
          <TabsList className="bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg rounded-full p-1.5">
            {categories.map((category, i) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => {
                  setSelectedCategory(category);
                }}
                className="capitalize px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 text-white hover:bg-white hover:text-indigo-600"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-12 pr-4 py-3 w-80 border-2 border-indigo-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-md transition-all duration-300 group-hover:border-indigo-400"
            />
            <Search
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                isSearchFocused ? 'text-indigo-500' : 'text-gray-400'
              } group-hover:text-indigo-500`}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory + searchTerm}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            d
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts?.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>
      </Tabs>

      <TrendingSection products={products} />
    </div>
  );
};

export default HomePage;
