import { Request, Response } from "express";

export const myFridgeAdd = async (req: Request, res: Response) => {
    const { recipeId, userEmail } = req.body;
    console.log(recipeId, userEmail);
}
