import { prisma } from "../utils";
import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

export const listCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await prisma.service.findMany({
      select: {
        categoryID: true,
      },
      distinct: ["categoryID"],
    });
    if (!categories) {
      throw createHttpError.Conflict("No categories found");
    } else {
      res
        .status(200)
        .json({ data: categories.map((category) => category.categoryID) });
    }
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categoryID = req.params.category;
    const { newCategoryID } = req.body;

    const categories = await prisma.service.updateMany({
      where: { categoryID },
      data: { categoryID: newCategoryID },
    });

    if (!categories) {
      throw createHttpError.Conflict("No categories found");
    } else {
      res.status(200).json({ message: "Category updated successfully" });
    }
  } catch (error) {
    next(error);
  }
};
