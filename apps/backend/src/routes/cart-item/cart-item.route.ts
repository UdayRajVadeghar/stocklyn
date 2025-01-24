import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const cartItemRoute = express.Router();
const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

cartItemRoute.get("/items/:cartId", async (req: Request, res: Response) => {
  const { cartId } = req.params;

  try {
    const response = await prisma.cartItems.findMany({
      where: {
        cartId,
      },
    });

    res.status(200).json({ message: "Success", response });
  } catch (error) {
    res.status(500).json({ message: "Error at /items/:cartId", error });
  }
});

cartItemRoute.put("/insert", async (req: Request, res: Response) => {
  const { cartId, productId, price } = req.body;

  if (!cartId || !productId || !price) {
    res.status(400).json({
      message:
        "Required feilds missing ie: productId or cartId or price at /cartitems/insert",
    });
    return;
  }

  try {
    const response = prisma.cartItems.create({
      data: {
        cartId,
        productId,
        price,
      },
    });

    res
      .send(201)
      .json({ message: "Success! Item added in the cartItem ", response });
  } catch (error) {
    res.status(500).json({ message: "Error at /cartItem/insert", error });
  }
});

export default cartItemRoute;
