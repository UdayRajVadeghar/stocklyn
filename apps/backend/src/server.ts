import { PrismaClient } from "@prisma/client";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import addressRoute from "./routes/address/address.route";
import authRoute from "./routes/auth/auth.route";
import cartItemRoute from "./routes/cart-item/cart-item.route";
import cartRoute from "./routes/cart/cart.route";
import categoryRoute from "./routes/category/category.route";
import productRoute from "./routes/product/product.route";
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

const allowedOrigins = ["http://localhost:5173", "https://maalelo.vercel.app"];

const app = express();
dotenv.config();
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
