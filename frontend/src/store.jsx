import { configureStore } from '@reduxjs/toolkit';
import { cartReducer } from './slices/cartSlice';
import { authReducer } from './slices/authSlice';
import { themeReducer } from './slices/ThemeSlice';
import { toggleTheme, setTheme } from './slices/ThemeSlice';
import {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePayment,
  clearCart,
} from './slices/cartSlice';
import { setCredentials, logout } from './slices/authSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    theme: themeReducer,
  },
});

export default store;
export {
  addToCart,
  removeFromCart,
  setCredentials,
  logout,
  saveShippingAddress,
  savePayment,
  clearCart,
  toggleTheme,
  setTheme,
};
