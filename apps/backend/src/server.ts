import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { rateLimit } from "express-rate-limit";
import addressRoute from "./routes/address/address.route";
import adminRoute from "./routes/adminRoutes/auth.route";
import adminUserAnalyticsRoute from "./routes/adminRoutes/usersAnalytic.route";
import authRoute from "./routes/auth/auth.route";
import cartItemRoute from "./routes/cart-item/cart-item.route";
import cartRoute from "./routes/cart/cart.route";
import categoryRoute from "./routes/category/category.route";
import contactRoute from "./routes/contact/contact.route";
import orderRoute from "./routes/order/order.route";
import paymentRoute from "./routes/payment/payment.route";
import productRoute from "./routes/product/product.route";
import addProductRoute from "./routes/sellerRoutes/add-product.route";
import sellerStatsRoute from "./routes/sellerRoutes/seller-stats.route";
import webhookHandler from "./routes/webhook/webhook.route";

import adminApprovalRoute from "./routes/adminRoutes/approval.route";
import { AuthenticatedRequest } from "./types/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedRequest;
    }
  }
}
export const prisma = new PrismaClient({
  log: ["error"],
});
dotenv.config();

const app = express();

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  webhookHandler
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://maalelo.vercel.app",
  "https://trazor.shop",
  "https://www.trazor.shop",
];

// Manual CORS handler to ensure only one origin is set
app.use((req: Request, res: Response, next: NextFunction): void => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Cookie"
    );
    res.setHeader("Access-Control-Expose-Headers", "Set-Cookie");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
      res.status(204).end();
      return;
    }
  }

  next();
});

//imit middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
  statusCode: 429,
});

app.set("trust proxy", 1);
app.use(limiter);

//testing purpose
app.get("/", (req, res) => {
  res.json("cookie Test Success!");
});

app.use(express.json());
app.use(cookieParser());
app.use("/cart", cartRoute);
app.use("/product", productRoute);
app.use("/auth", authRoute);
app.use("/category", categoryRoute);
app.use("/cartitem", cartItemRoute);
app.use("/address", addressRoute);
app.use("/payment", paymentRoute);
app.use("/order", orderRoute);
app.use("/contact", contactRoute);
app.use("/seller", sellerStatsRoute);
app.use("/addProduct", addProductRoute);
app.use("/admin", adminRoute);
app.use("/admin/users", adminUserAnalyticsRoute);
app.use("/admin/approval", adminApprovalRoute);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
