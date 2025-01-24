import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

export const getIngredients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
        fridges: true
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
      ingredients: user.fridges,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching ingredients",
      error: error
    });
  }
};

export const saveIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userEmail, ingredientsToSave } = req.body;

  if (!userEmail || !ingredientsToSave || !Array.isArray(ingredientsToSave)) {
    return res.status(400).json({
      status: "error",
      message: "User email and a valid ingredients array are required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        fridges: true,
        shoppingItems: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const existingFridgeIngredients = user.fridges.map((fridge) =>
      fridge.ingredient.toLowerCase()
    );

    const existingShoppingItems = user.shoppingItems.map((item) =>
      item.ingredient.toLowerCase()
    );

    const newIngredientsToFridge: string[] = [];
    const newIngredientsToShoppingList: string[] = [];

    for (const ingredient of ingredientsToSave) {
      const normalizedIngredient = ingredient.toLowerCase().trim();

      if (!existingFridgeIngredients.includes(normalizedIngredient)) {
        if (!existingShoppingItems.includes(normalizedIngredient)) {
          newIngredientsToShoppingList.push(ingredient);
        }
      } else {
        newIngredientsToFridge.push(ingredient);
      }
    }

    // Guardar nuevos ingredientes en el frigorífico
    for (const ingredient of newIngredientsToFridge) {
      await prisma.fridge.create({
        data: {
          ingredient: String(ingredient),
          user: {
            connect: { email: String(userEmail) },
          },
        },
      });
    }

    // Guardar nuevos ingredientes en la lista de compras
    for (const ingredient of newIngredientsToShoppingList) {
      await prisma.shoppingItems.create({
        data: {
          ingredient: String(ingredient),
          user: {
            connect: { email: String(userEmail) },
          },
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Ingredients processed successfully",
      fridgeSaved: newIngredientsToFridge,
      shoppingListSaved: newIngredientsToShoppingList,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error processing ingredients",
      error: error,
    });
  }
};


