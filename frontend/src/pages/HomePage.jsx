import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Product from '../components/Product';
import HeroSection from '../components/HeroSection';
import FeaturedSection from '../components/FeaturedSection';
import TrendingSection from '../components/TrendingSection';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorMessage from '../components/ErrorMessage';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const handlePageInput = (e) => {
    e.preventDefault();
    const pageNumber = parseInt(inputPage);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 mt-6">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <form onSubmit={handlePageInput} className="flex items-center space-x-2">
        <Input
          type="number"
          value={inputPage}
          onChange={(e) => setInputPage(e.target.value)}
          placeholder="Go to page"
          className="w-20 text-sm"
        />
        <Button type="submit" size="sm">
          Go
        </Button>
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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
    setIsMobileFiltersOpen(false);
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
    setIsMobileFiltersOpen(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const FilterSection = ({ isMobile = false }) => (
    <div className={`${isMobile ? 'px-2' : 'pr-2 lg:pr-4'} space-y-4`}>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-foreground">
          Categories
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`block w-full text-left px-2 py-1 rounded-md transition-colors text-xs ${
                selectedCategory === category
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground hover:text-foreground'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-2 text-foreground">
          Price Range
        </h3>
        <div className="space-y-1">
          {[
            { label: 'All Prices', value: '0-Infinity' },
            { label: 'Below $100', value: '0-100' },
            { label: '$100 to $500', value: '100-500' },
            { label: '$500 to $1000', value: '500-1000' },
            { label: 'Over $1000', value: '1000-Infinity' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => handlePriceRangeChange(range.value)}
              className={`block w-full text-left px-2 py-1 rounded-md transition-colors text-xs ${
                priceRange === range.value
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground hover:text-foreground'
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
    <div className="max-w-[344px] mx-auto px-2 sm:max-w-none sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
      <HeroSection />
      <FeaturedSection products={productsData?.featuredProducts} />

      <div className="mt-6 sm:mt-8 md:mt-12" id="products-section">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-foreground">
          Explore Our Collection
        </h2>

        <div className="mb-4 flex flex-col space-y-2">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-8 text-sm"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Sheet
            open={isMobileFiltersOpen}
            onOpenChange={setIsMobileFiltersOpen}
          >
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <FilterSection isMobile={true} />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="hidden lg:block w-1/4">
            <FilterSection />
          </div>

          <div className="w-full lg:w-3/4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : isError ? (
              <ErrorMessage />
            ) : productsData?.products?.length === 0 ? (
              <div className="text-center text-muted-foreground py-4 text-sm">
                No products found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
