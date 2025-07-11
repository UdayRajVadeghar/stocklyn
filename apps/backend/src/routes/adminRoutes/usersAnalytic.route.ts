import { Router } from "express";
import { VerifyJwtMiddleware } from "../../middleware/verify-jwt";
import { prisma } from "../../server";

const adminUserAnalyticsRoute = Router();

adminUserAnalyticsRoute.get(
  "/analytics/:userId",
  VerifyJwtMiddleware,
  async (req, res) => {
    const userId = req.params.userId;

    const admin = await prisma.users.findFirst({
      where: {
        id: userId,
      },
    });

    if (!admin) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    try {
      const userCount = await prisma.users.count();
      const sellerCount = await prisma.users.count({
        where: {
          role: "seller",
        },
      });

      const buyerCount = await prisma.users.count({
        where: {
          role: "buyer",
        },
      });

      const sevenDaysAgo = new Date(
        new Date().setDate(new Date().getDate() - 7)
      );
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const newSignups = await prisma.users.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      });

      const oneDayAgo = new Date(new Date().setDate(new Date().getDate() - 1));
      oneDayAgo.setHours(0, 0, 0, 0);

      const activeUsers24h = await prisma.users.count({
        where: {
          lastLogin: {
            gte: oneDayAgo,
          },
        },
      });
      const activeUsers7d = await prisma.users.count({
        where: {
          lastLogin: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
      });
      res.status(200).json({
        userCount,
        sellerCount,
        buyerCount,
        newSignups,
        activeUsers24h,
        activeUsers7d,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

adminUserAnalyticsRoute.get(
  "/allUsersInfo",
  VerifyJwtMiddleware,
  async (req, res) => {
    const page = Number(req.query.page) || 0;
    // console.log(page);
    const take = 10;
    const skip = page * take;

    const users = await prisma.users.findMany({
      skip: skip,
      take: take,
    });

    res.status(200).json(users);
  }
);

export default adminUserAnalyticsRoute;
