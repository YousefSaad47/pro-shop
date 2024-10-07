import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import Order from '../models/orderModel.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
});

const router = express.Router();

router.post(
  '/webhook/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error('[ERROR]', error.message);
      return res.status(400).send();
    }

    if (event.type === 'payment_intent.succeeded') {
      const order = await Order.findOne({
        paymentIntentId: event.data.object.id,
      });

      if (order) {
        order.status = 'paid';
        order.paidAt = Date.now();
        await order.save();
      }
    }

    return res.status(200).send();
  }
);

router.get('/config/stripe', (req, res) => {
  res.status(200).json({
    status: 'success',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

export default router;
