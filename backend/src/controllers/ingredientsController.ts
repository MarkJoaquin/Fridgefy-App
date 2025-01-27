import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { error } from "console";

const prisma = new PrismaClient();

export const savedIngredients = async (
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

    return res.status(201).json({
      status: "success",
      ingredients: user.fridges
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error fetching ingredients",
      error: error
    });
  }
};

export const saveIndividualIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userEmail, ingredient } = req.body;

  if (!userEmail) {
    return res.status(400).json({
      status: "error",
      message: "User email is required"
    });
  }

  if (!ingredient) {
    return res.status(400).json({
      status: "error",
      message: "Ingredient is required"
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        fridges: true,
        shoppingItems: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const existingFridgeIngredients = user.fridges.map((fridge) =>
      fridge.ingredient.toLowerCase()
    );

    const existingShoppingItems = user.shoppingItems.map((item) =>
      item.ingredient.toLowerCase()
    );

    if (existingFridgeIngredients.includes(ingredient.toLowerCase())) {
      return res.status(400).json({
        status: "error",
        message: "Ingredient already exists in the fridge"
      });
    } else {
      await prisma.fridge.create({
        data: {
          userId: user.id,
          ingredient: String(ingredient)
        }
      });
    }

    if (existingShoppingItems.includes(ingredient.toLowerCase())) {
      await prisma.shoppingItems.deleteMany({
        where: {
          userId: user.id,
          ingredient: String(ingredient)
        }
      });
    }

    return res.status(201).json({
      status: "success",
      message: "Ingredient saved successfully",
      fridgeSaved: {
        ingredient: ingredient,
        userId: user.id
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error saving ingredient"
    });
  }
};

export const saveIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userEmail, ingredientsToSave } = req.body;

  if (!userEmail) {
    return res.status(400).json({
      status: "error",
      message: "User email is required"
    });
  }

  if (
    !ingredientsToSave ||
    !Array.isArray(ingredientsToSave) ||
    ingredientsToSave.length === 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "Valid ingredients array is required"
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        fridges: true,
        shoppingItems: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const existingFridgeIngredients = user.fridges.map((fridge) =>
      fridge.ingredient.toLowerCase()
    );

    const existingShoppingItems = user.shoppingItems.map((item) =>
      item.ingredient.toLowerCase()
    );

    const newIngredientsToShoppingList: string[] = [];

    for (const ingredient of ingredientsToSave) {
      const normalizedIngredient = ingredient.toLowerCase().trim();

      if (!existingFridgeIngredients.includes(normalizedIngredient) && 
          !existingShoppingItems.includes(normalizedIngredient)) {
        newIngredientsToShoppingList.push(ingredient);
      }
    }

    for (const ingredient of newIngredientsToShoppingList) {
      await prisma.shoppingItems.create({
        data: {
          ingredient: String(ingredient),
          user: {
            connect: { email: String(userEmail) }
          }
        }
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Ingredients processed successfully",
      shoppingListSaved: newIngredientsToShoppingList,
      skippedIngredients: ingredientsToSave.filter(ingredient => 
        existingFridgeIngredients.includes(ingredient.toLowerCase().trim())
      )
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error processing ingredients",
      error: error
    });
  }
};

export const deleteIngredient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userEmail, ingredient } = req.body;

  if (!ingredient || !userEmail) {
    return res.status(400).json({
      status: "error",
      message: "Ingredient and userEmail are required",
      error: error
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: String(userEmail) },
      include: {
        fridges: true,
        shoppingItems: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }

    const existingFridgeIngredients = user.fridges.map((fridge) =>
      fridge.ingredient.toLowerCase()
    );

    const existingShoppingItems = user.shoppingItems.map((item) =>
      item.ingredient.toLowerCase()
    );

    if (!existingFridgeIngredients.includes(ingredient.toLowerCase())) {
      if (!existingShoppingItems.includes(ingredient.toLowerCase())) {
        return res.status(404).json({
          status: "error",
          message: "Ingredient not found"
        });
      }
    }

    await prisma.fridge.deleteMany({
      where: {
        ingredient: String(ingredient),
        userId: user.id
      }
    });

    await prisma.shoppingItems.deleteMany({
      where: {
        ingredient: String(ingredient),
        userId: user.id
      }
    });

    return res.status(200).json({
      status: "success",
      message: "Ingredient deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error deleting ingredient",
      error: error
    });
  }
};
