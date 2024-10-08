import asyncHandler from '../middleware/asyncHandler.js';
import Order from '../models/orderModel.js';
import { stripe } from '../utils/stripe.js';

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id,
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const pageSize = 7;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({ user: req.user._id });
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.status(200).json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.status(200).json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new Error('Order not found');
  }

  if (order.status === 'paid') {
    throw new Error('Order is already paid');
  }

  if (order.paymentIntentId) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      order.paymentIntentId
    );
    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.getTotalCents(),
    currency: 'usd',
    payment_method_types: ['card'],
  });

  order.paymentIntentId = paymentIntent.id;
  order.status = 'processing';
  await order.save();

  return res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

const getOrders = asyncHandler(async (req, res) => {
  const pageSize = 7;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({});
  const orders = await Order.find({})
    .populate('user', 'id name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.status(200).json({
    orders,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
