import React from 'react';
import {
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  LogOut,
  Zap,
  Cpu,
  X,
} from 'lucide-react';
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

  const CartIcon = ({ count }) => (
    <div className="relative">
      <ShoppingCart className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
      {count > 0 && (
        <div className="absolute -top-2 -right-2 bg-cyan-500 text-gray-950 text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-cyan-400">
          {count}
        </div>
      )}
    </div>
  );

  const NavLink = ({
    to,
    icon: Icon,
    label,
    className = '',
    onClick,
    showCartCount,
  }) => (
    <Link
      to={to}
      className={`select-none group relative px-4 py-2 text-cyan-500 transition-all duration-300 hover:text-cyan-400 ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 relative z-10">
        {showCartCount ? (
          <CartIcon count={cartCount} />
        ) : (
          <Icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
        )}
        <span>{label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
      <div className="absolute inset-0 bg-cyan-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 rounded-lg blur-sm"></div>
    </Link>
  );

  const AdminNavLink = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className="select-none group w-full px-4 py-2 text-cyan-500 transition-all duration-300 flex items-center space-x-2 relative overflow-hidden hover:text-cyan-400"
    >
      <div className="relative z-10 flex items-center space-x-2">
        <Icon className="h-4 w-4 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <span>{label}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
      <div className="absolute inset-0 bg-cyan-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 blur-sm"></div>
    </Link>
  );

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="select-none group px-4 py-2 text-cyan-500 transition-all duration-300 bg-transparent hover:bg-transparent relative overflow-hidden hover:text-cyan-400"
        >
          <div className="relative z-10 flex items-center space-x-2">
            <User className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span>{userInfo.name}</span>
            <ChevronDown className="h-4 w-4 transition-all duration-300 group-hover:rotate-180" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity duration-300"></div>
          <div className="absolute inset-0 bg-cyan-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 rounded-lg blur-sm"></div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="select-none w-56 bg-gray-950 border border-cyan-950 text-cyan-500 animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2"
      >
        <DropdownMenuItem asChild>
          <NavLink
            to="/profile"
            icon={User}
            label="Profile"
            className="w-full hover:bg-transparent"
          />
        </DropdownMenuItem>

        {userInfo.isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-cyan-950" />
            <DropdownMenuItem asChild>
              <AdminNavLink
                to="/admin/productlist"
                icon={Zap}
                label="Products"
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AdminNavLink to="/admin/userlist" icon={User} label="Users" />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <AdminNavLink
                to="/admin/orderlist"
                icon={ShoppingCart}
                label="Orders"
              />
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-cyan-950" />
        <DropdownMenuItem className="focus:bg-transparent hover:bg-transparent p-0">
          <button
            onClick={handleLogout}
            className="select-none group w-full px-4 py-2 text-red-500 transition-all duration-300 flex items-center space-x-2 relative overflow-hidden hover:text-red-400"
          >
            <div className="relative z-10 flex items-center space-x-2">
              <LogOut className="h-4 w-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:rotate-12" />
              <span>Logout</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            <div className="absolute inset-0 bg-red-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 blur-sm"></div>
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <header className="select-none bg-gray-950 text-white fixed w-full top-0 z-50 px-20 sm:px-20 md:px-16 py-3 border-b border-cyan-950">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="select-none group flex items-center space-x-2 px-2 py-1 relative overflow-hidden rounded-lg"
        >
          <div className="transition-all duration-700 group-hover:animate-[spin_1.5s_ease-in-out_infinite] relative">
            <img
              src={logo}
              alt="ProShop Logo"
              className="h-8 w-8 relative z-10"
            />
            <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-md group-hover:animate-pulse"></div>
          </div>
          <span className="text-xl font-bold text-cyan-500 transition-all duration-300 group-hover:text-cyan-400">
            ProShop
          </span>
          <Cpu className="h-4 w-4 text-cyan-500 transition-all animate-spin duration-1000" />
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <NavLink
            to="/cart"
            icon={ShoppingCart}
            label="Cart"
            className="relative"
            showCartCount
          />
          {userInfo ? (
            <UserMenu />
          ) : (
            <NavLink to="/login" icon={User} label="Sign In" />
          )}
        </nav>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="select-none md:hidden group text-cyan-500 transition-all duration-300 bg-transparent hover:bg-transparent relative overflow-hidden rounded-lg hover:text-cyan-400"
            >
              <div className="relative z-10">
                <Menu className="h-6 w-6 transition-transform duration-300 group-hover:rotate-90" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 animate-gradient-x"></div>
              <div className="absolute inset-0 bg-cyan-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 blur-sm"></div>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="select-none w-[300px] sm:w-[400px] bg-gray-950 border-l border-cyan-950"
          >
            <SheetClose asChild>
              <button className="absolute right-4 top-4 group p-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300">
                <X className="h-4 w-4 text-cyan-500 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
                <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </SheetClose>

            <nav className="flex flex-col space-y-4 mt-8 px-6">
              <SheetClose asChild>
                <NavLink
                  to="/cart"
                  icon={ShoppingCart}
                  label="Cart"
                  showCartCount
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
                          icon={Zap}
                          label="Products"
                        />
                      </SheetClose>
                      <SheetClose asChild>
                        <NavLink
                          to="/admin/userlist"
                          icon={User}
                          label="Users"
                        />
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
                  <SheetClose asChild>
                    <button
                      onClick={handleLogout}
                      className="select-none group w-full px-4 py-2 text-red-500 transition-all duration-300 flex items-center space-x-2 relative overflow-hidden rounded-lg hover:text-red-400"
                    >
                      <div className="relative z-10 flex items-center space-x-2">
                        <LogOut className="h-4 w-4 transition-all duration-300 group-hover:-translate-x-1 group-hover:rotate-12" />
                        <span>Logout</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                      <div className="absolute inset-0 bg-red-900/5 scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 blur-sm"></div>
                    </button>
                  </SheetClose>
                </>
              ) : (
                <SheetClose asChild>
                  <NavLink to="/login" icon={User} label="Sign In" />
                </SheetClose>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
