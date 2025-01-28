import { Router } from "express";
import { saveRecipe, getSavedRecipes, deleteRecipe, getAllRecipes } from "../controllers/recipeController";


const router = Router();

router.post("/", saveRecipe);
router.get("/", getSavedRecipes);
router.get('/all', getAllRecipes)
router.delete("/", deleteRecipe);

export default router;