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
import { Input } from '@/components/ui/input';

const HomePage = () => {
  const categories = ['All', 'Electronics', 'Beauty', 'Home'];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState('');

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm, currentPage],
    queryFn: async () => {
      const category = selectedCategory !== 'All' ? selectedCategory : '';
      const { data } = await axios.get('/api/products', {
        params: {
          page: currentPage,
          limit: 12,
          category,
          search: searchTerm,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    const productsSection = document.getElementById('products-section');
    if (productsSection && currentPage > 1) {
      window.scrollTo({
        top: productsSection.offsetTop,
        behavior: 'smooth',
      });
    }
  }, [currentPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    refetch();
  };

  const getPageNumbers = () => {
    if (!productsData) return [];
    const totalPages = productsData.totalPages;
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleGoToPage();
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(inputPage, 10);
    if (pageNumber >= 1 && pageNumber <= productsData?.totalPages) {
      setCurrentPage(pageNumber);
      setInputPage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gradient-to-b from-gray-100 to-white">
      <HeroSection />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FeaturedSection products={productsData?.featuredProducts} />
      </motion.div>

      <Tabs value={selectedCategory} className="mt-24" id="products-section">
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
                value={category}
                onClick={() => handleCategoryChange(category)}
                className="px-8 py-3 text-lg font-medium rounded-full transition-all duration-300 text-white hover:bg-white hover:text-indigo-600"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="relative group">
            <Input
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <ErrorMessage />
            ) : productsData?.products?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {productsData?.products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {productsData && productsData.totalPages > 1 && (
          <motion.div
            className="flex flex-col sm:flex-row justify-center items-center mt-12 space-y-4 sm:space-y-0 sm:space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="flex items-center space-x-2 hover:bg-indigo-50"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {getPageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'default' : 'outline'}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 ${
                    pageNum === currentPage
                      ? 'bg-gradient-to-r from-indigo-500 to-teal-500 text-white'
                      : 'hover:bg-indigo-50'
                  }`}
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= productsData.totalPages}
                className="flex items-center space-x-2 hover:bg-indigo-50"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Go to page"
                value={inputPage}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className="w-32 text-center"
                min={1}
                max={productsData?.totalPages}
              />
              <Button
                onClick={handleGoToPage}
                variant="outline"
                className="hover:bg-indigo-50"
                disabled={
                  !inputPage ||
                  parseInt(inputPage, 10) < 1 ||
                  parseInt(inputPage, 10) > productsData?.totalPages
                }
              >
                Go
              </Button>
            </div>
          </motion.div>
        )}
      </Tabs>

      <TrendingSection products={productsData?.trendingProducts} />
    </div>
  );
};

export default HomePage;
