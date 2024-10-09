import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertCircle,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const ITEMS_PER_PAGE = 10;

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
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      setInputPage('');
    }
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-2">
      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getPageNumbers().map((pageNum) => (
        <Button
          key={pageNum}
          variant={currentPage === pageNum ? 'default' : 'outline'}
          onClick={() => onPageChange(pageNum)}
          className={`w-8 h-8 p-0 ${
            currentPage === pageNum ? 'bg-primary text-primary-foreground' : ''
          }`}
        >
          {pageNum}
        </Button>
      ))}

      <Button
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center ml-4 space-x-2">
        <Input
          type="number"
          min={1}
          max={totalPages}
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          placeholder="Go to page"
          className="text-xs w-32 h-8"
        />
        <Button
          variant="outline"
          onClick={handleGoToPage}
          disabled={
            !inputPage ||
            parseInt(inputPage, 10) < 1 ||
            parseInt(inputPage, 10) > totalPages
          }
        >
          Go
        </Button>
      </div>
    </div>
  );
};

const ProductListPage = () => {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    isLoading,
    error,
    data: productsData,
    refetch,
  } = useQuery({
    queryKey: ['products', currentPage],
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/products?page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      return data;
    },
  });

  const { mutateAsync: createProduct, isLoading: createProductLoading } =
    useMutation({
      mutationKey: ['createProduct'],
      mutationFn: async () => {
        const { data } = await axios.post('/api/products');
        return data;
      },
      onSuccess: () => {
        refetch();
        toast({
          title: 'Success',
          description: 'Product created successfully',
          className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
          duration: 3000,
        });
        const createProductSound = new Audio('/assets/sounds/success.mp3');
        createProductSound.play();
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to create product',
          variant: 'destructive',
          duration: 3000,
        });
        const createProductSound = new Audio('/assets/sounds/error.mp3');
        createProductSound.play();
      },
    });

  const { mutateAsync: deleteProduct, isLoading: deleteProductLoading } =
    useMutation({
      mutationKey: ['deleteProduct'],
      mutationFn: async (productId) => {
        const { data } = await axios.delete(`/api/products/${productId}`);
        return data;
      },
      onSuccess: () => {
        refetch();
        toast({
          title: 'Success',
          description: 'Product deleted successfully',
          className: 'bg-gray-950 border border-cyan-950 text-cyan-500',
          duration: 3000,
        });
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to delete product',
          variant: 'destructive',
          duration: 3000,
        });
      },
    });

  const handleDeleteProduct = async (productId) => {
    setIsDeleteDialogOpen(false);
    try {
      await deleteProduct(productId);
      const deleteProductSound = new Audio('/assets/sounds/success.mp3');
      deleteProductSound.play();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
        duration: 3000,
      });
      const deleteProductSound = new Audio('/assets/sounds/error.mp3');
      deleteProductSound.play();
    }
  };

  const handleCreateProduct = async () => {
    setIsCreateDialogOpen(false);
    try {
      await createProduct();
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to create product',
        variant: 'destructive',
        duration: 3000,
      });
    }
  };

  const handleOpenDeleteConfirmation = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const TableSkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          {['ID', 'NAME', 'PRICE', 'CATEGORY', 'BRAND', 'STOCK', 'ACTIONS'].map(
            (header) => (
              <TableHead key={header}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            )
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(7)].map((_, cellIndex) => (
              <TableCell key={cellIndex}>
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <TableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            An error occurred while fetching products: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { products, totalPages, currentPage: responsePage } = productsData;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <AlertDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          className="bg-gray-200"
        >
          <AlertDialogTrigger asChild>
            <Button>Create Product</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to create a new product? This will add a
                new entry to your product list.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCreateProduct}
                disabled={createProductLoading}
              >
                {createProductLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  'Create'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">ID</TableHead>
              <TableHead className="font-bold">NAME</TableHead>
              <TableHead className="font-bold">PRICE</TableHead>
              <TableHead className="font-bold">CATEGORY</TableHead>
              <TableHead className="font-bold">BRAND</TableHead>
              <TableHead className="font-bold">STOCK</TableHead>
              <TableHead className="font-bold">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{product._id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.countInStock}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Link to={`/admin/product/${product._id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleOpenDeleteConfirmation(product)}
                    >
                      {deleteProductLoading &&
                      productToDelete?._id === product._id ? (
                        <Skeleton className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={responsePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {productToDelete && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          className="bg-gray-200"
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Product</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the product "
                {productToDelete.name}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteProduct(productToDelete._id)}
                disabled={deleteProductLoading}
              >
                {deleteProductLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ProductListPage;
