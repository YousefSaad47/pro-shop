import React from 'react';
import { ShoppingCart, User, Menu, ChevronDown, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { clearCart } from '@/store';
import axios from 'axios';
import { logout } from '@/store';
import logo from '../assets/images/logo.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { mutateAsync: logoutApiCall } = useMutation({
    mutationFn: async () => {
      const res = await axios.post('/api/users/logout');
      return res.data;
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  const handleLogout = async () => {
    try {
      await logoutApiCall();
      dispatch(logout());
      dispatch(clearCart());
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const NavLink = ({ to, icon: Icon, label, onClick }) => (
    <Link to={to} className="w-full">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={onClick}
      >
        <Icon className="mr-2 h-4 w-4" />
        <span>{label}</span>
      </Button>
    </Link>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>{userInfo.name}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-gray-800 text-white">
        <DropdownMenuItem asChild>
          <Link to="/profile" className="w-full flex items-center">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        {userInfo.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                to="/admin/productlist"
                className="w-full flex items-center"
              >
                <span className="mr-2">🛒</span> Products
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/userlist" className="w-full flex items-center">
                <span className="mr-2">👥</span> Users
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/admin/orderlist" className="w-full flex items-center">
                <span className="mr-2">📦</span> Orders
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-500">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileMenu = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden p-2">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] bg-gray-800 text-white"
      >
        <nav className="flex flex-col space-y-4 mt-8">
          <SheetClose asChild>
            <NavLink
              to="/cart"
              icon={ShoppingCart}
              label={`Cart (${cartCount})`}
            />
          </SheetClose>
          {userInfo ? (
            <>
              <SheetClose asChild>
                <NavLink to="/profile" icon={User} label="Profile" />
              </SheetClose>
              {userInfo.isAdmin && (
                <>
                  <SheetClose asChild>
                    <NavLink
                      to="/admin/productlist"
                      icon={ShoppingCart}
                      label="Products"
                    />
                  </SheetClose>
                  <SheetClose asChild>
                    <NavLink to="/admin/userlist" icon={User} label="Users" />
                  </SheetClose>
                  <SheetClose asChild>
                    <NavLink
                      to="/admin/orderlist"
                      icon={ShoppingCart}
                      label="Orders"
                    />
                  </SheetClose>
                </>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </Button>
            </>
          ) : (
            <SheetClose asChild>
              <NavLink to="/login" icon={User} label="Sign In" />
            </SheetClose>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="bg-gray-900 text-white fixed w-full top-0 z-50 px-20 py-3 md:px-16">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="ProShop Logo" className="h-8 w-8" />
          <span className="text-xl font-bold select-none">ProShop</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link
              to="/cart"
              className="flex items-center space-x-2 select-none relative"
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          {userInfo ? (
            <UserMenu />
          ) : (
            <Button variant="ghost" asChild>
              <Link to="/login" className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Link>
            </Button>
          )}
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
};

export default Header;
