
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getShoppingList = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      status: "error",
      message: "User email is required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        shoppingItems: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user.shoppingItems
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const deleteShoppingItem = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail, ingredient } = req.body;

  if (!ingredient || !userEmail) {
    return res.status(400).json({
      status: "error",
      message: "Ingredient and user email are required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        shoppingItems: true,
      },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    const existingItem = user.shoppingItems.find((item) => item.ingredient === ingredient);

    if (!existingItem) {
      return res.status(400).json({
        status: "error",
        message: "Ingredient not found in shopping list",
      });
    }

    await prisma.user.update({
      where: { email: String(userEmail) },
      data: {
        shoppingItems: {
          delete: {
            id: existingItem.id,
          },
        },
      },
    });

    return res.status(200).json({
      status: "success",
      message: "Ingredient deleted from shopping list",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
