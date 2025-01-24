import { Router } from "express";
import { saveRecipe, getRecipes } from "../controllers/recipeController";
import { removeRecipe } from "../controllers/removeController";

const router = Router();

router.post("/", saveRecipe);
router.get("/", getRecipes);
router.delete("/remove", removeRecipe);

export default router;