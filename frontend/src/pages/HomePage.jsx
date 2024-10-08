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
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

const ITEMS_PER_PAGE = 12;

const HomePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: productsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['products', currentPage, selectedCategory, searchTerm],
    queryFn: async () => {
      const { data } = await axios.get('/api/products', {
        params: {
          page: currentPage,
          limit: ITEMS_PER_PAGE,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchTerm || undefined,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const categories = ['All', 'Electronics', 'Beauty', 'Home'];

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    window.scrollTo({
      top: document.getElementById('products-section')?.offsetTop,
      behavior: 'smooth',
    });
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) return <LoadingSkeleton />;
  if (isError) return <ErrorMessage />;

  const { products, totalPages, featuredProducts } = productsData;

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
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category.toLowerCase()}
                onClick={() => setSelectedCategory(category)}
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
            key={`${selectedCategory}-${searchTerm}-${currentPage}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {totalPages > 1 && (
          <motion.div
            className="flex justify-center items-center mt-12 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="flex items-center space-x-2 hover:bg-indigo-50"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            <div className="flex items-center space-x-2">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <Button
                    key={pageNumber}
                    variant={pageNumber === currentPage ? 'default' : 'outline'}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 ${
                      pageNumber === currentPage
                        ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white'
                        : 'hover:bg-indigo-50'
                    }`}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="flex items-center space-x-2 hover:bg-indigo-50"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </Tabs>

      <TrendingSection products={productsData.trendingProducts} />
    </div>
  );
};

export default HomePage;
