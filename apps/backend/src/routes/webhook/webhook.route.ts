import dotenv from "dotenv";
import { Request, Response } from "express";
import Stripe from "stripe";
import { prisma } from "../../server";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-03-31.basil",
});

const webhookHandler = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  let stripeEvent: Stripe.Event;
  //   console.log(process.env.STRIPE_SECRET_KEY);

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const userId = session.metadata?.userId;

    if (userId) {
      try {
        const cartId = await prisma.cart.findFirst({
          where: {
            userId: userId,
          },
        });
        if (!cartId) {
          console.error("Cart not found for user:", userId);
          res.status(404).json({ error: "Cart not found" });
          return;
        }
        await prisma.cartItems.deleteMany({
          where: {
            cartId: cartId.id,
          },
        });
      } catch (error) {
        console.error("Failed to delete cart items:", error);
        res.status(500).json({ error: "Failed to clear cart items" });
        return;
      }
    }
  }

  res.status(200).json({ received: true });
};

export default webhookHandler;
