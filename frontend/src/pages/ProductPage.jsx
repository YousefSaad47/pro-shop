import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import axios from 'axios';
import { addToCart } from '@/store';
import Rating from '../components/Rating';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import { Truck, ShieldCheck, ArrowLeft, Plus, Minus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="container mx-auto py-6 text-center">
    <h1 className="text-2xl font-bold text-red-500 dark:text-red-400 mb-4">
      Oops! Something went wrong.
    </h1>
    <p className="text-lg text-red-500 dark:text-red-400 mb-4">
      {error.message}
    </p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

const ProductImage = ({ image, name }) => (
  <motion.div
    className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <img
      src={`/assets${image}`}
      alt={name}
      className="w-full h-auto rounded-lg shadow-md"
    />
  </motion.div>
);

const ProductDetails = ({ product }) => (
  <motion.div
    className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <h2 className="text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
      {product.name}
    </h2>
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    <div className="mb-4">
      <Rating value={product.rating} text={`${product.numReviews} reviews`} />
    </div>
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    <p className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
      Price: ${product.price.toFixed(2)}
    </p>
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    <p className="text-lg mb-4 text-gray-700 dark:text-gray-300">
      {product.description}
    </p>
    <div className="flex items-center space-x-4 mt-6">
      <div className="flex items-center">
        <Truck className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {product.price > 100 ? 'Free Shipping' : '$10 Shipping'}
        </span>
      </div>
      <div className="flex items-center">
        <ShieldCheck className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          30-Day Return
        </span>
      </div>
    </div>
  </motion.div>
);

const AddToCartSection = ({
  product,
  handleAddToCart,
  qty,
  handleQtyChange,
}) => (
  <motion.div
    className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="mb-4">
      <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Price:
      </p>
      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        ${product.price.toFixed(2)}
      </p>
    </div>
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    <div className="mb-4">
      <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Status:
      </p>
      <p
        className={`text-xl font-bold ${
          product.countInStock > 0
            ? 'text-green-500 dark:text-green-400'
            : 'text-red-500 dark:text-red-400'
        }`}
      >
        {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
      </p>
    </div>
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    {product.countInStock > 0 && (
      <div className="mb-4">
        <p className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          Quantity:
        </p>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQtyChange(-1)}
            disabled={qty === 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {qty}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQtyChange(1)}
            disabled={qty === product.countInStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )}
    <hr className="my-4 border-gray-200 dark:border-gray-700" />
    <div className="flex justify-center">
      <Button
        className="w-full"
        size="lg"
        variant={product.countInStock === 0 ? 'secondary' : 'default'}
        disabled={product.countInStock === 0}
        onClick={handleAddToCart}
      >
        {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
    {product.countInStock > 0 && (
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
        {product.countInStock} items left in stock
      </p>
    )}
  </motion.div>
);

const ReviewForm = ({
  onSubmit,
  rating,
  setRating,
  comment,
  setComment,
  isLoading,
}) => (
  <Card className="bg-white dark:bg-gray-800">
    <CardHeader>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Write a Review
      </h3>
    </CardHeader>
    <CardContent>
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Rating
          </label>
          <Select
            value={rating !== null ? rating.toString() : ''}
            onValueChange={(value) => setRating(value ? Number(value) : null)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select a rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Select...</SelectItem>
              {[1, 2, 3, 4, 5].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value} -{' '}
                  {
                    ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][
                      value - 1
                    ]
                  }
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Comment
          </label>
          <textarea
            id="comment"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:ring-opacity-50 resize-none bg-gray-50 dark:bg-gray-700 p-3 text-gray-700 dark:text-gray-300"
            placeholder="Write your review here..."
            required
          ></textarea>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </form>
    </CardContent>
  </Card>
);

const ReviewsSection = ({
  product,
  userInfo,
  createReview,
  createReviewLoading,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ rating, comment });
      setRating(0);
      setComment('');
      toast({
        title: 'Review Submitted',
        description: 'Your review has been successfully submitted.',
        className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
        duration: 3000,
      });
      const successSound = new Audio('/assets/sounds/success.mp3');
      successSound.play();
    } catch (err) {
      console.error('Failed to submit review:', err);
      toast({
        title: 'Error',
        description: 'You already submitted a review for this product.',
        variant: 'destructive',
        duration: 3000,
      });
      const errorSound = new Audio('/assets/sounds/error.mp3');
      errorSound.play();
    }
  };

  return (
    <motion.div
      className="mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Customer Reviews
      </h2>
      {product.reviews.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
      ) : (
        product.reviews.map((review) => (
          <Card key={review._id} className="mb-4 bg-white dark:bg-gray-800">
            <CardContent className="pt-4">
              <div className="flex items-center mb-2">
                <strong className="mr-2 text-gray-900 dark:text-gray-100">
                  {review.name}
                </strong>
                <Rating value={review.rating} />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {review.comment}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))
      )}

      {userInfo ? (
        <ReviewForm
          onSubmit={handleSubmitReview}
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          isLoading={createReviewLoading}
        />
      ) : (
        <Card className="bg-white dark:bg-gray-800">
          <CardContent>
            <p className="text-gray-500 dark:text-gray-400">
              Please{' '}
              <Link
                to="/login"
                className="text-blue-500 dark:text-blue-400 hover:underline"
              >
                sign in
              </Link>{' '}
              to write a review.
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

const ProductPage = () => {
  const [qty, setQty] = useState(1);
  const { toast } = useToast();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [productId]);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/${productId}`);
      return data;
    },
    enabled: !!productId,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  const { mutateAsync: createReview, isLoading: createReviewLoading } =
    useMutation({
      mutationKey: ['createReview'],
      mutationFn: async (body) => {
        const { data } = await axios.post(
          `/api/products/${productId}/reviews`,
          body
        );
        return data;
      },
      onSuccess: () => {
        refetch();
      },
      onError: (error) => {
        console.error('Error creating review:', error);
        toast({
          title: 'Error',
          description: 'Failed to submit review. Please try again.',
          variant: 'destructive',
        });
      },
    });

  const handleQtyChange = (change) => {
    setQty((prevQty) =>
      Math.max(1, Math.min(prevQty + change, product.countInStock))
    );
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty }));
    toast({
      title: 'Added to Cart',
      description: `${qty} ${qty > 1 ? 'items' : 'item'} added to your cart.`,
      className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
      duration: 3000,
    });

    const successSound = new Audio('/assets/sounds/success.mp3');
    successSound.play();

    navigate('/cart');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Link to="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Link>
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            >
              <Skeleton className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <Skeleton className="h-8 w-3/4 mt-4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-6 w-1/2 mt-2 bg-gray-200 dark:bg-gray-700" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    throw new Error(`Failed to load product details: ${error.message}`);
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        refetch();
      }}
    >
      <div className="container mx-auto py-6">
        <Link to="/">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </Link>
        <div className="flex flex-wrap md:flex-nowrap gap-6">
          <ProductImage image={product.image} name={product.name} />
          <ProductDetails product={product} />
          <AddToCartSection
            product={product}
            handleAddToCart={handleAddToCart}
            qty={qty}
            handleQtyChange={handleQtyChange}
          />
        </div>

        <ReviewsSection
          product={product}
          userInfo={userInfo}
          createReview={createReview}
          createReviewLoading={createReviewLoading}
        />

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

export default ProductPage;
