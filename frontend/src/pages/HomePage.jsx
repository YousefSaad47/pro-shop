import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Product from '../components/Product';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrendingSection from '../components/TrendingSection';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [inputPage, setInputPage] = useState('');

  const getPageNumbers = () => {
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

  const handlePageInput = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage('');
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        Previous
      </Button>
      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={pageNum === currentPage ? 'default' : 'outline'}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </Button>
      ))}
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        Next
      </Button>
      <form onSubmit={handlePageInput} className="flex items-center space-x-2">
        <Input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Go to page"
          className="w-20"
        />
        <Button type="submit">Go</Button>
      </form>
    </div>
  );
};

const HomePage = () => {
  const categories = ['All', 'Electronics', 'Home', 'Beauty'];
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState('0-Infinity');
  const [tempSearchTerm, setTempSearchTerm] = useState('');

  const {
    data: productsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      'products',
      selectedCategory,
      searchTerm,
      currentPage,
      priceRange,
    ],
    queryFn: async () => {
      const category = selectedCategory !== 'All' ? selectedCategory : '';
      const [minPrice, maxPrice] = priceRange.split('-');
      const { data } = await axios.get('/api/products', {
        params: {
          page: currentPage,
          limit: 6,
          category,
          search: searchTerm,
          minPrice,
          maxPrice: maxPrice === 'Infinity' ? undefined : maxPrice,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, priceRange]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(tempSearchTerm);
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'px-4' : 'pr-8'} space-y-6`}>
      <div>
        <h3 className="text-lg font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="space-y-2">
          {[
            { label: 'All Prices', value: '0-Infinity' },
            { label: 'Below $25', value: '0-25' },
            { label: 'Below $100', value: '0-100' },
            { label: '$100 to $500', value: '100-500' },
            { label: '$500 to $1000', value: '500-1000' },
            { label: 'Over $1000', value: '1000-Infinity' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceRangeChange(range.value)}
              className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                priceRange === range.value
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <HeroSection />
      <FeaturedSection products={productsData?.featuredProducts} />

      <div className="mt-16" id="products-section">
        <h2 className="text-3xl font-bold mb-8">Explore Our Collection</h2>

        <div className="mb-6 flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search products..."
              value={tempSearchTerm}
              onChange={(e) => setTempSearchTerm(e.target.value)}
              className="w-full pr-10"
            />
            <Button
              type="submit"
              variant="ghost"
              className="absolute right-0 top-0 h-full"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSection isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="hidden md:block w-1/4">
            <FilterSection />
          </div>

          <div className="w-full md:w-3/4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <ErrorMessage />
            ) : productsData?.products?.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData?.products?.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            {productsData && (
              <Pagination
                currentPage={currentPage}
                totalPages={productsData.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>

      <TrendingSection products={productsData?.trendingProducts} />
    </div>
  );
};

export default HomePage;
