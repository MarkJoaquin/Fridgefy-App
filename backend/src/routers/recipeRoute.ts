import { Router } from "express";
import { saveRecipe, getSavedRecipes, deleteRecipe } from "../controllers/recipeController";


const router = Router();

router.post("/", saveRecipe);
router.get("/", getSavedRecipes);
router.delete("/", deleteRecipe);

export default router;