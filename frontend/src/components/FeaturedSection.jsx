import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const FeaturedSection = ({ products }) => {
  const navigate = useNavigate();

  return (
    <section className="mb-32">
      <h2 className="text-5xl font-bold mb-12 flex items-center justify-center text-gray-800">
        <Star className="mr-4 text-yellow-500 w-12 h-12" /> Featured Products
      </h2>
      <Carousel className="rounded-xl overflow-hidden shadow-2xl">
        <CarouselContent>
          {products?.map((product) => (
            <CarouselItem
              key={product._id}
              className="md:basis-1/2 lg:basis-1/3"
            >
              <div className="relative group">
                <img
                  src={`/assets/${product.image}`}
                  alt={product.name}
                  className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col items-center justify-end p-8">
                  <h3 className="text-white text-2xl font-bold mb-4 select-none">
                    {product.name}
                  </h3>
                  <Button
                    onClick={() => navigate(`/products/${product._id}`)}
                    className="bg-white text-indigo-700 hover:bg-indigo-100 transition-all duration-300 transform hover:scale-105"
                  >
                    View Product
                  </Button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </section>
  );
};

export default FeaturedSection;
