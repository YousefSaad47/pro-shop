const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const updateCart = (state) => {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, el) => acc + el.price * el.qty, 0)
  );

  state.shippingPrice = addDecimals(state.itemPrice > 100 ? 0 : 10);
  state.taxPrice = addDecimals(state.itemPrice > 100 ? 0 : 10);

  state.totalPrice = (
    Number(state.itemPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};

export { addDecimals, updateCart };
