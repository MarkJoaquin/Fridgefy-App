import { Router } from "express";
import { getIngredients, saveIngredient } from "../controllers/ingredientsController";

const router = Router();

router.get("/", getIngredients);
router.post("/", saveIngredient);

export default router;