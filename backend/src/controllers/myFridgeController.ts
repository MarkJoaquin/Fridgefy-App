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
        if (!user) return res.status(404).json({ error: "User not found" });

        const fridgeItems = await prisma.fridge.findMany({
            where: { userId: user.id }
        });
        res.status(200).json(fridgeItems);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch fridge items" });
    }
};

export const myFridgeDelete = async (req: Request, res: Response) => {
    const { userEmail, ingredient } = req.body;
    if (!userEmail || !ingredient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User not found" });

        await prisma.fridge.deleteMany({
            where: { userId: user.id, ingredient }
        });
        res.status(200).json({ message: "Ingredient removed" });
    } catch (error) {
        res.status(500).json({ error: "Failed to remove ingredient" });
    }
};

export const myFridgePost = async (req: Request, res: Response) => {
    const { userEmail, ingredient } = req.body;
    if (!userEmail || !ingredient) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const user = await prisma.user.findUnique({ where: { email: userEmail } });
        if (!user) return res.status(404).json({ error: "User not found" });

        const newItem = await prisma.fridge.create({
            data: { userId: user.id, ingredient }
        });
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Failed to add ingredient" });
    }
};
