import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import { VerifyJwtMiddleware } from "../../middleware/verify-jwt";

const productRoute = express.Router();

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

productRoute.get("/individualProduct/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      message:
        "Required feild is missing , ie productId at /product/individualProduct",
    });
    return;
  }

  try {
    const response = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });

    res.status(201).json(response);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error at /product/individualProduct", error });
  }
});

productRoute.get("/info", VerifyJwtMiddleware, async (req, res) => {
  try {
    const allProductInfo = await prisma.products.findMany();
    res.status(200).json(allProductInfo);
  } catch (error) {
    res.json(error);
  }
});

productRoute.post("/productDetails", VerifyJwtMiddleware, async (req, res) => {
  const { productIds } = req.body;
  console.log(req.body);
  if (!productIds) {
    res.status(400).json({
      message:
        "Required feild is missing , ie productIds[] at /product/productDetails",
    });
    return;
  }

  try {
    const productDetails = await prisma.products.findMany({
      where: {
        id: { in: productIds },
      },
    });
    res.status(200).json(productDetails);
  } catch (error) {
    res.status(401).json(error.message);
  }
});

//enable jwtverification later
productRoute.post("/add", async (req, res) => {
  let {
    name,
    imageUrl,
    productDescription = "",
    categoryDescription,
    category,
    price,
    details = "",
    highlights = [],
    stockQuantity,
    colors,
    displayImage,
    sizes,
  } = req.body;

  if (stockQuantity <= 10) {
    res.status(400).json({
      message: "Stock should be atleast more than 10",
    });
    return;
  }

  if (
    !name ||
    !category ||
    !imageUrl ||
    !price ||
    !colors ||
    !displayImage ||
    !stockQuantity
  ) {
    res.status(400).json({
      message:
        "Required feilds are missing , ie (id,name,imageUrl,category,imageUrl[],price,colors,displayImage) at /product/add",
    });
    return;
  }

  name = name.trim().substring(0, 30);
  category = category.toLowerCase().trim();

  //checking if the category exists

  try {
    let categoryRecord = await prisma.category.findFirst({
      where: {
        name: category,
      },
    });

    if (!categoryRecord) {
      if (!categoryDescription) {
        res.status(400).json({
          message:
            "Required feilds are missing , ie. categoryDescription (since the category doesnt exist) at /product/add",
        });
        return;
      }

      await prisma.category.create({
        data: {
          name: category,
          description: "Best category",
        },
      });
    }

    const response = await prisma.products.create({
      data: {
        name,
        imageUrl,
        productDescription,
        category: {
          //fix this error
          connect: {
            id: categoryRecord.id,
          },
        },
        price,
        sizes,
        details,
        highlights,
        reviews: 0,
        stockQuantity,
        colors,
        displayImage,
      },
    });

    res.status(201).json({ message: "Product added successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error at /product/add", error });
  }
});

productRoute.get("/getbycategory", async (req: Request, res: Response) => {
  try {
    const allCategoryJSONformat = await prisma.category.findMany({
      select: { name: true },
    });

    // res.send(allCategory);
    // return;

    const categoryArrayFormat: string[] = allCategoryJSONformat.map(
      (singleCategory) => {
        return singleCategory.name;
      }
    );

    const randomCategories = categoryArrayFormat
      .sort(() => Math.random() - 0.5)
      .slice(0, 10);

    const validCategories = await prisma.category.findMany({
      where: {
        name: {
          in: randomCategories,
        },
      },
      take: 10,
    });

    if (validCategories.length === 0) {
      res.status(404).json({
        message: `There is no such category as ${randomCategories} at /product/getbycategory`,
      });
      return;
    }

    // const categoryProducts = await prisma.products.findMany({
    //   where: {
    //     categoryName: {
    //       in: category,
    //     },
    //   },
    //   take: 3,
    // });

    const categoryProducts = await Promise.all(
      validCategories.map((currentCategory) => {
        return prisma.products.findMany({
          where: {
            categoryName: currentCategory.name,
          },
          take: 8,
        });
      })
    ).then((result) => {
      return result.flat();
    });

    res.status(201).json({
      message: "Products by category fetched successfully.",
      categoryProducts,
      randomCategories,
    });
  } catch (error) {
    res.status(500).json({ message: "Error at /product/getbycategory", error });
  }
});

//pagination

productRoute.get("/productPagination", async (req: Request, res: Response) => {
  const skip = +req.query.skip;
  const take = +req.query.take;

  // console.log(skip, take, "hello world");

  if (skip == undefined || take == undefined || take == 0) {
    res.status(400).json({
      message:
        "Required feilds are missing , ie. (skip or take) or take = 0 at /product/productPagination",
    });
    return;
  }

  try {
    const response = await prisma.products.findMany({
      skip: skip,
      take: take,
    });
    res
      .status(200)
      .json({ message: "Product fetched successfully", products: response });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error at /product/productPagination", error });
  }
});

//search

productRoute.get("/search", async (req: Request, res: Response) => {
  const searchValue = req.query.searchValue;

  if (!searchValue || typeof searchValue !== "string") {
    res.status(400).json({
      message:
        "Required feilds are missing or unmatched types, ie. searchValue at /product/search",
    });
    return;
  }

  try {
    const suggestions = await prisma.products.findMany({
      where: {
        OR: [
          { name: { contains: searchValue, mode: "insensitive" } },
          {
            productDescription: { contains: searchValue, mode: "insensitive" },
          },
          {
            category: { name: { contains: searchValue, mode: "insensitive" } },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 10,
    });
    res.status(200).send(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Error at /product/search", error });
  }
});

// productRoute.post("/sellersProduct", async (req: Request, res: Response) => {
//   const sellerId = "";

//   const seller = await prisma.users.findUnique({
//     where: { id: sellerId },
//   });

//   if (!seller) {
//     console.error("Seller with id '' not found.");
//     return;
//   }

//   const updated = await prisma.products.updateMany({
//     where: { sellerId: null },
//     data: { sellerId },
//   });

//   res.status(200).send(updated);
//   return;
//   // if (!sellerId) {
//   //   res.status(400).json({
//   //     message:
//   //       "Required feilds are missing , ie. sellerId at /product/sellerProducts",
//   //   });
//   //   return;
//   // }

//   //should be done later tomorrow , Testing is pending
// });

productRoute.get(
  `/similarProducts/:category`,
  async (req: Request, res: Response) => {
    const category = req.params.category;

    if (!category) {
      res.status(400).json({
        message:
          "Required feilds are missing , ie. category at /product/similarSearch",
      });
      return;
    }

    try {
      const similarProducts = await prisma.products.findMany({
        where: {
          category: {
            name: {
              contains: category,
            },
          },
        },
        take: 13,
      });
      // console.log(similarProducts);
      res.status(200).send(similarProducts);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error at /product/similarSearch", error });
    }
  }
);

export default productRoute;
