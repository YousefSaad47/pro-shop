import express from "express";
import dotenv from "dotenv";
import { protect } from "../middleware/authMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Stripe from "stripe";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2020-08-27",
});

const router = express.Router();

router.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      console.error("[ERROR]", error.message);
      return res.status(400).send();
    }

    if (event.type === "payment_intent.succeeded") {
      const order = await Order.findOne({
        paymentIntentId: event.data.object.id,
      });

      order.isPaid = true;

      await order.save();
    }

    return res.status(200).send();
  },
);

export default router;
