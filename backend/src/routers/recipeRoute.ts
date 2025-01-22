import { Router } from "express";
import { saveRecipe, getRecipes } from "../controllers/recipeController";


const router = Router();

router.post("/", saveRecipe);
router.get("/", getRecipes);

export default router;