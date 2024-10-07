import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingCart, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Rating from './Rating';
import { addToCart, removeFromCart } from '@/store';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const isInCart = cartItems.some((item) => item._id === product._id);
  const isOutOfStock = product.countInStock === 0;
  const [animationClass, setAnimationClass] = useState('');
  const buttonRef = useRef(null);

  const handleCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      toast({
        title: 'Out of Stock',
        description: `${product.name} is currently out of stock.`,
        duration: 3000,
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-pink-600 text-white',
      });
      const outOfStockSound = new Audio('/assets/sounds/error.mp3');
      outOfStockSound.play();
    } else {
      if (isInCart) {
        setAnimationClass('animate-shake');
        dispatch(removeFromCart(product._id));
        toast({
          title: 'Removed from Cart',
          description: `${product.name} has been removed from your cart.`,
          duration: 5000,
          className: 'bg-gray-800 text-white',
        });
        const removeFromCartSound = new Audio('/assets/sounds/pop.mp3');
        removeFromCartSound.play();
      } else {
        setAnimationClass('animate-slide-fade');
        dispatch(addToCart({ ...product, qty: 1 }));
        toast({
          title: 'Added to Cart',
          description: `${product.name} has been added to your cart.`,
          duration: 5000,
          className: 'bg-gray-800 text-white',
        });
        const addToCartSound = new Audio('/assets/sounds/success.mp3');
        addToCartSound.play();
      }

      setTimeout(() => setAnimationClass(''), 500);
    }
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col h-full p-4 relative ${
        isOutOfStock ? 'opacity-75' : ''
      }`}
    >
      <img
        src={`/assets${product.image}`}
        alt={product.name}
        className={`w-full h-48 object-cover ${
          isOutOfStock ? 'grayscale' : ''
        }`}
      />
      <div className="flex flex-col flex-grow mt-2">
        <h3 className="text-xl font-semibold mb-2 truncate">{product.name}</h3>
        <div className="flex items-center mb-2 flex-grow-0">
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </div>
        <p className="text-lg font-bold mt-auto">${product.price.toFixed(2)}</p>
      </div>
      <Button
        ref={buttonRef}
        size="icon"
        variant={
          isOutOfStock ? 'destructive' : isInCart ? 'default' : 'secondary'
        }
        className={`absolute top-2 right-2 rounded-full transition-colors duration-300 ${
          isInCart && !isOutOfStock
            ? 'bg-green-500 hover:bg-red-500'
            : 'hover:bg-gray-300'
        } ${animationClass}`}
        onClick={handleCartAction}
      >
        {isOutOfStock ? (
          <XCircle className="h-4 w-4" />
        ) : isInCart ? (
          <CheckCircle className="h-4 w-4" />
        ) : (
          <ShoppingCart className="h-4 w-4" />
        )}
      </Button>
      {isOutOfStock && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center pointer-events-none">
          <span className="text-white font-bold text-lg">Out of Stock</span>
        </div>
      )}
    </Link>
  );
};

export default Product;
