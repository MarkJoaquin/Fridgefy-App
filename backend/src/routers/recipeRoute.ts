import { Router } from "express";
import { saveRecipe, getSavedRecipes, deleteRecipe, getAllRecipes } from "../controllers/recipeController";


const router = Router();

router.post("/", saveRecipe);
router.get("/", getSavedRecipes);
router.get('/getAllRecipes', getAllRecipes)
router.delete("/", deleteRecipe);

export default router;