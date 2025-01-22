import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveRecipe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { recipeId, userEmail } = req.body;

  if (!recipeId || !userEmail) {
    return res.status(400).json({
      status: "error",
      message: "Recipe ID and user email are required"
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found"
      });
    }

    const existingRecipe = await prisma.user.findFirst({
      where: {
        id: user.id,
        recipes: {
          some: { recipeId: recipeId }
        }
      }
    });

    if (!existingRecipe) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          recipes: {
            create: {
              recipeId: recipeId
            }
          }
        }
      });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Recipe already exists"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Recipe saved successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error
    });
  }
};

export const getRecipes = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({
      status: "error",
      message: "User email is required"
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        recipes: true
      }
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found"
      });
    }

    return res.status(200).json({
      status: "success",
      recipes: user.recipes
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error
    });
  }
};
