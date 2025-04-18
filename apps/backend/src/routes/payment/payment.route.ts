import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";

dotenv.config();

const paymentRoute = express.Router();
const secretKey = process.env.STRIPE_SECRET_KEY;

const stripe = new Stripe(secretKey);

paymentRoute.post("/create-checkout-session", async (req, res) => {
  const { cartItems } = req.body;
  const { user } = req.body;

  const lineItems = cartItems.map((product: any) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: product.product.name,
          images: [product.product.displayImage],
        },
        unit_amount: Math.round(product.price) * 100,
      },
      quantity: product.quantity,
    };
  });

  //if premium user, no delivery charges -- Implement next

  // if (user.isPremuim !== true) {
  //   lineItems.push({
  //     price_data: {
  //       currency: "inr",
  //       product_data: {
  //         name: "Delivery Charges",
  //         images: [
  //           "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAktxu7k-JJYHjuNGFDlLqg-jim8m-jFa6rQ&s",
  //         ],
  //       },
  //       unit_amount: 49 * 100,
  //     },
  //     quantity: 1,
  //   });
  // }
  let totalAmount = 0;

  cartItems.forEach((product: any) => {
    totalAmount += Math.round(product.price) * product.quantity;
  });
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: process.env.SUCCESS_PAGE,
    cancel_url: process.env.FAILURE_PAGE,
    metadata: {
      userId: user.id,
      totalAmount: totalAmount,
      mode: "payment",
      paymentType: "card",
    },
  });

  // console.log(session);

  res.status(200).send({ id: session.id });
  return;
});

export default paymentRoute;
