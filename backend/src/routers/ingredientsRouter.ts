import { Router } from "express";
import { savedIngredients, saveIngredient, deleteIngredient, saveIndividualIngredient } from "../controllers/ingredientsController";

const router = Router();

router.get("/", savedIngredients);
router.post("/", saveIngredient);
router.post("/saveIndividualIngredient", saveIndividualIngredient)
router.delete("/", deleteIngredient)

export default router;