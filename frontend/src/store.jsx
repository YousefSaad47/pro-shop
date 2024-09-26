import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./slices/cartSlice";
import { authReducer } from "./slices/authSlice";
import {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePayment,
  clearCart,
} from "./slices/cartSlice";
import { setCredentials, logout } from "./slices/authSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
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
};
