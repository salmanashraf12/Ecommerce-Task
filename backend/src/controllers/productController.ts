import { Request, Response } from "express";
import prisma from "../prisma";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : null;

    const skip = (page - 1) * limit;

    // Build where condition
    let whereCondition: any = {};
    if (categoryId) {
      whereCondition = {
        categories: {
          some: { categoryId },
        },
      };
    }

    // Get products
    const products = await prisma.product.findMany({
      where: whereCondition,
      include: { categories: { include: { category: true } } },
      skip,
      take: limit,
    });

    // Count total
    const total = await prisma.product.count({ where: whereCondition });

    res.json({
      data: products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stockQuantity, imageUrl, categoryIds } =
    req.body;

  if (!name || !price || stockQuantity == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      categories: {
        create: categoryIds.map((id: number) => ({
          category: { connect: { id } },
        })),
      },
    },
    include: { categories: { include: { category: true } } },
  });

  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, price, stockQuantity, imageUrl, categoryIds } =
    req.body;

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name,
      description,
      price,
      stockQuantity,
      imageUrl,
      categories: {
        deleteMany: {},
        create: categoryIds.map((cid: number) => ({
          category: { connect: { id: cid } },
        })),
      },
    },
    include: { categories: { include: { category: true } } },
  });

  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Remove related category links first
    await prisma.productCategory.deleteMany({
      where: { productId: Number(id) },
    });

    // Now delete the product
    await prisma.product.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Product deleted" });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

