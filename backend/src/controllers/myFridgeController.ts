import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const myFridgeGet = async (req: Request, res: Response) => {
    const { userEmail } = req.query;
    if (!userEmail) {
        return res.status(400).json({ error: "userEmail is required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail as string }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const fridgeItems = await prisma.fridge.findMany({
            where: { userId: user.id }
        });
        res.status(200).json(fridgeItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fridge items" });
    }
}

export const myFridgeDelete = async (req: Request, res: Response) => {
    const { userEmail, ingredient } = req.body;
    
    if (!userEmail || !ingredient) {
        return res.status(400).json({ error: "userEmail and ingredient are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const itemToDelete = await prisma.fridge.findFirst({
            where: {
                userId: user.id,
                ingredient: ingredient
            }
        });

        console.log('Deleting fridge item:', {
            id: itemToDelete?.id,
            ingredient: itemToDelete?.ingredient,
            userId: itemToDelete?.userId
        });

        const deleteResult = await prisma.fridge.deleteMany({
            where: {
                userId: user.id,
                ingredient: ingredient
            }
        });

        if (deleteResult.count === 0) {
            return res.status(404).json({ message: "Ingredient not found in fridge" });
        }

        res.status(200).json({ message: "Ingredient removed successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove ingredient from fridge" });
    }
};

export const myFridgePost = async (req: Request, res: Response) => {
    const { userEmail, ingredient } = req.body;
    
    if (!userEmail || !ingredient) {
        return res.status(400).json({ error: "userEmail and ingredient are required" });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: userEmail }
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const newFridgeItem = await prisma.fridge.create({
            data: {
                ingredient,
                userId: user.id
            }
        });

        console.log('Ingredient added:', newFridgeItem);
        res.status(201).json(newFridgeItem);
    } catch (error) {
        console.error('Error adding ingredient:', error);
        res.status(500).json({ error: "Failed to add ingredient to fridge" });
    }
};

