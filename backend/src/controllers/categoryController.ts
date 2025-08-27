import { Request, Response } from "express";
import prisma from "../prisma";

export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  const category = await prisma.category.create({ data: { name } });
  res.json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await prisma.category.update({
    where: { id: Number(id) },
    data: { name },
  });

  res.json(category);
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Remove product-category links first
    await prisma.productCategory.deleteMany({
      where: { categoryId: Number(id) },
    });

    // Now delete the category itself
    await prisma.category.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Category deleted" });
  } catch (error: any) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

