import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const removeRecipe = async (req: Request, res: Response, next: NextFunction) => {
    const { recipeId, userEmail } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "User not found"
            });
        }

            const result = await prisma.recipe.deleteMany({
            where: {
                AND: [
                    { userId: user.id },
                    { recipeId: recipeId.toString() }
                ]
            }
        });


        res.status(200).json({
            status: "success",
            message: "Recipe removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error instanceof Error ? error.message : "Failed to remove recipe"
        });
    }
};  
