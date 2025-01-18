import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";

const categoryRoute = express.Router();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

categoryRoute.get("/allcategory", async (req: Request, res: Response) => {
  try {
    const response = await prisma.category.count();
    res.send(response);
  } catch (error) {}
});

categoryRoute.post("/categoryitems", async (req: Request, res: Response) => {
  const { category } = req.body;

  if (!category) {
    res.status(400).json({
      message:
        "Required feild is missing , ie: category at /category/categoryitems",
    });
  }

  try {
    const response = await prisma.category.findMany({
      where: {
        name: category,
      },
      take: 4,
    });

    res
      .status(200)
      .json({ message: " Success in fetching the categories ", response });
  } catch (error) {
    res.status(500).json({ message: "Error at /product/add", error });
  }
});

export default categoryRoute;
