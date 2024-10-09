import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import FormContainer from '@/components/FormContainer';
import { FaSpinner } from 'react-icons/fa';

const ProductEditPage = () => {
  const { id: productId } = useParams();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const { mutateAsync: updateProduct, isLoading: updateProductLoading } =
    useMutation({
      mutationKey: ['updateProduct'],
      mutationFn: async (body) => {
        const { data } = await axios.put(`/api/products/${body._id}`, body);
        return data;
      },
      onSuccess: () => {
        refetch();
        toast({
          title: 'Success',
          description: 'Product updated successfully',
          className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
          duration: 3000,
        });
        const updateProductSound = new Audio('/assets/sounds/success.mp3');
        updateProductSound.play();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to update product',
          variant: 'destructive',
        });
        const updateProductSound = new Audio('/assets/sounds/error.mp3');
        updateProductSound.play();
      },
    });

  const {
    mutateAsync: uploadProductImage,
    isLoading: uploadProductImageLoading,
  } = useMutation({
    mutationKey: ['uploadProductImage'],
    mutationFn: async (body) => {
      const { data } = await axios.post('/api/upload', body);
      return data;
    },
    onSuccess: (data) => {
      setImage(data.image);
      toast({
        title: 'Success',
        description: 'Product image uploaded successfully',
        className: 'bg-gray-800 text-white',
        duration: 3000,
      });
      const updateProductSound = new Audio('/assets/sounds/success.mp3');
      updateProductSound.play();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to upload product image',
        variant: 'destructive',
      });
    },
  });

  const handleUploadImage = async (e) => {
    setImageFile(e.target.files[0]);
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    await uploadProductImage(formData);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        countInStock,
        description,
      });

      navigate('/admin/productlist');
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update product',
        variant: 'destructive',
      });
    }
  };

  return (
    <FormContainer>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Edit Product</h1>
            <Link to="/admin/productlist">
              <Button variant="outline">Back</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <FaSpinner className="h-8 w-8 animate-spin" />
            </div>
          ) : isError ? (
            <p>Error: {error.message}</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="price" className="block mb-1 font-medium">
                  Price
                </label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="image" className="block mb-1 font-medium">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleUploadImage}
                  disabled={uploadProductImageLoading}
                />
                {image && (
                  <img src={image} alt="Product" className="mt-2 max-w-xs" />
                )}
                {imageFile && (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Preview"
                    className="mt-2 max-w-xs"
                  />
                )}
              </div>
              <div>
                <label htmlFor="brand" className="block mb-1 font-medium">
                  Brand
                </label>
                <Input
                  type="text"
                  id="brand"
                  placeholder="Enter brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="category" className="block mb-1 font-medium">
                  Category
                </label>
                <Input
                  type="text"
                  id="category"
                  placeholder="Enter category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="countInStock"
                  className="block mb-1 font-medium"
                >
                  Count In Stock
                </label>
                <Input
                  type="number"
                  id="countInStock"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="description" className="block mb-1 font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={updateProductLoading}>
                {updateProductLoading ? (
                  <FaSpinner className="h-6 w-6 animate-spin" />
                ) : (
                  'Update'
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </FormContainer>
  );
};

export default ProductEditPage;
