import { createSlice } from '@reduxjs/toolkit';
import { updateCart } from '../utils/cartUtils';

const initialState = JSON.parse(localStorage.getItem('cart')) || {
  cartItems: [],
  shippingAddress: {},
  paymentMethod: 'Credit Card',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find((el) => el._id === item._id);

      if (existingItem) {
        state.cartItems = state.cartItems.map((el) =>
          el._id === existingItem._id ? item : el
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (el) => el._id !== action.payload
      );
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePayment: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCart: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
  },
});

export const cartReducer = cartSlice.reducer;
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePayment,
  clearCart,
} = cartSlice.actions;
