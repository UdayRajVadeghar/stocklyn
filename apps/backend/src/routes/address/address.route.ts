import express, { Request, Response } from "express";
import { prisma } from "../../server";

const addressRoute = express.Router();

addressRoute.post("/addAddress", async (req: Request, res: Response) => {
  const {
    name,
    mobileNumber,
    state,
    pincode,
    city,
    Address1,
    Address2,
    Landmark,
    userId,
  } = req.body;

  if (
    !name ||
    !mobileNumber ||
    !state ||
    !pincode ||
    !city ||
    !Address1 ||
    !Address2 ||
    !Landmark ||
    !userId
  ) {
    console.log("Error at /address/addAddress , missing feilds");
    res.status(500).send("Something went wrong!");
    return;
  }

  try {
    const isValidUser = await prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!isValidUser) {
      console.log("Error at /address/addAddress , invalid userId");
      res.status(500).send("Something went wrong!");
    }

    const response = await prisma.location.create({
      data: {
        name,
        mobileNumber,
        state,
        pincode,
        city,
        Address1,
        Address2,
        Landmark,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    res.status(201).json({ message: "Added the location", response });
  } catch (error) {
    console.log("Error at /address/addAddress", error);
    res.status(500).send("Something went wrong!");
  }
});

addressRoute.get("/getAddress/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const response = await prisma.location.findMany({
      where: {
        userId: userId,
      },
    });
    res.status(200).json({ message: "Fetched all the locations ", response });
  } catch (error) {
    console.log("Error at /address/addAddress", error);
    res.status(500).send("Something went wrong!");
  }
});

export default addressRoute;
